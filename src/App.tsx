import { useCallback } from 'react';
import Header from './components/Header';
import DataInput from './components/DataInput';
import Configurator from './components/Configurator';
import NarrativeReport from './components/NarrativeReport';
import ExportPanel from './components/ExportPanel';
import { useAppState } from './hooks/useAppState';
import { generateNarrative, generateDemoNarrative } from './logic/narrativeGenerator';
import type { FinancialDataset } from './types';

export default function App() {
  const {
    state,
    setStep,
    setFinancialData,
    updateNarrativeConfig,
    setGeneratedNarrative,
    setIsGenerating,
    setApiKey,
    reset,
  } = useAppState();

  const handleDataComplete = useCallback(
    (data: FinancialDataset) => {
      setFinancialData(data);
      setStep('configure');
    },
    [setFinancialData, setStep]
  );

  const handleGenerate = useCallback(async () => {
    if (!state.financialData) return;
    setIsGenerating(true);
    try {
      let narrative;
      if (state.apiKey.trim()) {
        narrative = await generateNarrative(state.financialData, state.narrativeConfig, state.apiKey);
      } else {
        // Simulate brief delay for demo
        await new Promise((res) => setTimeout(res, 1200));
        narrative = generateDemoNarrative(state.financialData, state.narrativeConfig);
      }
      setGeneratedNarrative(narrative);
      setStep('narrative');
    } catch (err) {
      alert(`Error generating narrative: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [state.financialData, state.narrativeConfig, state.apiKey, setIsGenerating, setGeneratedNarrative, setStep]);

  const handleRegenerate = useCallback(async () => {
    setStep('narrative');
    await handleGenerate();
  }, [handleGenerate, setStep]);

  return (
    <div className="app-root">
      <Header currentStep={state.currentStep} onReset={reset} />
      <main className="app-main">
        {state.currentStep === 'input' && (
          <DataInput
            onComplete={handleDataComplete}
            initialData={state.financialData}
          />
        )}

        {state.currentStep === 'configure' && (
          <Configurator
            config={state.narrativeConfig}
            apiKey={state.apiKey}
            onConfigChange={updateNarrativeConfig}
            onApiKeyChange={setApiKey}
            onBack={() => setStep('input')}
            onGenerate={handleGenerate}
            isGenerating={state.isGenerating}
          />
        )}

        {state.currentStep === 'narrative' && state.generatedNarrative && state.financialData && (
          <NarrativeReport
            narrative={state.generatedNarrative}
            dataset={state.financialData}
            config={state.narrativeConfig}
            onExport={() => setStep('export')}
            onRegenerate={handleRegenerate}
            onBack={() => setStep('configure')}
          />
        )}

        {state.currentStep === 'export' && state.generatedNarrative && state.financialData && (
          <ExportPanel
            narrative={state.generatedNarrative}
            dataset={state.financialData}
            config={state.narrativeConfig}
            onBack={() => setStep('narrative')}
            onStartOver={reset}
          />
        )}
      </main>
    </div>
  );
}
