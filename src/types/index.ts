// ─── Financial Data Types ───────────────────────────────────────────────────

export interface QuarterData {
  label: string;          // e.g. "Q1 2024"
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;         // percentage
}

export interface FinancialDataset {
  companyName: string;
  industry: string;
  quarters: QuarterData[];
  currency: string;
  reportingPeriod: string;
}

// ─── Narrative / Storytelling Types ─────────────────────────────────────────

export type NarrativeArchetype =
  | 'heroes_journey'
  | 'rise_and_fall'
  | 'redemption_arc'
  | 'underdog'
  | 'steady_climb'
  | 'storm_and_calm';

export type MetaphorDomain =
  | 'mythology'
  | 'sports'
  | 'nature'
  | 'cinema'
  | 'military'
  | 'culinary';

export type ComplianceTemplate = 'none' | 'investor_report' | 'board_memo' | 'team_update' | 'press_release';

export interface NarrativeConfig {
  archetype: NarrativeArchetype;
  metaphorDomain: MetaphorDomain;
  complianceTemplate: ComplianceTemplate;
  tone: 'formal' | 'conversational' | 'inspirational';
  audienceType: 'executive' | 'operations' | 'external' | 'technical';
}

export interface NarrativeSection {
  title: string;
  content: string;
  emoji: string;
  highlight?: string;
  type: 'opening' | 'body' | 'turning_point' | 'climax' | 'resolution';
}

export interface GeneratedNarrative {
  headline: string;
  subheadline: string;
  archetypeLabel: string;
  sections: NarrativeSection[];
  keyInsights: string[];
  callToAction: string;
  generatedAt: Date;
}

// ─── UI State Types ──────────────────────────────────────────────────────────

export type AppStep = 'input' | 'configure' | 'narrative' | 'export';

export interface AppState {
  currentStep: AppStep;
  financialData: FinancialDataset | null;
  narrativeConfig: NarrativeConfig;
  generatedNarrative: GeneratedNarrative | null;
  isGenerating: boolean;
  apiKey: string;
}

// ─── Chart Types ─────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;
}
