import type { GeneratedNarrative, FinancialDataset, NarrativeConfig } from '../types';
import { COMPLIANCE_TEMPLATES } from '../data/definitions';
import { formatCurrency, computeSummaryStats } from './dataTransformer';

export function exportAsText(
  narrative: GeneratedNarrative,
  dataset: FinancialDataset,
  config: NarrativeConfig
): string {
  const template = COMPLIANCE_TEMPLATES.find((t) => t.id === config.complianceTemplate);
  const stats = computeSummaryStats(dataset);

  let text = '';

  if (template?.disclaimer) {
    text += `⚠️  ${template.disclaimer}\n`;
    text += '─'.repeat(60) + '\n\n';
  }

  text += `${narrative.headline.toUpperCase()}\n`;
  text += `${narrative.subheadline}\n\n`;
  text += `Narrative Archetype: ${narrative.archetypeLabel}\n`;
  text += `Generated: ${narrative.generatedAt.toLocaleString()}\n`;
  text += '─'.repeat(60) + '\n\n';

  for (const section of narrative.sections) {
    text += `${section.emoji}  ${section.title.toUpperCase()}\n`;
    text += `${section.content}\n`;
    if (section.highlight) text += `\n  ▶  ${section.highlight}\n`;
    text += '\n';
  }

  text += '─'.repeat(60) + '\n';
  text += 'KEY INSIGHTS\n\n';
  narrative.keyInsights.forEach((insight, i) => {
    text += `  ${i + 1}. ${insight}\n`;
  });

  text += '\n─'.repeat(60) + '\n';
  text += 'FINANCIAL SUMMARY\n\n';
  text += `  Total Revenue:  ${formatCurrency(stats.totalRevenue, dataset.currency)}\n`;
  text += `  Total Profit:   ${formatCurrency(stats.totalProfit, dataset.currency)}\n`;
  text += `  Profit Margin:  ${stats.profitMargin.toFixed(1)}%\n`;
  text += `  Avg Growth:     ${stats.avgGrowth.toFixed(1)}%\n`;

  text += '\n─'.repeat(60) + '\n';
  text += `NEXT CHAPTER\n\n  ${narrative.callToAction}\n`;

  return text;
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsHTML(
  narrative: GeneratedNarrative,
  dataset: FinancialDataset
): string {
  const stats = computeSummaryStats(dataset);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${narrative.headline}</title>
<style>
  body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1a1a2e; line-height: 1.7; }
  h1 { font-size: 2rem; color: #0f3460; }
  h2 { font-size: 1.1rem; color: #16213e; border-bottom: 2px solid #e94560; padding-bottom: 6px; margin-top: 2rem; }
  .sub { font-style: italic; color: #555; }
  .highlight { background: #fff8e1; padding: 8px 16px; border-left: 3px solid #e94560; margin: 1rem 0; font-weight: bold; }
  .insights { background: #f0f4ff; padding: 20px; border-radius: 8px; }
  .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .stat { background: #f8f9ff; padding: 12px; border-radius: 6px; }
  .cta { background: #0f3460; color: white; padding: 20px; border-radius: 8px; margin-top: 2rem; }
</style>
</head>
<body>
<h1>${narrative.headline}</h1>
<p class="sub">${narrative.subheadline}</p>
<p><em>Archetype: ${narrative.archetypeLabel} | Generated: ${narrative.generatedAt.toLocaleString()}</em></p>
<hr/>
${narrative.sections.map((s) => `
<h2>${s.emoji} ${s.title}</h2>
<p>${s.content}</p>
${s.highlight ? `<div class="highlight">${s.highlight}</div>` : ''}
`).join('')}
<div class="insights">
<h2>Key Insights</h2>
<ul>${narrative.keyInsights.map((i) => `<li>${i}</li>`).join('')}</ul>
</div>
<h2>Financial Summary</h2>
<div class="stat-grid">
  <div class="stat"><strong>Total Revenue</strong><br/>${formatCurrency(stats.totalRevenue, dataset.currency)}</div>
  <div class="stat"><strong>Total Profit</strong><br/>${formatCurrency(stats.totalProfit, dataset.currency)}</div>
  <div class="stat"><strong>Profit Margin</strong><br/>${stats.profitMargin.toFixed(1)}%</div>
  <div class="stat"><strong>Avg Growth</strong><br/>${stats.avgGrowth.toFixed(1)}%</div>
</div>
<div class="cta"><strong>Next Chapter:</strong> ${narrative.callToAction}</div>
</body>
</html>`;
}
