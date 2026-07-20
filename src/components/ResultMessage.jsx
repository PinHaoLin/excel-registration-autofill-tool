function getFileName(filePath) {
  return String(filePath || "").split(/[\\/]/).filter(Boolean).pop() || "-";
}

export function ResultMessage({ error, result }) {
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
