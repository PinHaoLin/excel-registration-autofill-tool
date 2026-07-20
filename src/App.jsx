import { useMemo, useState } from "react";
import { InputPanel } from "./components/InputPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { Toolbar } from "./components/Toolbar";
import { parseRegistrationText, SAMPLE_TEXT, validateEntries } from "./utils/registrationParser";

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
      <Toolbar
        canProcess={canProcess}
        entryCount={parsed.entries.length}
        isProcessing={isProcessing}
        onProcess={handleProcess}
      />

      <section className="workspace">
        <InputPanel
          rawText={rawText}
          workbookPath={workbookPath}
          validationError={validationError}
          onRawTextChange={setRawText}
          onSelectWorkbook={handleSelectWorkbook}
        />

        <PreviewPanel parsed={parsed} error={error} result={result} />
      </section>
    </main>
  );
}

export default App;
