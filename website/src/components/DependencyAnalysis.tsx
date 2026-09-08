import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { ChainLensData } from '../types';

interface Props {
  data: ChainLensData;
}

const COLORS = {
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
  orange: '#f97316',
  muted: '#8b8fa3',
  accent: '#6366f1',
};

export function DependencyAnalysis({ data }: Props) {
  const stats = data.dependencyStats;

  if (!stats) {
    return (
      <section id="dependencies" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Dependency Analysis</h2>
          <p className="text-muted mb-8">
            Dependency landscape visualization.
          </p>
          <EmptyState />
        </div>
      </section>
    );
  }

  const healthData = [
    { name: 'Healthy', value: stats.healthy, color: COLORS.green },
    { name: 'Vulnerable', value: stats.vulnerable, color: COLORS.red },
    { name: 'Unmaintained', value: stats.unmaintained, color: COLORS.yellow },
  ].filter((d) => d.value > 0);

  const typeData = [
    { name: 'Direct', value: stats.direct, color: COLORS.accent },
    { name: 'Transitive', value: stats.transitive, color: COLORS.muted },
  ];

  const severityData = stats.severityDistribution
    ? Object.entries(stats.severityDistribution).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color:
          name === 'critical'
            ? COLORS.red
            : name === 'high'
              ? COLORS.orange
              : name === 'medium'
                ? COLORS.yellow
                : COLORS.muted,
      }))
    : [];

  const categoryData = stats.categories
    ? Object.entries(stats.categories).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  return (
    <section id="dependencies" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Dependency Analysis</h2>
        <p className="text-muted mb-8">
          Dependency landscape and health distribution.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <NumberCard label="Total" value={stats.total} />
          <NumberCard label="Direct" value={stats.direct} />
          <NumberCard label="Transitive" value={stats.transitive} />
          <NumberCard label="Vulnerable" value={stats.vulnerable} highlight />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {healthData.length > 0 && (
            <ChartCard title="Dependency Health">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {healthData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1d27',
                      border: '1px solid #2a2d3a',
                      borderRadius: '8px',
                      color: '#e1e4ed',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          <ChartCard title="Direct vs Transitive">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {typeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1a1d27',
                    border: '1px solid #2a2d3a',
                    borderRadius: '8px',
                    color: '#e1e4ed',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {severityData.length > 0 && (
            <ChartCard title="Severity Distribution">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                  <XAxis dataKey="name" tick={{ fill: '#8b8fa3', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#8b8fa3', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1d27',
                      border: '1px solid #2a2d3a',
                      borderRadius: '8px',
                      color: '#e1e4ed',
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {severityData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}

          {categoryData.length > 0 && (
            <ChartCard title="Dependency Categories">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                  <XAxis type="number" tick={{ fill: '#8b8fa3', fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#8b8fa3', fontSize: 12 }}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1d27',
                      border: '1px solid #2a2d3a',
                      borderRadius: '8px',
                      color: '#e1e4ed',
                    }}
                  />
                  <Bar dataKey="value" fill={COLORS.accent} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      </div>
    </section>
  );
}

function NumberCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs text-muted uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-red' : ''}`}>{value}</div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-border bg-card p-12 text-center">
      <BarChart3 className="mx-auto mb-4 text-muted" size={48} />
      <h3 className="text-lg font-semibold mb-2">No Dependency Data</h3>
      <p className="text-muted text-sm max-w-md mx-auto">
        Dependency analysis charts will appear when published results include dependency statistics.
      </p>
    </div>
  );
}
