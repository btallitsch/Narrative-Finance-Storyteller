import type {
  FinancialDataset,
  NarrativeConfig,
  GeneratedNarrative,
  NarrativeSection,
  NarrativeArchetype,
  MetaphorDomain,
} from '../types';
import { ARCHETYPES, METAPHOR_DOMAINS, COMPLIANCE_TEMPLATES } from '../data/definitions';

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function buildSystemPrompt(config: NarrativeConfig): string {
  const archetype = ARCHETYPES.find((a) => a.id === config.archetype)!;
  const metaphor = METAPHOR_DOMAINS.find((m) => m.id === config.metaphorDomain)!;
  const template = COMPLIANCE_TEMPLATES.find((t) => t.id === config.complianceTemplate)!;

  return `You are a Narrative Finance Storyteller — a specialist who transforms raw financial data into compelling, accessible narratives for non-finance audiences.

NARRATIVE ARCHETYPE: ${archetype.label}
${archetype.description}

METAPHOR DOMAIN: ${metaphor.label}
Draw metaphors and imagery exclusively from: ${metaphor.examples.join('; ')}

TONE: ${config.tone}
AUDIENCE: ${config.audienceType}
COMPLIANCE TEMPLATE: ${template.label}${template.disclaimer ? `\nDISCLAIMER TO INCLUDE: ${template.disclaimer}` : ''}

YOUR TASK:
Respond ONLY with a valid JSON object — no markdown fences, no preamble. The structure must be:
{
  "headline": "string — a punchy, metaphor-rich headline (max 12 words)",
  "subheadline": "string — one-sentence context (max 25 words)",
  "archetypeLabel": "string — the archetype name",
  "sections": [
    {
      "title": "string",
      "content": "string — 2-4 rich sentences with embedded metaphors and financial insight",
      "emoji": "string — single emoji",
      "highlight": "string — one bold stat or phrase to call out",
      "type": "opening | body | turning_point | climax | resolution"
    }
  ],
  "keyInsights": ["string", "string", "string"],
  "callToAction": "string — one sentence forward-looking call to action"
}

Rules:
- Sections array must have exactly 4-5 elements covering: opening context, early performance, key turning point, peak/resolution, outlook
- Weave the ${metaphor.label.toLowerCase()} metaphors naturally — do NOT explain the metaphor, just use it
- Every financial figure must appear in context (not standalone)
- keyInsights: exactly 3 items, each under 15 words
- Do NOT use jargon without immediately translating it
- Make it genuinely engaging — someone who hates spreadsheets should be riveted`;
}

function buildUserPrompt(data: FinancialDataset, config: NarrativeConfig): string {
  const quarterLines = data.quarters
    .map(
      (q) =>
        `  ${q.label}: Revenue ${formatCurrency(q.revenue, data.currency)}, Expenses ${formatCurrency(q.expenses, data.currency)}, Profit ${formatCurrency(q.profit, data.currency)}, Growth ${q.growth > 0 ? '+' : ''}${q.growth.toFixed(1)}%`
    )
    .join('\n');

  const totalRevenue = data.quarters.reduce((s, q) => s + q.revenue, 0);
  const totalProfit = data.quarters.reduce((s, q) => s + q.profit, 0);
  const avgGrowth =
    data.quarters.reduce((s, q) => s + q.growth, 0) / data.quarters.length;
  const bestQuarter = data.quarters.reduce((best, q) => (q.profit > best.profit ? q : best));
  const worstQuarter = data.quarters.reduce((worst, q) => (q.profit < worst.profit ? q : worst));

  return `Generate a narrative report for the following financial data:

COMPANY: ${data.companyName}
INDUSTRY: ${data.industry}
REPORTING PERIOD: ${data.reportingPeriod}
CURRENCY: ${data.currency}

QUARTERLY PERFORMANCE:
${quarterLines}

SUMMARY STATS:
- Total Annual Revenue: ${formatCurrency(totalRevenue, data.currency)}
- Total Annual Profit: ${formatCurrency(totalProfit, data.currency)}
- Average Quarterly Growth: ${avgGrowth.toFixed(1)}%
- Best Quarter: ${bestQuarter.label} (Profit: ${formatCurrency(bestQuarter.profit, data.currency)})
- Weakest Quarter: ${worstQuarter.label} (Profit: ${formatCurrency(worstQuarter.profit, data.currency)})

Apply the ${config.archetype} archetype. Audience is ${config.audienceType}. Tone: ${config.tone}.`;
}

