import type { NarrativeArchetype, MetaphorDomain, ComplianceTemplate, NarrativeConfig } from '../types';

// ─── Archetype Definitions ───────────────────────────────────────────────────

export interface ArchetypeDefinition {
  id: NarrativeArchetype;
  label: string;
  description: string;
  emoji: string;
  bestFor: string;
}

export const ARCHETYPES: ArchetypeDefinition[] = [
  {
    id: 'heroes_journey',
    label: "Hero's Journey",
    description: "A protagonist faces trials, gains allies, and emerges transformed — perfect for growth stories.",
    emoji: '⚔️',
    bestFor: 'Companies that overcame challenges to achieve growth',
  },
  {
    id: 'rise_and_fall',
    label: 'Rise & Fall',
    description: 'A peak followed by contraction — frames volatility honestly and sets up recovery.',
    emoji: '🌊',
    bestFor: 'Periods with a strong quarter followed by a downturn',
  },
  {
    id: 'redemption_arc',
    label: 'Redemption Arc',
    description: 'From struggle to recovery — ideal for turnaround stories and second-half improvements.',
    emoji: '🌅',
    bestFor: 'Poor early performance that improved significantly',
  },
  {
    id: 'underdog',
    label: 'The Underdog',
    description: 'Against all odds, modest resources produce outsized results through grit.',
    emoji: '🥊',
    bestFor: 'Bootstrapped businesses punching above their weight',
  },
  {
    id: 'steady_climb',
    label: 'Steady Climb',
    description: 'Deliberate, methodical progress — consistency as the competitive advantage.',
    emoji: '🧗',
    bestFor: 'Consistent quarter-over-quarter improvement',
  },
  {
    id: 'storm_and_calm',
    label: 'Storm & Calm',
    description: 'Turbulence gives way to stability — resilience and adaptation at the centre.',
    emoji: '⛈️',
    bestFor: 'High volatility followed by stabilisation',
  },
];

// ─── Metaphor Domain Definitions ─────────────────────────────────────────────

export interface MetaphorDefinition {
  id: MetaphorDomain;
  label: string;
  emoji: string;
  examples: string[];
}

export const METAPHOR_DOMAINS: MetaphorDefinition[] = [
  {
    id: 'mythology',
    label: 'Mythology',
    emoji: '🏛️',
    examples: ['Odysseus navigating the sirens of overspend', 'Forging revenue like Hephaestus at the anvil'],
  },
  {
    id: 'sports',
    label: 'Sports',
    emoji: '🏆',
    examples: ['Playing the long game', 'The fourth-quarter comeback', 'Training season vs. game day'],
  },
  {
    id: 'nature',
    label: 'Nature',
    emoji: '🌿',
    examples: ['Seasons of growth and harvest', 'Weathering the financial winter', 'Roots before branches'],
  },
  {
    id: 'cinema',
    label: 'Cinema',
    emoji: '🎬',
    examples: ['The plot twist nobody saw coming', 'Act II tension resolves in Act III', 'Box-office returns'],
  },
  {
    id: 'military',
    label: 'Military Strategy',
    emoji: '🗺️',
    examples: ['Advancing on multiple fronts', 'Strategic retreat to regroup', 'Supply line optimisation'],
  },
  {
    id: 'culinary',
    label: 'Culinary',
    emoji: '👨‍🍳',
    examples: ['Reducing expenses to concentrate flavour', 'The recipe for margin expansion', 'Mise en place'],
  },
];

// ─── Compliance Template Definitions ─────────────────────────────────────────

export interface TemplateDefinition {
  id: ComplianceTemplate;
  label: string;
  emoji: string;
  description: string;
  disclaimer?: string;
}

export const COMPLIANCE_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'none',
    label: 'No Template',
    emoji: '✍️',
    description: 'Free-form narrative without compliance framing',
  },
  {
    id: 'investor_report',
    label: 'Investor Report',
    emoji: '📈',
    description: 'Structured for investor audiences with forward-looking statements',
    disclaimer: 'This report contains forward-looking statements that involve risks and uncertainties. Past performance does not guarantee future results.',
  },
  {
    id: 'board_memo',
    label: 'Board Memo',
    emoji: '🏢',
    description: 'Executive summary format with strategic implications',
    disclaimer: 'Confidential — For Board Use Only. Not for external distribution.',
  },
  {
    id: 'team_update',
    label: 'Team Update',
    emoji: '👥',
    description: 'Accessible language for operational teams and staff',
  },
  {
    id: 'press_release',
    label: 'Press Release',
    emoji: '📰',
    description: 'AP-style format suitable for external communications',
    disclaimer: 'FOR IMMEDIATE RELEASE. Contains non-GAAP financial measures.',
  },
];

// ─── Default Configuration ────────────────────────────────────────────────────

export const DEFAULT_NARRATIVE_CONFIG: NarrativeConfig = {
  archetype: 'heroes_journey',
  metaphorDomain: 'nature',
  complianceTemplate: 'none',
  tone: 'conversational',
  audienceType: 'operations',
};

// ─── Sample Financial Data ────────────────────────────────────────────────────

export const SAMPLE_FINANCIAL_DATA = {
  companyName: 'Meridian Ventures',
  industry: 'SaaS / B2B',
  currency: 'USD',
  reportingPeriod: '2024',
  quarters: [
    { label: 'Q1 2024', revenue: 420000, expenses: 390000, profit: 30000, growth: 5 },
    { label: 'Q2 2024', revenue: 510000, expenses: 410000, profit: 100000, growth: 21.4 },
    { label: 'Q3 2024', revenue: 480000, expenses: 430000, profit: 50000, growth: -5.9 },
    { label: 'Q4 2024', revenue: 670000, expenses: 450000, profit: 220000, growth: 39.6 },
  ],
};
