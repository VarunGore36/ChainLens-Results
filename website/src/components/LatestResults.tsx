import { Activity, Zap, GitBranch, TestTube, Timer, BarChart3 } from 'lucide-react';
import type { ChainLensData } from '../types';

interface Props {
  data: ChainLensData;
}

export function LatestResults({ data }: Props) {
  const { summary, decodeBenchmarks } = data;

  return (
    <section id="results" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Latest Results</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {summary.sequentialThroughput && (
            <MetricCard
              icon={<Activity size={18} />}
              label="Sequential Throughput"
              value={summary.sequentialThroughput.value}
              unit={summary.sequentialThroughput.unit}
              sub={summary.sequentialThroughput.phase}
            />
          )}
          {summary.decodeLatency && (
            <MetricCard
              icon={<Zap size={18} />}
              label="Decode Latency"
              value={`${summary.decodeLatency.value}`}
              unit={summary.decodeLatency.unit}
              sub={summary.decodeLatency.description}
            />
          )}
          {summary.totalTests !== undefined && (
            <MetricCard
              icon={<TestTube size={18} />}
              label="Total Tests"
              value={String(summary.totalTests)}
              sub={`${summary.testsPassing} passing`}
            />
          )}
          {summary.maxReorgDepth !== undefined && (
            <MetricCard
              icon={<GitBranch size={18} />}
              label="Max Reorg Depth"
              value={String(summary.maxReorgDepth)}
              sub="blocks"
            />
          )}
          {summary.scanDuration && (
            <MetricCard
              icon={<Timer size={18} />}
              label="Scan Duration"
              value={summary.scanDuration}
            />
          )}
          {summary.totalDependencies !== undefined && (
            <MetricCard
              icon={<BarChart3 size={18} />}
              label="Dependencies"
              value={String(summary.totalDependencies)}
              sub={`${summary.directDependencies ?? '—'} direct`}
            />
          )}
        </div>

        <h3 className="text-lg font-semibold mb-4">Decode Benchmarks</h3>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                  Benchmark
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                  Time (ns)
                </th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                  Time (µs)
                </th>
                <th className="text-center px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {decodeBenchmarks.map((b) => (
                <tr
                  key={b.name}
                  className="border-b border-border last:border-0 hover:bg-card/80"
                >
                  <td className="px-5 py-3 font-mono text-sm">{b.name}</td>
                  <td className="px-5 py-3 text-right font-mono text-sm">
                    {b.time_ns.toFixed(1)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-sm text-muted">
                    {(b.time_ns / 1000).toFixed(3)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  unit,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-2 text-muted">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-sm text-muted">{unit}</span>}
      </div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors =
    status === 'pass'
      ? 'bg-green/15 text-green'
      : status === 'fail'
        ? 'bg-red/15 text-red'
        : 'bg-yellow/15 text-yellow';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors}`}>
      {status}
    </span>
  );
}