// ─── Main Generator Function ──────────────────────────────────────────────────

export async function generateNarrative(
  data: FinancialDataset,
  config: NarrativeConfig,
  apiKey: string
): Promise<GeneratedNarrative> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      system: buildSystemPrompt(config),
      messages: [{ role: 'user', content: buildUserPrompt(data, config) }],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(
      error?.error?.message ?? `API request failed with status ${response.status}`
    );
  }

  const responseData = await response.json();
  const rawText = responseData.content
    .filter((block: { type: string }) => block.type === 'text')
    .map((block: { type: string; text: string }) => block.text)
    .join('');

  let parsed: Omit<GeneratedNarrative, 'generatedAt'>;
  try {
    const clean = rawText.replace(/```json|```/g, '').trim();
    parsed = JSON.parse(clean);
  } catch {
    throw new Error('Failed to parse narrative response. Please try again.');
  }

  return {
    ...parsed,
    generatedAt: new Date(),
  };
}

// ─── Offline Demo Generator ───────────────────────────────────────────────────
// Used when no API key is provided — produces a rich hardcoded example

export function generateDemoNarrative(
  data: FinancialDataset,
  config: NarrativeConfig
): GeneratedNarrative {
  const archetype = ARCHETYPES.find((a) => a.id === config.archetype)!;

  const narrativesByArchetype: Record<NarrativeArchetype, Partial<GeneratedNarrative>> = {
    heroes_journey: {
      headline: `${data.companyName}'s Odyssey: From Lean Beginnings to Abundant Harvest`,
      subheadline: `How deliberate endurance through Q1's rocky terrain paved the road to Q4's record-breaking summit.`,
      sections: buildHeroSections(data, config.metaphorDomain),
    },
    rise_and_fall: {
      headline: `The Arc of Ambition: ${data.companyName}'s Soaring Q2 and the Honest Reckoning`,
      subheadline: `A candid look at what the tide brought in — and what it carried out.`,
      sections: buildRiseAndFallSections(data, config.metaphorDomain),
    },
    redemption_arc: {
      headline: `${data.companyName} Finds Its Footing: A Story of Recovery and Resolve`,
      subheadline: `From a shaky start to a triumphant close — the numbers tell a story of character.`,
      sections: buildRedemptionSections(data, config.metaphorDomain),
    },
    underdog: {
      headline: `The Unlikely Contender: ${data.companyName} Outpunches Every Expectation`,
      subheadline: `Lean resources, outsized results — a bootstrapper's blueprint for the ages.`,
      sections: buildUnderdogSections(data, config.metaphorDomain),
    },
    steady_climb: {
      headline: `One Deliberate Step at a Time: ${data.companyName}'s Year of Methodical Progress`,
      subheadline: `Consistency is the rarest superpower — and ${data.companyName} wielded it all year.`,
      sections: buildSteadyClimbSections(data, config.metaphorDomain),
    },
    storm_and_calm: {
      headline: `After the Storm: ${data.companyName}'s Resilience in the Face of Turbulence`,
      subheadline: `Volatility tested the hull, but the crew held course and found calmer waters.`,
      sections: buildStormSections(data, config.metaphorDomain),
    },
  };

  const base = narrativesByArchetype[config.archetype];

  return {
    headline: base.headline ?? `${data.companyName} — ${data.reportingPeriod} in Review`,
    subheadline: base.subheadline ?? 'A narrative look at the year that was.',
    archetypeLabel: archetype.label,
    sections: base.sections ?? [],
    keyInsights: [
      `Q4 delivered the strongest profit margin of the year at ${getBestQuarterMargin(data)}%`,
      `Annual revenue grew to ${formatCurrency(data.quarters.reduce((s, q) => s + q.revenue, 0), data.currency)} across four quarters`,
      `The revenue-to-profit conversion improved significantly in the second half`,
    ],
    callToAction: `Build on the ${data.reportingPeriod} momentum by doubling down on the strategies that drove Q4's breakthrough performance.`,
    generatedAt: new Date(),
  };
}

function getBestQuarterMargin(data: FinancialDataset): string {
  const best = data.quarters.reduce((b, q) =>
    q.profit / q.revenue > b.profit / b.revenue ? q : b
  );
  return ((best.profit / best.revenue) * 100).toFixed(1);
}

