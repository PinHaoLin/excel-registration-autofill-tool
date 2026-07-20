export function Toolbar({ entryCount, isProcessing, canProcess, onProcess }) {
  return (
    <section className="toolbar">
      <div>
        <p className="eyebrow">Excel 自動填寫工具</p>
        <h1>貼上報名資訊並寫入 Excel</h1>
      </div>
      <button type="button" onClick={onProcess} disabled={!canProcess}>
        {isProcessing ? "處理中..." : `寫入 ${entryCount || 0} 筆`}
      </button>
    </section>
  );
}
