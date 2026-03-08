import type { NarrativeConfig, NarrativeArchetype, MetaphorDomain, ComplianceTemplate } from '../types';
import { ARCHETYPES, METAPHOR_DOMAINS, COMPLIANCE_TEMPLATES } from '../data/definitions';

interface ConfiguratorProps {
  config: NarrativeConfig;
  apiKey: string;
  onConfigChange: (updates: Partial<NarrativeConfig>) => void;
  onApiKeyChange: (key: string) => void;
  onBack: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function Configurator({
  config,
  apiKey,
  onConfigChange,
  onApiKeyChange,
  onBack,
  onGenerate,
  isGenerating,
}: ConfiguratorProps) {
  return (
    <div className="step-container">
      <div className="step-header">
        <h2 className="step-title">Craft Your Narrative</h2>
        <p className="step-subtitle">
          Choose the storytelling framework that best fits your financial story. Every configuration produces a distinct narrative voice.
        </p>
      </div>

      {/* Archetype Selector */}
      <div className="form-section">
        <h3 className="form-section-title">📚 Narrative Archetype</h3>
        <p className="form-section-hint">The structural framework your story follows</p>
        <div className="card-grid">
          {ARCHETYPES.map((arch) => (
            <button
              key={arch.id}
              className={`card-option ${config.archetype === arch.id ? 'selected' : ''}`}
              onClick={() => onConfigChange({ archetype: arch.id as NarrativeArchetype })}
            >
              <span className="card-emoji">{arch.emoji}</span>
              <span className="card-label">{arch.label}</span>
              <span className="card-desc">{arch.description}</span>
              <span className="card-best">Best for: {arch.bestFor}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Metaphor Domain */}
      <div className="form-section">
        <h3 className="form-section-title">🎭 Metaphor Domain</h3>
        <p className="form-section-hint">The imagery vocabulary woven throughout your narrative</p>
        <div className="card-grid card-grid-3">
          {METAPHOR_DOMAINS.map((domain) => (
            <button
              key={domain.id}
              className={`card-option compact ${config.metaphorDomain === domain.id ? 'selected' : ''}`}
              onClick={() => onConfigChange({ metaphorDomain: domain.id as MetaphorDomain })}
            >
              <span className="card-emoji">{domain.emoji}</span>
              <span className="card-label">{domain.label}</span>
              <div className="card-examples">
                {domain.examples.slice(0, 1).map((ex, i) => (
                  <span key={i} className="example-tag">"{ex}"</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tone & Audience Row */}
      <div className="form-section">
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">🎙️ Tone</label>
            <div className="radio-group">
              {(['formal', 'conversational', 'inspirational'] as const).map((tone) => (
                <label key={tone} className={`radio-option ${config.tone === tone ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="tone"
                    value={tone}
                    checked={config.tone === tone}
                    onChange={() => onConfigChange({ tone })}
                  />
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">👥 Primary Audience</label>
            <div className="radio-group">
              {(['executive', 'operations', 'external', 'technical'] as const).map((aud) => (
                <label key={aud} className={`radio-option ${config.audienceType === aud ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="audience"
                    value={aud}
                    checked={config.audienceType === aud}
                    onChange={() => onConfigChange({ audienceType: aud })}
                  />
                  {aud.charAt(0).toUpperCase() + aud.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Template */}
      <div className="form-section">
        <h3 className="form-section-title">📋 Compliance Template</h3>
        <p className="form-section-hint">Optional formatting wrapper for regulated or structured outputs</p>
        <div className="template-grid">
          {COMPLIANCE_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              className={`template-option ${config.complianceTemplate === tmpl.id ? 'selected' : ''}`}
              onClick={() => onConfigChange({ complianceTemplate: tmpl.id as ComplianceTemplate })}
            >
              <span className="template-emoji">{tmpl.emoji}</span>
              <span className="template-label">{tmpl.label}</span>
              <span className="template-desc">{tmpl.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div className="form-section api-section">
        <h3 className="form-section-title">🔑 Anthropic API Key</h3>
        <p className="form-section-hint">
          Power your narrative with Claude AI. Leave blank to use a rich demo narrative instead.
        </p>
        <div className="api-input-row">
          <input
            className="form-input api-key-input"
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="sk-ant-api03-..."
          />
          {!apiKey && (
            <span className="demo-badge">Demo Mode</span>
          )}
          {apiKey && (
            <span className="live-badge">✓ AI Mode</span>
          )}
        </div>
        <p className="api-note">
          Get your key at <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">console.anthropic.com</a>. Your key is never stored.
        </p>
      </div>

      <div className="step-actions">
        <button className="btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <button
          className="btn-primary"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <span className="generating-label">
              <span className="spinner" /> Crafting your narrative…
            </span>
          ) : (
            '✨ Generate Narrative →'
          )}
        </button>
      </div>
    </div>
  );
}
