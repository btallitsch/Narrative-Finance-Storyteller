import type { AppStep } from '../types';

interface HeaderProps {
  currentStep: AppStep;
  onReset: () => void;
}

const STEPS: { id: AppStep; label: string; num: number }[] = [
  { id: 'input', label: 'Data', num: 1 },
  { id: 'configure', label: 'Story', num: 2 },
  { id: 'narrative', label: 'Narrative', num: 3 },
  { id: 'export', label: 'Export', num: 4 },
];

export default function Header({ currentStep, onReset }: HeaderProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand" onClick={onReset} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onReset()}>
          <span className="brand-icon">📖</span>
          <div className="brand-text">
            <span className="brand-name">Narrative Finance</span>
            <span className="brand-tagline">Storyteller</span>
          </div>
        </div>

        <nav className="step-nav">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isComplete = index < currentIndex;
            return (
              <div
                key={step.id}
                className={`step-item ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
              >
                <div className="step-dot">
                  {isComplete ? '✓' : step.num}
                </div>
                <span className="step-label">{step.label}</span>
                {index < STEPS.length - 1 && <div className="step-line" />}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
