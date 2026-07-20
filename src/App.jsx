import { useMemo, useState } from "react";

const SAMPLE_TEXT = `右胖虎 2026/6/13-6/14 A廠商-B案 高雄場
總金額：$10600 分三期 (團報優惠$10000、加購生理學說明$200、加購解剖學說明$400)
匯款末五碼：40289
第一期: $4600
-
右胖虎 3/10已匯款`;

function formatDate(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function todayText() {
  return formatDate(new Date());
}

function normalizeMoney(value) {
  const amount = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(amount) ? String(amount) : "";
}

function parseFirstMoney(value) {
  const text = String(value ?? "");
  const match = text.match(/(?:NT\$|NTD|\$)?\s*(-?\d{1,3}(?:,\d{3})+|-?\d+)(?:\.\d+)?/i);

  return match ? normalizeMoney(match[0]) : "";
}

function getField(text, labels) {
  for (const label of labels) {
    const pattern = new RegExp(`${label}\\s*[:：]\\s*([^\\n\\r]+)`, "i");
    const match = text.match(pattern);

    if (match) {
      return match[1].trim();
    }
  }

  return "";
}

function parseFirstLine(text) {
  const firstLine = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && line !== "-");

  if (!firstLine) {
    return { name: "", sessionName: "" };
  }

  const dateIndex = firstLine.search(/\d{4}[/-]\d{1,2}[/-]\d{1,2}/);

  if (dateIndex <= 0) {
    return { name: "", sessionName: firstLine };
  }

  return {
    name: firstLine.slice(0, dateIndex).trim(),
    sessionName: firstLine.slice(dateIndex).trim()
  };
}

function inferYear(text) {
  const match = text.match(/\b(20\d{2})[/-]\d{1,2}[/-]\d{1,2}/);
  return match ? Number(match[1]) : new Date().getFullYear();
}

function parseRemittanceDate(text) {
  const match = text.match(/(\d{1,2})[/-](\d{1,2})\s*已匯款/);

  if (!match) {
    return "";
  }

  const year = inferYear(text);
  const month = Number(match[1]);
  const day = Number(match[2]);
  return formatDate(new Date(year, month - 1, day));
}

function hasInstallments(totalLine, text) {
  return /分[二兩三四五六七八九十\d]+期/.test(totalLine) || /第一期/.test(text);
}

function parseLineItems(totalLine, totalAmount) {
  const bracketMatch = totalLine.match(/[（(]([^）)]+)[）)]/);

  if (!bracketMatch) {
    return [{ label: "", amount: totalAmount }];
  }

  return bracketMatch[1]
    .split(/[、,，]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const match = item.match(/^(.*?)(?:\$?\s*([\d,]+))?$/);
      const label = (match?.[1] || item).trim();
      const amount = normalizeMoney(match?.[2]) || totalAmount;

      return { label, amount };
    });
}

function buildNote(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim());

  while (lines.length && !lines[lines.length - 1]) {
    lines.pop();
  }

  if (lines.length && /已匯款/.test(lines[lines.length - 1])) {
    lines.pop();
  }

  while (lines.length && (!lines[lines.length - 1] || lines[lines.length - 1] === "-")) {
    lines.pop();
  }

  return lines.filter(Boolean).join("\n");
}

function parseRegistrationText(text) {
  const normalized = text.trim();

  if (!normalized) {
    return { entries: [], summary: null };
  }

  const firstLineData = parseFirstLine(normalized);
  const name = getField(normalized, ["姓名"]) || firstLineData.name;
  const sessionName = getField(normalized, ["報名場次", "场次"]) || firstLineData.sessionName;
  const totalLine = getField(normalized, ["總金額", "总金额"]);
  const installmentAmount = parseFirstMoney(getField(normalized, ["第一期金額", "第一期金额", "第一期"]));
  const cardLastFour = getField(normalized, ["刷卡末四碼", "刷卡末四码"]);
  const transferLastFive = getField(normalized, ["匯款末五碼", "匯款末五码", "匯款帳號末五碼"]);
  const totalAmount = parseFirstMoney(totalLine);
  const isCard = Boolean(cardLastFour);
  const paymentMethod = isCard ? "刷卡" : "匯款";
  const paymentDate = isCard ? todayText() : parseRemittanceDate(normalized);
  const paymentCode = cardLastFour || transferLastFive;
  const isInstallment = hasInstallments(totalLine, normalized);
  const lineItems = parseLineItems(totalLine, totalAmount);
  const note = buildNote(normalized);

  const entries = lineItems.map((item, index) => ({
    name,
    sessionName: index === 0 ? sessionName : item.label,
    amount: isInstallment ? (index === 0 ? installmentAmount : "") : totalAmount,
    courseTotal: item.amount || totalAmount,
    transferLastFive: paymentCode,
    paymentDate,
    paymentMethod,
    note
  }));

  return {
    entries,
    summary: {
      name,
      sessionName,
      totalAmount,
      installmentAmount,
      paymentMethod,
      paymentCode,
      paymentDate,
      isInstallment,
      itemCount: entries.length
    }
  };
}

