import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Clock } from 'lucide-react';
import type { HistoricalEntry } from '../types';

interface Props {
  data: HistoricalEntry[];
}

const COLORS = {
  accent: '#6366f1',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#eab308',
};

export function HistoricalResults({ data }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    dateShort: new Date(d.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <section id="history" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Historical Results</h2>
        <p className="text-muted mb-8">
          How ChainLens metrics have evolved over time.
        </p>

        {data.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="rounded-xl border border-border bg-card overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                        Version
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                        Phase
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                        Decode (ns)
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                        Tests
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((entry, i) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-0 hover:bg-card/80"
                      >
                        <td className="px-5 py-3 text-sm">{entry.date}</td>
                        <td className="px-5 py-3 font-mono text-sm">{entry.version}</td>
                        <td className="px-5 py-3 text-sm">{entry.phase}</td>
                        <td className="px-5 py-3 text-right font-mono text-sm">
                          {entry.decode_eip1559_with_erc20_ns?.toFixed(1) ?? '—'}
                        </td>
                        <td className="px-5 py-3 text-right text-sm">
                          {entry.tests_passing ?? '—'}
                        </td>
                        <td className="px-5 py-3 text-sm text-muted">{entry.note ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {data.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.some((d) => d.decode_eip1559_with_erc20_ns) && (
                  <ChartCard title="Decode Latency Over Time">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                        <XAxis
                          dataKey="dateShort"
                          tick={{ fill: '#8b8fa3', fontSize: 12 }}
                        />
                        <YAxis tick={{ fill: '#8b8fa3', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            background: '#1a1d27',
                            border: '1px solid #2a2d3a',
                            borderRadius: '8px',
                            color: '#e1e4ed',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="decode_eip1559_with_erc20_ns"
                          name="Decode (ns)"
                          stroke={COLORS.accent}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>
                )}

                {data.some((d) => d.tests_passing) && (
                  <ChartCard title="Tests Passing Over Time">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                        <XAxis
                          dataKey="dateShort"
                          tick={{ fill: '#8b8fa3', fontSize: 12 }}
                        />
                        <YAxis tick={{ fill: '#8b8fa3', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            background: '#1a1d27',
                            border: '1px solid #2a2d3a',
                            borderRadius: '8px',
                            color: '#e1e4ed',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="tests_passing"
                          name="Tests"
                          stroke={COLORS.green}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartCard>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
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
      <Clock className="mx-auto mb-4 text-muted" size={48} />
      <h3 className="text-lg font-semibold mb-2">No Historical Data Yet</h3>
      <p className="text-muted text-sm max-w-md mx-auto">
        Historical data will appear here as scans are published. Each scan creates a
        timestamped snapshot in the data/historical/ directory.
      </p>
    </div>
  );
}
