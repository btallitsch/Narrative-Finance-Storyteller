import { useState } from 'react';
import type { FinancialDataset, QuarterData } from '../types';
import { SAMPLE_FINANCIAL_DATA } from '../data/definitions';
import { parseCSVToQuarters } from '../logic/dataTransformer';

interface DataInputProps {
  onComplete: (data: FinancialDataset) => void;
  initialData: FinancialDataset | null;
}

const DEFAULT_QUARTERS: QuarterData[] = [
  { label: 'Q1 2024', revenue: 0, expenses: 0, profit: 0, growth: 0 },
  { label: 'Q2 2024', revenue: 0, expenses: 0, profit: 0, growth: 0 },
  { label: 'Q3 2024', revenue: 0, expenses: 0, profit: 0, growth: 0 },
  { label: 'Q4 2024', revenue: 0, expenses: 0, profit: 0, growth: 0 },
];

export default function DataInput({ onComplete, initialData }: DataInputProps) {
  const [companyName, setCompanyName] = useState(initialData?.companyName ?? '');
  const [industry, setIndustry] = useState(initialData?.industry ?? '');
  const [currency, setCurrency] = useState(initialData?.currency ?? 'USD');
  const [reportingPeriod, setReportingPeriod] = useState(initialData?.reportingPeriod ?? '2024');
  const [quarters, setQuarters] = useState<QuarterData[]>(initialData?.quarters ?? DEFAULT_QUARTERS);
  const [csvText, setCsvText] = useState('');
  const [inputMode, setInputMode] = useState<'manual' | 'csv'>('manual');
  const [errors, setErrors] = useState<string[]>([]);

  function loadSample() {
    setCompanyName(SAMPLE_FINANCIAL_DATA.companyName);
    setIndustry(SAMPLE_FINANCIAL_DATA.industry);
    setCurrency(SAMPLE_FINANCIAL_DATA.currency);
    setReportingPeriod(SAMPLE_FINANCIAL_DATA.reportingPeriod);
    setQuarters(SAMPLE_FINANCIAL_DATA.quarters);
  }

  function updateQuarter(index: number, field: keyof QuarterData, value: string) {
    setQuarters((prev) =>
      prev.map((q, i) => {
        if (i !== index) return q;
        const numVal = field === 'label' ? 0 : parseFloat(value) || 0;
        return { ...q, [field]: field === 'label' ? value : numVal };
      })
    );
  }

  function addQuarter() {
    const n = quarters.length + 1;
    setQuarters((prev) => [
      ...prev,
      { label: `Q${n} ${reportingPeriod}`, revenue: 0, expenses: 0, profit: 0, growth: 0 },
    ]);
  }

  function removeQuarter(index: number) {
    setQuarters((prev) => prev.filter((_, i) => i !== index));
  }

  function parseCSV() {
    try {
      const parsed = parseCSVToQuarters(csvText);
      if (parsed.length === 0) throw new Error('No valid rows found');
      setQuarters(parsed);
      setInputMode('manual');
    } catch {
      setErrors(['Could not parse CSV. Ensure format: Label, Revenue, Expenses, Profit, Growth%']);
    }
  }

  function autoCalcProfit(index: number) {
    setQuarters((prev) =>
      prev.map((q, i) => {
        if (i !== index) return q;
        return { ...q, profit: q.revenue - q.expenses };
      })
    );
  }

  function validate(): boolean {
    const errs: string[] = [];
    if (!companyName.trim()) errs.push('Company name is required');
    if (quarters.length < 2) errs.push('At least 2 quarters of data required');
    if (quarters.some((q) => q.revenue <= 0)) errs.push('All quarters must have revenue > 0');
    setErrors(errs);
    return errs.length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onComplete({ companyName, industry, currency, reportingPeriod, quarters });
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Enter Your Financial Data</h2>
        <p className="step-subtitle">
          Provide your quarterly figures. We'll transform them into a narrative your whole team can understand.
        </p>
      </div>

      {/* Sample data banner */}
      <div className="sample-banner">
        <span>🎭 New here?</span>
        <button className="btn-link" onClick={loadSample}>
          Load sample data for Meridian Ventures →
        </button>
      </div>

      {/* Company info */}
      <div className="form-section">
        <h3 className="form-section-title">Company Details</h3>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Company Name *</label>
            <input
              className="form-input"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Industry</label>
            <input
              className="form-input"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. SaaS / E-commerce"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Reporting Period</label>
            <input
              className="form-input"
              value={reportingPeriod}
              onChange={(e) => setReportingPeriod(e.target.value)}
              placeholder="e.g. 2024"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Currency</label>
            <select className="form-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="CAD">CAD — Canadian Dollar</option>
              <option value="AUD">AUD — Australian Dollar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Input mode toggle */}
      <div className="form-section">
        <div className="mode-toggle">
          <button
            className={`mode-btn ${inputMode === 'manual' ? 'active' : ''}`}
            onClick={() => setInputMode('manual')}
          >
            📋 Manual Entry
          </button>
          <button
            className={`mode-btn ${inputMode === 'csv' ? 'active' : ''}`}
            onClick={() => setInputMode('csv')}
          >
            📂 Paste CSV
          </button>
        </div>

        {inputMode === 'csv' ? (
          <div className="csv-zone">
            <p className="csv-hint">
              <strong>Format:</strong> Label, Revenue, Expenses, Profit, Growth%<br />
              <code>Q1 2024, 420000, 390000, 30000, 5.0</code>
            </p>
            <textarea
              className="form-input csv-input"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={`Quarter, Revenue, Expenses, Profit, Growth\nQ1 2024, 420000, 390000, 30000, 5.0\nQ2 2024, 510000, 410000, 100000, 21.4`}
              rows={6}
            />
            <button className="btn-secondary" onClick={parseCSV}>
              Parse CSV →
            </button>
          </div>
        ) : (
          <div className="quarters-table">
            <h3 className="form-section-title">Quarterly Performance *</h3>
            <div className="quarters-header">
              <span>Quarter</span>
              <span>Revenue</span>
              <span>Expenses</span>
              <span>Profit</span>
              <span>Growth %</span>
              <span></span>
            </div>
            {quarters.map((q, i) => (
              <div key={i} className="quarter-row">
                <input
                  className="form-input quarter-label"
                  value={q.label}
                  onChange={(e) => updateQuarter(i, 'label', e.target.value)}
                />
                <input
                  className="form-input"
                  type="number"
                  value={q.revenue || ''}
                  onChange={(e) => updateQuarter(i, 'revenue', e.target.value)}
                  placeholder="0"
                />
                <input
                  className="form-input"
                  type="number"
                  value={q.expenses || ''}
                  onChange={(e) => updateQuarter(i, 'expenses', e.target.value)}
                  placeholder="0"
                />
                <div className="profit-cell">
                  <input
                    className="form-input"
                    type="number"
                    value={q.profit || ''}
                    onChange={(e) => updateQuarter(i, 'profit', e.target.value)}
                    placeholder="0"
                  />
                  <button
                    className="calc-btn"
                    title="Auto-calculate (Revenue - Expenses)"
                    onClick={() => autoCalcProfit(i)}
                  >
                    ⚡
                  </button>
                </div>
                <input
                  className="form-input"
                  type="number"
                  value={q.growth || ''}
                  onChange={(e) => updateQuarter(i, 'growth', e.target.value)}
                  placeholder="0.0"
                  step="0.1"
                />
                <button
                  className="remove-btn"
                  onClick={() => removeQuarter(i)}
                  disabled={quarters.length <= 2}
                  title="Remove quarter"
                >
                  ×
                </button>
              </div>
            ))}
            <button className="btn-ghost add-quarter" onClick={addQuarter}>
              + Add Quarter
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="error-list">
          {errors.map((e, i) => (
            <p key={i} className="error-item">⚠ {e}</p>
          ))}
        </div>
      )}

      <div className="step-actions">
        <button className="btn-primary" onClick={handleSubmit}>
          Continue to Story Configuration →
        </button>
      </div>
    </div>
  );
}