function validateEntries(entries) {
  if (!entries.length) {
    return "請貼上報名資訊";
  }

  for (const [index, entry] of entries.entries()) {
    const rowLabel = `第 ${index + 1} 筆`;

    if (!entry.name) return `${rowLabel}缺少姓名`;
    if (!entry.sessionName) return `${rowLabel}缺少課程名稱`;
    if (index === 0 && !entry.amount) return "缺少收款金額";
    if (!entry.courseTotal) return `${rowLabel}缺少課程金額`;
    if (!entry.paymentMethod) return "缺少付款方式";
    if (!entry.paymentDate) return "缺少收款日";
    if (!entry.transferLastFive) return "缺少刷卡末四碼或匯款末五碼";
  }

  return "";
}

function getFileName(filePath) {
  return String(filePath || "").split(/[\\/]/).filter(Boolean).pop() || "-";
}

function ResultMessage({ error, result }) {
  if (error) {
    return (
      <div className="status-card status-card-error">
        <strong>寫入沒有完成</strong>
        <p>請依照下方訊息調整後再試一次。如果仍無法處理，請將這段訊息提供給管理者。</p>
        <div className="status-detail status-detail-error">{error}</div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="status-card status-card-success">
        <strong>已完成寫入</strong>
        <p>Excel 檔案已更新，可以打開檔案確認新增資料。</p>
        <dl className="status-list">
          <dt>新增筆數</dt>
          <dd>{result.insertedCount ?? 0} 筆</dd>
          <dt>工作表</dt>
          <dd>{result.sheetName || "-"}</dd>
          <dt>寫入位置</dt>
          <dd>第 {result.rowNumber || 3} 列開始</dd>
          <dt>檔案名稱</dt>
          <dd>{getFileName(result.outputPath)}</dd>
          <dt>檔案路徑</dt>
          <dd>{result.outputPath || "-"}</dd>
        </dl>
      </div>
    );
  }

  return (
    <div className="status-card status-card-idle">
      <strong>尚未寫入 Excel</strong>
      <p>請先選擇 Excel 檔案，貼上報名/付款文字，確認右側預覽正確後再按寫入。</p>
    </div>
  );
}

function App() {
  const [rawText, setRawText] = useState(SAMPLE_TEXT);
  const [workbookPath, setWorkbookPath] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const parsed = useMemo(() => parseRegistrationText(rawText), [rawText]);
  const validationError = useMemo(() => validateEntries(parsed.entries), [parsed.entries]);
  const canProcess = workbookPath && !validationError && !isProcessing;

  async function handleSelectWorkbook() {
    setError("");
    const selectedPath = await window.autoFillTool.selectWorkbook();

    if (selectedPath) {
      setWorkbookPath(selectedPath);
    }
  }

  async function handleProcess() {
    setError("");
    setResult(null);
    setIsProcessing(true);

    try {
      const nextResult = await window.autoFillTool.addRegistration({
        workbookPath,
        entries: parsed.entries
      });
      setResult(nextResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "處理資料時發生錯誤");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="toolbar">
        <div>
          <p className="eyebrow">Excel 自動填寫工具</p>
          <h1>貼上報名資訊並寫入 Excel</h1>
        </div>
        <button type="button" onClick={handleProcess} disabled={!canProcess}>
          {isProcessing ? "處理中..." : `寫入 ${parsed.entries.length || 0} 筆`}
        </button>
      </section>

      <section className="workspace">
        <div className="panel">
          <div className="panel-header">
            <h2>輸入資料</h2>
            <span>貼上報名文字</span>
          </div>

          <div className="form-body">
            <label>
              Excel 檔案
              <div className="file-row">
                <input value={workbookPath || "尚未選擇檔案"} readOnly />
                <button type="button" className="secondary-button" onClick={handleSelectWorkbook}>
                  選擇
                </button>
              </div>
            </label>

            <label>
              報名資訊
              <textarea
                className="paste-input"
                value={rawText}
                onChange={(event) => setRawText(event.target.value)}
              />
            </label>

            {validationError ? <p className="inline-error">{validationError}</p> : null}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>解析預覽</h2>
            <span>{parsed.entries.length} 筆資料</span>
          </div>

          <div className="preview-body">
            {parsed.summary ? (
              <div className="summary-grid">
                <span>姓名</span>
                <strong>{parsed.summary.name || "-"}</strong>
                <span>付款</span>
                <strong>
                  {parsed.summary.paymentMethod} {parsed.summary.paymentCode || ""}
                </strong>
                <span>收款日</span>
                <strong>{parsed.summary.paymentDate || "-"}</strong>
                <span>分期</span>
                <strong>{parsed.summary.isInstallment ? "是" : "否"}</strong>
              </div>
            ) : null}

            <div className="entry-list">
              {parsed.entries.map((entry, index) => (
                <div className="entry-card" key={`${entry.sessionName}-${index}`}>
                  <div>
                    <span>#{index + 1}</span>
                    <strong>{entry.sessionName || "-"}</strong>
                  </div>
                  <dl>
                    <dt>收款金額</dt>
                    <dd>{entry.amount || "-"}</dd>
                    <dt>課程金額</dt>
                    <dd>{entry.courseTotal || "-"}</dd>
                    <dt>備註</dt>
                    <dd className="note-preview">{entry.note || "-"}</dd>
                  </dl>
                </div>
              ))}
            </div>

            <ResultMessage error={error} result={result} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
