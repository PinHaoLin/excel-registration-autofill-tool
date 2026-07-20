const fs = require("node:fs/promises");
const path = require("node:path");

function requireReadableStream() {
  try {
    return require("readable-stream");
  } catch {
    const excelPackagePath = require.resolve("exceljs/package.json");
    return require(path.join(path.dirname(excelPackagePath), "..", "readable-stream"));
  }
}

function patchReadableStreamAsyncIterator() {
  const { Readable } = requireReadableStream();

  if (Readable.prototype[Symbol.asyncIterator]) {
    return;
  }

  Readable.prototype[Symbol.asyncIterator] = async function* iterateReadableStream() {
    const stream = this;
    const chunks = [];
    let ended = false;
    let error = null;
    let notify = null;

    function wake() {
      if (notify) {
        notify();
        notify = null;
      }
    }

    stream.on("data", (chunk) => {
      chunks.push(chunk);
      wake();
    });
    stream.once("end", () => {
      ended = true;
      wake();
    });
    stream.once("error", (err) => {
      error = err;
      wake();
    });

    while (!ended || chunks.length) {
      if (error) {
        throw error;
      }

      if (chunks.length) {
        yield chunks.shift();
        continue;
      }

      await new Promise((resolve) => {
        notify = resolve;
      });
    }
  };
}

patchReadableStreamAsyncIterator();

const ExcelJS = require("exceljs");

const INSERT_ROW_NUMBER = 3;

function requireText(value, label) {
  const text = String(value ?? "").trim();

  if (!text) {
    throw new Error(`請填寫${label}`);
  }

  return text;
}

function parseOptionalAmount(value, label) {
  const text = String(value ?? "").trim();

  if (!text) {
    return null;
  }

  const normalized = text.replace(/[^\d.-]/g, "");
  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error(`${label}格式不正確`);
  }

  return amount;
}

function parseRequiredAmount(value, label) {
  const amount = parseOptionalAmount(value, label);

  if (amount === null) {
    throw new Error(`請填寫${label}`);
  }

  return amount;
}

function parseLocalDate(value) {
  const text = String(value ?? "").trim();
  const match = text.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);

  if (!match) {
    throw new Error("收款日格式需為 YYYY/MM/DD，例如 2026/03/16");
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error("收款日不是有效日期");
  }

  return date;
}

function formatDate(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function formatMonth(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function inferCourseMonth(sessionName) {
  const match = String(sessionName ?? "").match(/(\d{4})[/-](\d{1,2})[/-]\d{1,2}/);

  if (!match) {
    return "";
  }

  return `${match[1]}/${String(Number(match[2])).padStart(2, "0")}`;
}

function clone(value) {
  if (value === null || value === undefined) {
    return value;
  }

  return JSON.parse(JSON.stringify(value));
}

function adjustFormulaRows(formula, sourceRowNumber, targetRowNumber) {
  return String(formula).replace(/(\$?[A-Z]{1,3})(\$?)(\d+)/g, (match, column, fixedRow, rowText) => {
    if (fixedRow) {
      return match;
    }

    const rowNumber = Number(rowText);
    if (rowNumber !== sourceRowNumber) {
      return match;
    }

    return `${column}${targetRowNumber}`;
  });
}

function cloneCellValue(sourceCell, targetRowNumber) {
  const value = sourceCell.value;

  if (value && typeof value === "object" && ("formula" in value || "sharedFormula" in value)) {
    const formula = sourceCell.formula || value.formula;

    if (!formula) {
      return value.result ?? null;
    }

    return {
      formula: adjustFormulaRows(formula, sourceCell.row, targetRowNumber),
      result: clone(value.result)
    };
  }

  return clone(value);
}

function shiftFormulaRowsAfterInsert(worksheet, startRowNumber, insertedCount) {
  for (let rowNumber = startRowNumber; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const previousRowNumber = rowNumber - insertedCount;

    row.eachCell((cell) => {
      const value = cell.value;

      if (value && typeof value === "object" && "formula" in value) {
        cell.value = {
          ...clone(value),
          formula: adjustFormulaRows(value.formula, previousRowNumber, rowNumber)
        };
      }
    });
  }
}

function normalizeSharedFormulas(worksheet) {
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      const value = cell.value;

      if (!value || typeof value !== "object" || !("sharedFormula" in value)) {
        return;
      }

      const formula = cell.formula;
      cell.value = formula ? { formula, result: clone(value.result) } : value.result ?? null;
    });
  });
}

