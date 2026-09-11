# ChainLens Results

Performance metrics, benchmark results, and analysis from [ChainLens](https://github.com/VarunGore36/ChainLens) — an Ethereum blockchain indexer built in Rust.

## What is ChainLens?

ChainLens is an Ethereum mainnet indexer that ingests blocks, transactions, receipts, and event logs from a JSON-RPC endpoint, decodes them, persists them to PostgreSQL, and serves them over a read API.

It is built around three properties that indexer implementations commonly skip:

1. **Correct handling of chain reorganizations** — tested against a scriptable mock, not assumed
2. **Crash safety that is tested rather than assumed** — kill the process at any point, it resumes without gaps or duplicates
3. **Performance that is measured rather than claimed** — benchmarked in three environments to make costs attributable

## Why is the main repository private?

The core ChainLens implementation repository is private because it contains:

- Internal engineering specifications and interview preparation notes
- Proprietary benchmarking harnesses and experimental configurations
- Raw benchmark datasets and intermediate experiment results
- Internal tooling and scripts not intended for public use
- Detailed implementation notes and architectural decision records

The **results** of that work — benchmark numbers, methodology, architecture decisions, and this dashboard — are published here.

## Latest Results

### Pipeline Throughput (PostgreSQL 17)

| Experiment | blocks/sec |
|------------|------------|
| Sequential (1 worker) | **392** |
| Concurrent (2 workers) | 382 |
| Concurrent (4 workers) | 376 |
| Decode only (no DB) | **1,700,000** |

### Decode Benchmarks

| Benchmark | Time (ns) |
|-----------|-----------|
| `decode_empty_block` | 28.3 |
| `decode_legacy_tx` | 67.2 |
| `decode_eip1559_with_erc20` | 150.6 |
| `decode_erc721` | 125.6 |
| `decode_contract_creation` | 65.1 |
| `decode_multi_tx_with_logs` | 241.5 |

### Test Results

| Metric | Value |
|--------|-------|
| Total tests | **63** |
| Unit tests | 56 |
| Integration tests | 7 |
| Failures | 0 |

## Architecture

```
  Ethereum JSON-RPC
         │
         ▼
  ┌─────────────┐   ┌─────────────┐
  │ Head Watcher│──▶│  Scheduler  │
  └─────────────┘   └──────┬──────┘
                           │
                    bounded channel ◀── backpressure
                           │
         ┌─────────────────┴─────────────────┐
         │      Fetch + Decode Workers       │
         └─────────────────┬─────────────────┘
                           │
                    bounded channel ◀── backpressure
                           │
                    ┌──────▼──────┐
                    │  Sequencer  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐      ┌───────────────┐
                    │  Committer  │─────▶│ Reorg Handler │
                    └──────┬──────┘      └──────┬──────┘
                           │                     │
                           ▼   one transaction   ▼
                    ┌──────────────────────────────────┐
                    │           PostgreSQL             │
                    └──────────────────────────────────┘
```

**Key design decisions:**
- Fan out for I/O, funnel to a single writer — the bottleneck is RPC round-trips by an order of magnitude
- The cursor lives in the same transaction as the data — crash recovery is a single `SELECT`
- Every channel is bounded — backpressure is structural, not hoped for
- Reorgs are tested against a scriptable mock, not against mainnet

## Methodology

### Three environments, so cost is attributable

| Env | Setup | Isolates | Answers |
|-----|-------|----------|---------|
| **E1 Replay** | Mock RPC, zero latency | decode + DB write path | What is my ceiling? |
| **E2 Synthetic** | Mock RPC, injected latency | concurrency behavior | Does throughput scale with workers? |
| **E3 Real** | Actual hosted RPC | real-world constraints | What do I actually get? |

### How results are generated

1. **Decode benchmarks** run via `criterion` against JSON fixture files
2. **Pipeline benchmarks** run via custom harness against mock RPC + PostgreSQL
3. **Integration tests** verify decode correctness against fixtures
4. All results record git revision, configuration, and environment

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Foundation and scaffolding | Complete |
| 2 | RPC client | Complete |
| 3 | Domain model and decoding | Complete |
| 4 | Schema and commit | Complete |
| 5 | Sequential pipeline | Complete |
| 6 | Reorg handling | Complete |
| 7 | Crash recovery | Complete |
| 8 | Observability | Complete |
| 9 | Concurrency | Complete |
| 10 | Query API | Complete |
| 11 | Benchmarking | Complete |
| 12 | Documentation | Complete |

## Data Files

| File | Description |
|------|-------------|
| `data/latest.json` | Current benchmark results (machine-readable) |
| `data/historical/results.json` | Historical results over time |
| `data/RESULTS.md` | Detailed benchmark results documentation |

## Running Locally

```bash
# Clone the repository
git clone https://github.com/VarunGore36/ChainLens-Results.git
cd ChainLens-Results

# Install dependencies
cd website
npm install

# Start development server
npm run dev
```

## Scope

**In scope:** Ethereum mainnet; block, transaction, receipt, and log indexing; ERC-20 and ERC-721 transfer decoding; canonical chain tracking with reorg rollback; crash-safe resumable indexing; bounded-concurrency ingestion; a read API; Prometheus metrics; a reproducible benchmark suite.

**Deliberately excluded:** Multi-chain support, GraphQL, a frontend dashboard, Kubernetes, Kafka.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE).
