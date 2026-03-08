import type { GeneratedNarrative, FinancialDataset, NarrativeConfig } from '../types';
import ChartPanel from './ChartPanel';
import { COMPLIANCE_TEMPLATES } from '../data/definitions';

interface NarrativeReportProps {
  narrative: GeneratedNarrative;
  dataset: FinancialDataset;
  config: NarrativeConfig;
  onExport: () => void;
  onRegenerate: () => void;
  onBack: () => void;
}

export default function NarrativeReport({
  narrative,
  dataset,
  config,
  onExport,
  onRegenerate,
  onBack,
}: NarrativeReportProps) {
  const template = COMPLIANCE_TEMPLATES.find((t) => t.id === config.complianceTemplate);

  return (
    <div className="narrative-container">
      {/* Disclaimer banner */}
      {template?.disclaimer && (
        <div className="disclaimer-banner">
          <span className="disclaimer-icon">⚠️</span>
          <span>{template.disclaimer}</span>
        </div>
      )}

      {/* Report Header */}
      <div className="narrative-header">
        <div className="archetype-pill">{narrative.archetypeLabel}</div>
        <h1 className="narrative-headline">{narrative.headline}</h1>
        <p className="narrative-subheadline">{narrative.subheadline}</p>
        <div className="narrative-meta">
          <span>📅 {narrative.generatedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          <span>🏢 {dataset.companyName}</span>
          {dataset.industry && <span>🏭 {dataset.industry}</span>}
        </div>
      </div>

      {/* Charts */}
      <div className="section-divider">
        <span>Data Visualisation</span>
      </div>
      <ChartPanel dataset={dataset} />

      {/* Story Sections */}
      <div className="section-divider">
        <span>The Narrative</span>
      </div>
      <div className="story-sections">
        {narrative.sections.map((section, index) => (
          <div key={index} className={`story-section type-${section.type}`}>
            <div className="section-marker">
              <span className="section-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="section-line" />
            </div>
            <div className="section-body">
              <div className="section-title-row">
                <span className="section-emoji">{section.emoji}</span>
                <h3 className="section-title">{section.title}</h3>
              </div>
              <p className="section-content">{section.content}</p>
              {section.highlight && (
                <div className="section-highlight">
                  <span className="highlight-arrow">▶</span>
                  <span>{section.highlight}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="insights-panel">
        <h3 className="insights-title">💡 Key Insights</h3>
        <div className="insights-grid">
          {narrative.keyInsights.map((insight, i) => (
            <div key={i} className="insight-card">
              <span className="insight-num">{i + 1}</span>
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-panel">
        <span className="cta-icon">🚀</span>
        <div>
          <h4 className="cta-label">Next Chapter</h4>
          <p className="cta-text">{narrative.callToAction}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="step-actions narrative-actions">
        <button className="btn-ghost" onClick={onBack}>
          ← Reconfigure
        </button>
        <button className="btn-secondary" onClick={onRegenerate}>
          🔄 Regenerate
        </button>
        <button className="btn-primary" onClick={onExport}>
          📤 Export Report →
        </button>
      </div>
    </div>
  );
}