function copyRowTemplate(sourceRow, targetRow) {
  targetRow.height = sourceRow.height;

  sourceRow.eachCell({ includeEmpty: true }, (sourceCell, columnNumber) => {
    const targetCell = targetRow.getCell(columnNumber);
    targetCell.style = clone(sourceCell.style ?? {});
    targetCell.numFmt = sourceCell.numFmt;
    targetCell.value = cloneCellValue(sourceCell, targetRow.number);

    if (sourceCell.alignment) {
      targetCell.alignment = { ...sourceCell.alignment };
    }
  });
}

function removeConditionalFormatting(worksheet) {
  worksheet.conditionalFormattings = [];

  if (worksheet.model) {
    worksheet.model.conditionalFormattings = [];
  }
}

function normalizeEntry(entry, workbookPath) {
  const paymentDate = parseLocalDate(entry.paymentDate);
  const amount = parseOptionalAmount(entry.amount, "收款金額");

  return {
    workbookPath,
    name: requireText(entry.name, "姓名"),
    sessionName: requireText(entry.sessionName, "課程名稱"),
    paymentMethod: String(entry.paymentMethod ?? "匯款").trim() || "匯款",
    paymentDate,
    amount,
    courseTotal: parseRequiredAmount(entry.courseTotal, "課程金額"),
    transferLastFive: requireText(entry.transferLastFive, "刷卡末四碼或匯款末五碼"),
    note: String(entry.note ?? "").trim()
  };
}

function normalizeEntries(payload, workbookPath) {
  const rawEntries = Array.isArray(payload.entries) ? payload.entries : [payload];

  if (rawEntries.length === 0) {
    throw new Error("請提供至少一筆報名資料");
  }

  return rawEntries.map((entry) => normalizeEntry(entry, workbookPath));
}

async function addRegistrationToWorkbook(payload = {}) {
  const workbookPath = requireText(payload.workbookPath, "Excel 檔案");
  const entries = normalizeEntries(payload, workbookPath);
  const workbook = new ExcelJS.Workbook();

  const workbookBuffer = await fs.readFile(workbookPath);
  await workbook.xlsx.load(workbookBuffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("Excel 檔案沒有可寫入的工作表");
  }

  const insertedCount = entries.length;
  const sourceRowNumber = INSERT_ROW_NUMBER + insertedCount;

  worksheet.insertRows(INSERT_ROW_NUMBER, Array.from({ length: insertedCount }, () => []));
  shiftFormulaRowsAfterInsert(worksheet, sourceRowNumber, insertedCount);

  const sourceRow = worksheet.getRow(sourceRowNumber);

  entries.forEach((entry, index) => {
    const rowNumber = INSERT_ROW_NUMBER + index;
    const row = worksheet.getRow(rowNumber);

    copyRowTemplate(sourceRow, row);

    row.getCell(1).value = { formula: `TEXT(B${rowNumber},"yyyy-mm")` };
    row.getCell(2).value = formatDate(entry.paymentDate);
    row.getCell(3).value = entry.paymentMethod;
    row.getCell(4).value = entry.transferLastFive;
    row.getCell(5).value = entry.amount;
    row.getCell(6).value = entry.name;
    row.getCell(7).value = entry.sessionName;
    row.getCell(8).value = entry.courseTotal;
    row.getCell(11).value = inferCourseMonth(entry.sessionName) || formatMonth(entry.paymentDate);
    row.getCell(12).value = entry.note || null;
    row.commit();
  });

  removeConditionalFormatting(worksheet);
  normalizeSharedFormulas(worksheet);

  await workbook.xlsx.writeFile(workbookPath);

  return {
    ok: true,
    sheetName: worksheet.name,
    rowNumber: INSERT_ROW_NUMBER,
    insertedCount,
    outputPath: workbookPath,
    message: `已寫入原 Excel 檔案，共新增 ${insertedCount} 筆`
  };
}

module.exports = {
  addRegistrationToWorkbook
};
