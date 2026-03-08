import { useState } from 'react';
import type { GeneratedNarrative, FinancialDataset, NarrativeConfig } from '../types';
import { exportAsText, exportAsHTML, downloadTextFile } from '../logic/exportEngine';

interface ExportPanelProps {
  narrative: GeneratedNarrative;
  dataset: FinancialDataset;
  config: NarrativeConfig;
  onBack: () => void;
  onStartOver: () => void;
}

export default function ExportPanel({ narrative, dataset, config, onBack, onStartOver }: ExportPanelProps) {
  const [copied, setCopied] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);

  const safeFilename = `${dataset.companyName.replace(/\s+/g, '-').toLowerCase()}-${dataset.reportingPeriod}`;

  function handleCopyText() {
    const text = exportAsText(narrative, dataset, config);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownloadTxt() {
    const text = exportAsText(narrative, dataset, config);
    downloadTextFile(text, `${safeFilename}-narrative.txt`);
    setExportedFormat('txt');
  }

  function handleDownloadHTML() {
    const html = exportAsHTML(narrative, dataset);
    downloadTextFile(html, `${safeFilename}-narrative.html`);
    setExportedFormat('html');
  }

  function handleDownloadJSON() {
    const json = JSON.stringify({ narrative, dataset, config }, null, 2);
    downloadTextFile(json, `${safeFilename}-data.json`);
    setExportedFormat('json');
  }

  const textContent = exportAsText(narrative, dataset, config);

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Export Your Narrative</h2>
        <p className="step-subtitle">
          Share the story with your team, investors, or board in the format that works best for you.
        </p>
      </div>

      <div className="export-grid">
        <button className="export-card" onClick={handleCopyText}>
          <span className="export-icon">📋</span>
          <span className="export-title">{copied ? '✓ Copied!' : 'Copy to Clipboard'}</span>
          <span className="export-desc">Paste directly into Slack, email, or any document</span>
        </button>

        <button className="export-card" onClick={handleDownloadTxt}>
          <span className="export-icon">📄</span>
          <span className="export-title">Download .txt</span>
          <span className="export-desc">Plain text file for universal compatibility</span>
          {exportedFormat === 'txt' && <span className="export-done">✓ Downloaded</span>}
        </button>

        <button className="export-card" onClick={handleDownloadHTML}>
          <span className="export-icon">🌐</span>
          <span className="export-title">Download .html</span>
          <span className="export-desc">Styled HTML report — open in any browser</span>
          {exportedFormat === 'html' && <span className="export-done">✓ Downloaded</span>}
        </button>

        <button className="export-card" onClick={handleDownloadJSON}>
          <span className="export-icon">🗄️</span>
          <span className="export-title">Download .json</span>
          <span className="export-desc">Raw data + narrative for integration or storage</span>
          {exportedFormat === 'json' && <span className="export-done">✓ Downloaded</span>}
        </button>
      </div>

      {/* Preview */}
      <div className="form-section">
        <h3 className="form-section-title">Plain Text Preview</h3>
        <pre className="text-preview">{textContent}</pre>
      </div>

      <div className="step-actions">
        <button className="btn-ghost" onClick={onBack}>
          ← Back to Narrative
        </button>
        <button className="btn-secondary" onClick={onStartOver}>
          🔁 Start New Report
        </button>
      </div>
    </div>
  );
}
