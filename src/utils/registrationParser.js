export const SAMPLE_TEXT = `右胖虎 2026/6/13-6/14 A廠商-B案 高雄場
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

export function parseRegistrationText(text) {
  const normalized = text.trim();

  if (!normalized) {
    return { entries: [], summary: null };
  }

  const firstLineData = parseFirstLine(normalized);
  const name = getField(normalized, ["姓名"]) || firstLineData.name;
  const sessionName = getField(normalized, ["報名場次", "场次"]) || firstLineData.sessionName;
  const totalLine = getField(normalized, ["總金額", "总金额"]);
  const installmentAmount = parseFirstMoney(
    getField(normalized, ["第一期金額", "第一期金额", "第一期"])
  );
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
    amount: isInstallment ? (index === 0 ? installmentAmount : "") : item.amount || totalAmount,
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

export function validateEntries(entries) {
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
