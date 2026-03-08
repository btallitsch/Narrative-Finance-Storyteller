import { useState, useCallback } from 'react';
import type { AppState, AppStep, FinancialDataset, NarrativeConfig, GeneratedNarrative } from '../types';
import { DEFAULT_NARRATIVE_CONFIG, SAMPLE_FINANCIAL_DATA } from '../data/definitions';

const INITIAL_STATE: AppState = {
  currentStep: 'input',
  financialData: null,
  narrativeConfig: DEFAULT_NARRATIVE_CONFIG,
  generatedNarrative: null,
  isGenerating: false,
  apiKey: '',
};

export function useAppState() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const setStep = useCallback((step: AppStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setFinancialData = useCallback((data: FinancialDataset) => {
    setState((prev) => ({ ...prev, financialData: data }));
  }, []);

  const updateNarrativeConfig = useCallback((updates: Partial<NarrativeConfig>) => {
    setState((prev) => ({
      ...prev,
      narrativeConfig: { ...prev.narrativeConfig, ...updates },
    }));
  }, []);

  const setGeneratedNarrative = useCallback((narrative: GeneratedNarrative | null) => {
    setState((prev) => ({ ...prev, generatedNarrative: narrative }));
  }, []);

  const setIsGenerating = useCallback((isGenerating: boolean) => {
    setState((prev) => ({ ...prev, isGenerating }));
  }, []);

  const setApiKey = useCallback((apiKey: string) => {
    setState((prev) => ({ ...prev, apiKey }));
  }, []);

  const loadSampleData = useCallback(() => {
    setState((prev) => ({ ...prev, financialData: SAMPLE_FINANCIAL_DATA }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    setStep,
    setFinancialData,
    updateNarrativeConfig,
    setGeneratedNarrative,
    setIsGenerating,
    setApiKey,
    loadSampleData,
    reset,
  };
}
