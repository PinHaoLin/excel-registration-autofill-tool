export function InputPanel({
  rawText,
  workbookPath,
  validationError,
  onRawTextChange,
  onSelectWorkbook
}) {
  return (
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
            <button type="button" className="secondary-button" onClick={onSelectWorkbook}>
              選擇
            </button>
          </div>
        </label>

        <label>
          報名資訊
          <textarea
            className="paste-input"
            value={rawText}
            onChange={(event) => onRawTextChange(event.target.value)}
          />
        </label>

        {validationError ? <p className="inline-error">{validationError}</p> : null}
      </div>
    </div>
  );
}
