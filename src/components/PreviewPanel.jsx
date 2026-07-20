import { ResultMessage } from "./ResultMessage";

export function PreviewPanel({ parsed, error, result }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>解析預覽</h2>
        <span>{parsed.entries.length} 筆資料</span>
      </div>

      <div className="preview-body">
        {parsed.summary ? <SummaryGrid summary={parsed.summary} /> : null}

        <div className="entry-list">
          {parsed.entries.map((entry, index) => (
            <EntryCard entry={entry} index={index} key={`${entry.sessionName}-${index}`} />
          ))}
        </div>

        <ResultMessage error={error} result={result} />
      </div>
    </div>
  );
}

function SummaryGrid({ summary }) {
  return (
    <div className="summary-grid">
      <span>姓名</span>
      <strong>{summary.name || "-"}</strong>
      <span>付款</span>
      <strong>
        {summary.paymentMethod} {summary.paymentCode || ""}
      </strong>
      <span>收款日</span>
      <strong>{summary.paymentDate || "-"}</strong>
      <span>分期</span>
      <strong>{summary.isInstallment ? "是" : "否"}</strong>
    </div>
  );
}

function EntryCard({ entry, index }) {
  return (
    <div className="entry-card">
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
  );
}
