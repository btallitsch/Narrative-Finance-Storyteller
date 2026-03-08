import type { FinancialDataset, ChartDataPoint, QuarterData } from '../types';

export function toChartData(dataset: FinancialDataset): ChartDataPoint[] {
  return dataset.quarters.map((q) => ({
    name: q.label,
    revenue: q.revenue,
    expenses: q.expenses,
    profit: q.profit,
    growth: q.growth,
  }));
}

export function computeSummaryStats(dataset: FinancialDataset) {
  const quarters = dataset.quarters;
  const totalRevenue = quarters.reduce((s, q) => s + q.revenue, 0);
  const totalExpenses = quarters.reduce((s, q) => s + q.expenses, 0);
  const totalProfit = quarters.reduce((s, q) => s + q.profit, 0);
  const avgGrowth = quarters.reduce((s, q) => s + q.growth, 0) / quarters.length;
  const profitMargin = (totalProfit / totalRevenue) * 100;
  const bestQuarter = quarters.reduce((b, q) => (q.profit > b.profit ? q : b));
  const worstQuarter = quarters.reduce((w, q) => (q.profit < w.profit ? q : w));
  const revenueTrend = quarters[quarters.length - 1].revenue - quarters[0].revenue;

  return {
    totalRevenue,
    totalExpenses,
    totalProfit,
    avgGrowth,
    profitMargin,
    bestQuarter,
    worstQuarter,
    revenueTrend,
    quarterCount: quarters.length,
  };
}

export function parseCSVToQuarters(csv: string): QuarterData[] {
  const lines = csv.trim().split('\n');
  const quarters: QuarterData[] = [];
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim());
    if (cols.length < 5) continue;
    quarters.push({
      label: cols[0],
      revenue: parseFloat(cols[1]) || 0,
      expenses: parseFloat(cols[2]) || 0,
      profit: parseFloat(cols[3]) || 0,
      growth: parseFloat(cols[4]) || 0,
    });
  }
  return quarters;
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