function getMetaphorPhrase(domain: MetaphorDomain, context: 'opening' | 'challenge' | 'turn' | 'peak' | 'close'): string {
  const phrases: Record<MetaphorDomain, Record<string, string>> = {
    nature: {
      opening: 'As the first shoots of the fiscal year broke through frozen ground',
      challenge: 'Like a forest navigating a late frost',
      turn: 'When the growing season finally arrived in earnest',
      peak: 'At the full harvest of Q4',
      close: 'Roots now run deep enough to weather any coming season',
    },
    mythology: {
      opening: 'The quest began with modest provisions and a clear horizon',
      challenge: 'Tested by the Scylla of rising costs and Charybdis of contracting margins',
      turn: 'Armed with the hard-won wisdom of midyear trials',
      peak: 'The golden fleece of Q4 profit was finally within reach',
      close: 'The oracle now points toward even greater conquests ahead',
    },
    sports: {
      opening: 'The opening whistle of Q1 set a measured, deliberate tempo',
      challenge: 'A mid-season slump tested the squad\'s depth and resilience',
      turn: 'The tactical adjustments at half-time began to pay dividends',
      peak: 'Q4 was a championship performance — decisive, dominant, and defining',
      close: 'The playbook is set; the squad is primed for an even stronger season',
    },
    cinema: {
      opening: 'The opening frame introduced our protagonist in a world of tight margins',
      challenge: 'Act II delivered the narrative tension every compelling story requires',
      turn: 'The plot twist arrived in Q3 — a recalibration that changed everything',
      peak: 'The climax of Q4 delivered the payoff audiences had been waiting for',
      close: 'The final frame sets up a sequel that promises to surpass the original',
    },
    military: {
      opening: 'The campaign opened on multiple fronts with carefully rationed resources',
      challenge: 'Q3 required a tactical retreat to consolidate supply lines',
      turn: 'Intelligence from midyear operations informed a decisive flanking manoeuvre',
      peak: 'Q4\'s offensive broke through every line of resistance',
      close: 'The terrain is mapped; the next campaign begins from a position of strength',
    },
    culinary: {
      opening: 'The year began with careful mise en place — every cost accounted for',
      challenge: 'Q3\'s reduction phase concentrated expenses, but squeezed margins momentarily',
      turn: 'The flavours began to balance as Q4 preparations reached full heat',
      peak: 'Q4 was a Michelin-star service — every element executed to perfection',
      close: 'The recipe is proven; now it\'s time to scale the kitchen',
    },
  };
  return phrases[domain][context];
}

function buildHeroSections(data: FinancialDataset, domain: MetaphorDomain): NarrativeSection[] {
  const q1 = data.quarters[0];
  const q4 = data.quarters[data.quarters.length - 1];
  return [
    {
      type: 'opening',
      emoji: '🌱',
      title: 'The Call to Adventure',
      content: `${getMetaphorPhrase(domain, 'opening')}, ${data.companyName} opened ${data.reportingPeriod} with ${formatCurrency(q1.revenue, data.currency)} in revenue — a modest but determined start. The profit margin was thin, and the road ahead uncertain. But every great story begins with exactly this kind of purposeful restraint.`,
      highlight: `Q1 Profit: ${formatCurrency(q1.profit, data.currency)}`,
    },
    {
      type: 'body',
      emoji: '⚡',
      title: 'Rising to the Challenge',
      content: `The second quarter brought a surge of momentum. Revenue climbed sharply, and with it came the first real glimpse of what this business could become. ${getMetaphorPhrase(domain, 'challenge')}, the team pressed forward — and was rewarded with Q2's strongest revenue of the first half.`,
      highlight: `Q2 Growth: +${data.quarters[1]?.growth.toFixed(1)}%`,
    },
    {
      type: 'turning_point',
      emoji: '🔄',
      title: 'The Trial',
      content: `Q3 arrived as a test of resolve. Revenue dipped, and margins tightened. In lesser organisations, this might signal retreat. Here, it was a recalibration — the kind that sharpens instincts and resets priorities. ${getMetaphorPhrase(domain, 'turn')}, the foundations held.`,
      highlight: `Q3 Expenses Controlled at ${formatCurrency(data.quarters[2]?.expenses ?? 0, data.currency)}`,
    },
    {
      type: 'climax',
      emoji: '🏆',
      title: 'The Triumphant Return',
      content: `${getMetaphorPhrase(domain, 'peak')}, ${data.companyName} delivered its most powerful quarter — ${formatCurrency(q4.revenue, data.currency)} in revenue and a profit that dwarfed every preceding period. Every lesson from Q1 through Q3 was repaid in full. This is what the journey was always building toward.`,
      highlight: `Q4 Profit: ${formatCurrency(q4.profit, data.currency)}`,
    },
    {
      type: 'resolution',
      emoji: '🌟',
      title: 'The Transformed Hero',
      content: `${getMetaphorPhrase(domain, 'close')}. The year's full arc tells a story not just of numbers, but of organisational character — the kind that is built in the hard quarters and cashed in when the conditions finally align.`,
      highlight: `Annual Revenue: ${formatCurrency(data.quarters.reduce((s, q) => s + q.revenue, data.currency === 'USD' ? 0 : 0), data.currency)}`,
    },
  ];
}

