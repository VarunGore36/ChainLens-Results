import { ShieldAlert, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import type { ChainLensData, Finding } from '../types';

interface Props {
  data: ChainLensData;
}

export function SecurityFindings({ data }: Props) {
  const findings = data.findings ?? [];

  return (
    <section id="security" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Security Findings</h2>
        <p className="text-muted mb-8">
          Security advisories, maintenance warnings, and dependency risks.
        </p>

        {findings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                      ID
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                      Package
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                      Version
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                      Patched
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {findings.map((f) => (
                    <FindingRow key={f.id} finding={f} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FindingRow({ finding }: { finding: Finding }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-card/80">
      <td className="px-5 py-3">
        {finding.url ? (
          <a
            href={finding.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-accent-light hover:underline inline-flex items-center gap-1"
          >
            {finding.id}
            <ExternalLink size={12} />
          </a>
        ) : (
          <span className="font-mono text-sm">{finding.id}</span>
        )}
      </td>
      <td className="px-5 py-3 font-mono text-sm">{finding.package}</td>
      <td className="px-5 py-3 font-mono text-sm text-muted">{finding.version}</td>
      <td className="px-5 py-3">
        <TypeBadge type={finding.type} />
      </td>
      <td className="px-5 py-3">
        <SeverityBadge severity={finding.severity} />
      </td>
      <td className="px-5 py-3 font-mono text-sm">
        {finding.patchedVersion ?? '—'}
      </td>
      <td className="px-5 py-3 text-sm text-muted max-w-xs truncate">
        {finding.description}
      </td>
      <td className="px-5 py-3">
        <StatusBadge status={finding.status} />
      </td>
    </tr>
  );
}

function TypeBadge({ type }: { type: string }) {
  const config: Record<string, { icon: React.ReactNode; colors: string }> = {
    vulnerability: {
      icon: <ShieldAlert size={14} />,
      colors: 'bg-red/15 text-red',
    },
    unmaintained: {
      icon: <AlertTriangle size={14} />,
      colors: 'bg-yellow/15 text-yellow',
    },
    warning: {
      icon: <AlertTriangle size={14} />,
      colors: 'bg-orange/15 text-orange',
    },
    informational: {
      icon: <Info size={14} />,
      colors: 'bg-muted/15 text-muted',
    },
  };
  const c = config[type] ?? config.informational;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${c.colors}`}
    >
      {c.icon}
      {type}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    critical: 'bg-red/20 text-red font-bold',
    high: 'bg-red/15 text-red',
    medium: 'bg-orange/15 text-orange',
    low: 'bg-yellow/15 text-yellow',
    info: 'bg-muted/15 text-muted',
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs ${colors[severity] ?? colors.info}`}
    >
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: 'bg-red/15 text-red',
    patched: 'bg-green/15 text-green',
    acknowledged: 'bg-yellow/15 text-yellow',
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[status] ?? 'bg-muted/15 text-muted'}`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-border bg-card p-12 text-center">
      <ShieldAlert className="mx-auto mb-4 text-green" size={48} />
      <h3 className="text-lg font-semibold mb-2">No Security Findings</h3>
      <p className="text-muted text-sm max-w-md mx-auto">
        No security advisories or unmaintained dependency warnings have been detected.
        Security findings will appear here when published results include dependency analysis data.
      </p>
    </div>
  );
}
