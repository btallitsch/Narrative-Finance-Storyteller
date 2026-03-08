import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts';
import type { FinancialDataset } from '../types';
import { toChartData, formatCurrency, formatPercent, computeSummaryStats } from '../logic/dataTransformer';

interface ChartPanelProps {
  dataset: FinancialDataset;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}

const COLORS = {
  revenue: '#6c9bbd',
  expenses: '#e07a5f',
  profit: '#81b29a',
  growth: '#f2cc8f',
};

// Custom tooltip
function CustomTooltip({ active, payload, label, currency }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  currency: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.name === 'Growth %'
            ? formatPercent(p.value)
            : formatCurrency(p.value, currency)}
        </p>
      ))}
    </div>
  );
}

export default function ChartPanel({ dataset }: ChartPanelProps) {
  const data = toChartData(dataset);
  const stats = computeSummaryStats(dataset);
  const { currency } = dataset;

  return (
    <div className="chart-panel">
      <div className="chart-stats-row">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.totalRevenue, currency)}
          sub={`${dataset.quarters.length} quarters`}
        />
        <StatCard
          label="Total Profit"
          value={formatCurrency(stats.totalProfit, currency)}
          sub={`${stats.profitMargin.toFixed(1)}% margin`}
        />
        <StatCard
          label="Avg Growth"
          value={formatPercent(stats.avgGrowth)}
          sub="per quarter"
        />
        <StatCard
          label="Best Quarter"
          value={stats.bestQuarter.label}
          sub={formatCurrency(stats.bestQuarter.profit, currency) + ' profit'}
        />
      </div>

      {/* Revenue & Expenses Bar Chart */}
      <div className="chart-block">
        <h4 className="chart-title">Revenue vs. Expenses vs. Profit</h4>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: '#8a8fa8', fontSize: 11 }} />
            <YAxis
              tick={{ fill: '#8a8fa8', fontSize: 11 }}
              tickFormatter={(v) => formatCurrency(v, currency)}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#8a8fa8' }} />
            <Bar dataKey="revenue" name="Revenue" fill={COLORS.revenue} radius={[3, 3, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill={COLORS.expenses} radius={[3, 3, 0, 0]} />
            <Area
              type="monotone"
              dataKey="profit"
              name="Profit"
              fill={`${COLORS.profit}33`}
              stroke={COLORS.profit}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Growth Rate Line */}
      <div className="chart-block">
        <h4 className="chart-title">Quarter-over-Quarter Growth Rate</h4>
        <ResponsiveContainer width="100%" height={160}>
          <ComposedChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: '#8a8fa8', fontSize: 11 }} />
            <YAxis
              tick={{ fill: '#8a8fa8', fontSize: 11 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Area
              type="monotone"
              dataKey="growth"
              name="Growth %"
              fill={`${COLORS.growth}33`}
              stroke={COLORS.growth}
              strokeWidth={2}
              dot={{ r: 4, fill: COLORS.growth }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
