import { ExternalLink, BookOpen, FileText, GitBranch } from 'lucide-react';
import type { ChainLensData, Phase } from '../types';

interface Props {
  data: ChainLensData;
}

export function About({ data }: Props) {
  return (
    <section id="about" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">About ChainLens</h2>
        <p className="text-muted mb-8">
          Purpose, links, and project roadmap.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">What is ChainLens?</h3>
            <div className="text-sm text-muted space-y-3">
              <p>
                ChainLens is an Ethereum blockchain indexer built in Rust. It ingests blocks,
                transactions, receipts, and event logs from a JSON-RPC endpoint, decodes them,
                persists them to PostgreSQL, and serves them over a read API.
              </p>
              <p>
                It is built around three properties that indexer implementations commonly skip:
                correct handling of chain reorganizations, crash safety that is tested rather
                than assumed, and performance that is measured rather than claimed.
              </p>
              <p>
                This public repository contains the published results, benchmark data, and
                this dashboard. The core implementation is maintained in a separate private
                repository.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <div className="space-y-3">
              <LinkItem
                icon={<GitBranch size={16} />}
                label="Public Results Repository"
                href="https://github.com/VarunGore36/ChainLens-Results"
              />
              <LinkItem
                icon={<BookOpen size={16} />}
                label="Methodology"
                href="#methodology"
              />
              <LinkItem
                icon={<FileText size={16} />}
                label="Benchmark Results"
                href="/data/RESULTS.md"
              />
              <LinkItem
                icon={<ExternalLink size={16} />}
                label="Report an Issue"
                href="https://github.com/VarunGore36/ChainLens-Results/issues"
              />
            </div>
          </div>
        </div>

        <PhaseRoadmap phases={data.phases} />
      </div>
    </section>
  );
}

function LinkItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 text-sm text-muted hover:text-text transition-colors"
    >
      {icon}
      {label}
    </a>
  );
}

function PhaseRoadmap({ phases }: { phases: Phase[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Project Roadmap</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                Phase
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                Description
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {phases.map((phase) => (
              <tr
                key={phase.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 font-mono text-sm">{phase.id}</td>
                <td className="px-4 py-3 text-sm">{phase.name}</td>
                <td className="px-4 py-3">
                  <PhaseStatus status={phase.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PhaseStatus({ status }: { status: string }) {
  const config: Record<string, { label: string; colors: string }> = {
    complete: { label: 'Complete', colors: 'bg-green/15 text-green' },
    next: { label: 'Next', colors: 'bg-accent/15 text-accent-light' },
    planned: { label: 'Planned', colors: 'bg-muted/15 text-muted' },
  };
  const c = config[status] ?? config.planned;
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${c.colors}`}
    >
      {c.label}
    </span>
  );
}