function buildRiseAndFallSections(data: FinancialDataset, domain: MetaphorDomain): NarrativeSection[] {
  const q2 = data.quarters[1];
  return [
    { type: 'opening', emoji: '📈', title: 'A Promising Dawn', content: `${getMetaphorPhrase(domain, 'opening')}, and the early results rewarded the optimism. The company entered ${data.reportingPeriod} with energy and ambition, and Q1 delivered a respectable foundation.`, highlight: `Q1 Revenue: ${formatCurrency(data.quarters[0]?.revenue ?? 0, data.currency)}` },
    { type: 'climax', emoji: '🌟', title: 'The Peak', content: `Q2 was the high-water mark — ${formatCurrency(q2.revenue, data.currency)} in revenue at a ${q2.growth.toFixed(1)}% growth rate that made heads turn. ${getMetaphorPhrase(domain, 'peak')} — everything seemed to be working at once.`, highlight: `Q2 Growth: +${q2.growth.toFixed(1)}%` },
    { type: 'turning_point', emoji: '⚖️', title: 'The Honest Reckoning', content: `But Q3 brought the reckoning that high peaks often carry in their wake. Revenue contracted, and the organisation faced a choice: rationalise, recalibrate, or retreat. ${getMetaphorPhrase(domain, 'challenge')}, the response was disciplined cost control.`, highlight: `Q3 Margin Preserved` },
    { type: 'resolution', emoji: '🔮', title: 'Setting the Stage', content: `${getMetaphorPhrase(domain, 'close')}. The fall was not a failure — it was a correction, and corrections build the foundations for the next rise. Q4 signals that the lessons have been internalised.`, highlight: `Q4 Recovery Underway` },
  ];
}

function buildRedemptionSections(data: FinancialDataset, domain: MetaphorDomain): NarrativeSection[] {
  return [
    { type: 'opening', emoji: '😤', title: 'An Inauspicious Start', content: `${getMetaphorPhrase(domain, 'opening')}, the opening chapters were hard reading. Q1 margins were thin, and the numbers raised difficult questions. But difficult questions are precisely how organisations find better answers.`, highlight: `Q1 Profit Margin: ${((data.quarters[0]?.profit / data.quarters[0]?.revenue) * 100).toFixed(1)}%` },
    { type: 'body', emoji: '🛠️', title: 'The Work Begins', content: `Q2 showed the first signs of structural repair. ${getMetaphorPhrase(domain, 'challenge')}, the team restructured, refocused, and began to execute with greater precision. Revenue growth of ${data.quarters[1]?.growth.toFixed(1)}% was the first tangible proof.`, highlight: `Q2 Growth: +${data.quarters[1]?.growth.toFixed(1)}%` },
    { type: 'turning_point', emoji: '🌅', title: 'The Turn', content: `${getMetaphorPhrase(domain, 'turn')}. The midyear inflection arrived quietly — a shift in unit economics, a tightening of the cost base — but its downstream effects were profound.`, highlight: `Cost Discipline Taking Hold` },
    { type: 'climax', emoji: '🏆', title: 'The Vindication', content: `Q4 is the vindication. ${getMetaphorPhrase(domain, 'peak')}: ${formatCurrency(data.quarters[data.quarters.length - 1]?.profit ?? 0, data.currency)} in profit — the highest of the year — tells a story of an organisation that refused to accept its opening act as its defining one.`, highlight: `Q4 Best Profit of Year` },
  ];
}

