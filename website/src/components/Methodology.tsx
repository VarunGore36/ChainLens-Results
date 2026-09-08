import { FileText, Database, GitBranch, BarChart3, Server } from 'lucide-react';

export function Methodology() {
  return (
    <section id="methodology" className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Methodology</h2>
        <p className="text-muted mb-8">
          How ChainLens evaluates performance and correctness.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card
            icon={<FileText size={20} />}
            title="What Is Scanned"
            status="implemented"
          >
            <p>
              ChainLens ingests Ethereum mainnet blocks, transactions, receipts, and event logs
              from a JSON-RPC endpoint. Each block is decoded and validated for internal
              consistency: receipt count matches transaction count, log indices are contiguous,
              and parent-hash linkage holds.
            </p>
          </Card>

          <Card
            icon={<Database size={20} />}
            title="Data Pipeline"
            status="implemented"
          >
            <p>
              The pipeline fans out for network I/O and decoding (order-independent work)
              and funnels to a single committer for writes (order-dependent). All channels
              are bounded for structural backpressure. The cursor advances in the same
              PostgreSQL transaction as the block data.
            </p>
          </Card>

          <Card
            icon={<GitBranch size={20} />}
            title="Reorg Detection"
            status="implemented"
          >
            <p>
              At commit time, the incoming block's parent hash is compared against the stored
              hash of the previous block. On mismatch, the indexer walks back to the common
              ancestor, cascade-deletes orphaned data, and resets the cursor — all in one
              transaction. If no ancestor is found within 128 blocks, the indexer halts.
            </p>
          </Card>

          <Card
            icon={<BarChart3 size={20} />}
            title="Benchmark Environments"
            status="planned"
          >
            <p>
              Throughput benchmarks (Phase 11) will run in three environments to make costs
              attributable: fixture replay with zero latency (isolating decode + write path),
              fixture replay with synthetic latency (isolating concurrency), and real RPC
              provider (establishing achievable throughput).
            </p>
          </Card>

          <Card
            icon={<Server size={20} />}
            title="Crash Recovery"
            status="implemented"
          >
            <p>
              Crash safety is tested, not assumed. The cursor lives in the same transaction
              as the data, making recovery a single SELECT. Idempotent writes (natural primary
              keys, no sequences) mean reprocessing a block produces identical state. Phase 7
              verifies this with 100+ randomized kill -9 cycles.
            </p>
          </Card>

          <Card
            icon={<FileText size={20} />}
            title="Result Publication"
            status="implemented"
          >
            <p>
              Results are published as JSON files in the data/ directory. The website loads
              these files at runtime — no benchmark numbers are hardcoded in components.
              Historical results accumulate in data/historical/ as timestamped snapshots.
            </p>
          </Card>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Benchmark Environments</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Environment
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Setup
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Isolates
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Answers
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-medium">E1 Replay</td>
                  <td className="px-4 py-3 text-muted">Mock RPC, zero latency</td>
                  <td className="px-4 py-3 text-muted">Decode + DB write path</td>
                  <td className="px-4 py-3 text-muted">Where does CPU go? Is the committer the bottleneck?</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-medium">E2 Synthetic</td>
                  <td className="px-4 py-3 text-muted">Mock RPC, injected latency</td>
                  <td className="px-4 py-3 text-muted">Concurrency behavior</td>
                  <td className="px-4 py-3 text-muted">Does throughput scale with workers? Where does it flatten?</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">E3 Real</td>
                  <td className="px-4 py-3 text-muted">Actual hosted RPC</td>
                  <td className="px-4 py-3 text-muted">Real-world constraints</td>
                  <td className="px-4 py-3 text-muted">What do I actually get? What is the binding constraint?</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({
  icon,
  title,
  status,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  status: 'implemented' | 'planned';
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-accent-light">{icon}</div>
          <h3 className="font-semibold">{title}</h3>
        </div>
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            status === 'implemented'
              ? 'bg-green/15 text-green'
              : 'bg-yellow/15 text-yellow'
          }`}
        >
          {status}
        </span>
      </div>
      <div className="text-sm text-muted leading-relaxed">{children}</div>
    </div>
  );
}
