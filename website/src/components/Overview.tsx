import { Shield, GitBranch, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ChainLensData } from '../types';

interface Props {
  data: ChainLensData;
}

export function Overview({ data }: Props) {
  const lastUpdated = new Date(data.lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section id="overview" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            ChainLens
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Ethereum Blockchain Indexer Performance & Reliability Intelligence
          </p>
          <p className="text-muted mt-4 max-w-3xl mx-auto">
            ChainLens analyzes Ethereum mainnet blocks, transactions, receipts, and event logs
            with reorg-safe, crash-resumable ingestion. These results demonstrate measured
            performance and correctness properties.
          </p>
        </div>

        {data.sampleData && (
          <div className="mb-8 rounded-lg border border-yellow/30 bg-yellow/10 px-4 py-3 text-center text-sm text-yellow">
            Results shown use sample data. Real benchmark results will be published after Phase 11.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<GitBranch className="text-accent-light" size={20} />}
            label="Version"
            value={data.version}
          />
          <StatCard
            icon={<CheckCircle className="text-green" size={20} />}
            label="Tests Passing"
            value={String(data.summary.testsPassing ?? '—')}
          />
          <StatCard
            icon={<Shield className="text-accent-light" size={20} />}
            label="Max Reorg Depth"
            value={String(data.summary.maxReorgDepth ?? '—')}
          />
          <StatCard
            icon={<AlertTriangle className="text-muted" size={20} />}
            label="Last Updated"
            value={lastUpdated}
          />
        </div>

        <div className="mt-8 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green/15 text-green">
            <span className="w-2 h-2 rounded-full bg-green" />
            {data.status}
          </span>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-2 text-muted">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