function buildUnderdogSections(data: FinancialDataset, domain: MetaphorDomain): NarrativeSection[] {
  return [
    { type: 'opening', emoji: '💪', title: 'No Safety Net', content: `${getMetaphorPhrase(domain, 'opening')}. With lean resources and no margin for error, ${data.companyName} entered ${data.reportingPeriod} knowing that every decision counted double. The bootstrapper's constraint is also the bootstrapper's superpower.`, highlight: `Lean from Day One` },
    { type: 'body', emoji: '🧠', title: 'Outthinking, Not Outspending', content: `${getMetaphorPhrase(domain, 'challenge')}, the team found ways to convert frugality into efficiency. Q2 proved the model — revenues rose faster than costs, and the profit line began to reflect that discipline.`, highlight: `Revenue/Expense Spread Widening` },
    { type: 'turning_point', emoji: '🎯', title: 'The Decisive Moment', content: `${getMetaphorPhrase(domain, 'turn')}. Mid-year brought the kind of opportunity that only prepared teams recognise. The pivot was small but precise — and it compounded powerfully through Q4.`, highlight: `Strategic Pivot Mid-Year` },
    { type: 'resolution', emoji: '🥇', title: 'The Upset Result', content: `${getMetaphorPhrase(domain, 'close')}. Q4's numbers are the scoreboard that matters: an organisation that started with less arrived at more. That is not luck — it is the arithmetic of outworking, outthinking, and outexecuting.`, highlight: `Q4 Profit: ${formatCurrency(data.quarters[data.quarters.length - 1]?.profit ?? 0, data.currency)}` },
  ];
}

function buildSteadyClimbSections(data: FinancialDataset, domain: MetaphorDomain): NarrativeSection[] {
  return [
    { type: 'opening', emoji: '🧭', title: 'The Long View', content: `${getMetaphorPhrase(domain, 'opening')}. Not every great story begins with a dramatic act — some begin with a single, deliberate step. For ${data.companyName}, Q1 was exactly that: the first step of a methodical ascent.`, highlight: `Q1 Revenue: ${formatCurrency(data.quarters[0]?.revenue ?? 0, data.currency)}` },
    { type: 'body', emoji: '📐', title: 'The Compound Effect', content: `Quarter by quarter, the pattern held. ${getMetaphorPhrase(domain, 'challenge')}, the team maintained its rhythm — adjusting cadence but never abandoning discipline. Small gains compounded into something remarkable.`, highlight: `Consistent Positive Growth` },
    { type: 'turning_point', emoji: '⚙️', title: 'The System Paying Off', content: `${getMetaphorPhrase(domain, 'turn')}. By Q3, the operating model was performing like a well-tuned instrument — every cost in its place, every revenue stream measured and managed.`, highlight: `Operations Optimised` },
    { type: 'climax', emoji: '🏔️', title: 'The Summit', content: `Q4 is where consistent effort cashes its cheque. ${getMetaphorPhrase(domain, 'peak')}: revenue of ${formatCurrency(data.quarters[data.quarters.length - 1]?.revenue ?? 0, data.currency)} and profit of ${formatCurrency(data.quarters[data.quarters.length - 1]?.profit ?? 0, data.currency)} are the natural conclusion of a year of relentless, purposeful climbing.`, highlight: `Q4 Year-High Revenue` },
  ];
}

function buildStormSections(data: FinancialDataset, domain: MetaphorDomain): NarrativeSection[] {
  return [
    { type: 'opening', emoji: '⛅', title: 'Gathering Clouds', content: `${getMetaphorPhrase(domain, 'opening')}. The year launched with promise, but the meteorology of the market was already shifting. Q1 results were solid — a calm before conditions turned complex.`, highlight: `Q1 Stable Base` },
    { type: 'turning_point', emoji: '⛈️', title: 'Full Storm', content: `${getMetaphorPhrase(domain, 'challenge')}. The turbulence arrived in Q2 and Q3 with a one-two combination of cost pressure and revenue volatility. ${data.companyName} held its heading — not because conditions were easy, but because the team was built for exactly this.`, highlight: `Held Course Under Pressure` },
    { type: 'body', emoji: '🧱', title: 'What Held', content: `${getMetaphorPhrase(domain, 'turn')}. The structural decisions made in calmer times — the cost controls, the diversified revenue streams — proved their worth when the weather turned. Resilience is always built before it's needed.`, highlight: `Structural Resilience Validated` },
    { type: 'resolution', emoji: '☀️', title: 'After the Storm', content: `${getMetaphorPhrase(domain, 'close')}. Q4 arrived with clarity and momentum. The organisation that emerged from the turbulence is measurably stronger than the one that entered it — leaner, more focused, and better navigated for the voyage ahead.`, highlight: `Q4 Calmer, Stronger` },
  ];
}
