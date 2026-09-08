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
- Detailed implementation notes and architectural decision records used during development

The **results** of that work — benchmark numbers, methodology, architecture decisions, and the public-facing dashboard — are published here.

## Results Dashboard

**[View the live results dashboard →](website/index.html)**

The dashboard shows:
- Latest benchmark results
- Decode latency measurements
- Throughput scaling data (Phase 11 pending)
- Project status and roadmap
- Methodology explanation

## Latest Results

### Decode Benchmarks (Phase 3)

| Benchmark | Time | Description |
|-----------|------|-------------|
| `decode_empty_block` | 28.3 ns | Block with no transactions |
| `decode_legacy_tx` | 67.2 ns | Legacy (type 0) transaction |
| `decode_eip1559_with_erc20` | 150.6 ns | EIP-1559 + ERC-20 Transfer event |
| `decode_erc721` | 125.6 ns | ERC-721 NFT Transfer (4 topics) |
| `decode_contract_creation` | 65.1 ns | Contract creation (to = null) |
| `decode_multi_tx_with_logs` | 241.5 ns | 2 transactions, 2 logs |

The decode path is pure CPU — no I/O, no allocations beyond the output vectors. At ~150 ns per block with ERC-20 transfers, the decode stage will not be the bottleneck even at 1000 blocks/sec.

### Test Results

- **63 tests** passing (56 unit + 7 integration)
- Zero failures
- `cargo clippy --locked --all-targets -- -D warnings` — clean
- `cargo fmt --all -- --check` — clean

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

## How Results Are Generated

1. **Decode benchmarks** run via `criterion` against JSON fixture files
2. **Integration tests** verify decode correctness against the same fixtures
3. **Throughput benchmarks** (Phase 11) will run in three environments:
   - **E1 Replay**: Mock RPC, zero latency → isolates decode + DB write path
   - **E2 Synthetic**: Mock RPC, injected latency → isolates concurrency behavior
   - **E3 Real**: Actual hosted RPC → establishes real-world constraints
4. All results record git revision, configuration, hardware, and PostgreSQL version

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Foundation and scaffolding | Complete |
| 2 | RPC client (retry, rate limiting, capability probe) | Complete |
| 3 | Domain model, validation, ERC-20/721 decoding | Complete |
| 4 | Schema and single-transaction commit | Complete |
| 5 | Sequential pipeline end to end | Next |
| 6 | Mock RPC harness and reorg handling | Planned |
| 7 | Crash recovery hardening | Planned |
| 8 | Observability (Prometheus metrics) | Planned |
| 9 | Concurrency (worker pool, reorder buffer) | Planned |
| 10 | Query API (axum) | Planned |
| 11 | Benchmarking | Planned |
| 12 | Documentation and polish | Planned |

## Roadmap

**MVP (Phases 1–7 + minimal API):** A system that continuously indexes Ethereum mainnet, decodes ERC-20/721 transfers, detects and correctly rolls back chain reorganizations (proven by deterministic test suite), survives `kill -9` at any point, and serves read endpoints.

**Performance (Phase 11):** Measured throughput across three environments, with the sequential baseline compared to concurrent results.

## Data Files

| File | Description |
|------|-------------|
| `data/latest.json` | Current benchmark results (machine-readable) |
| `data/historical/results.json` | Historical results over time |
| `data/RESULTS.md` | Detailed benchmark results documentation |

## Scope

**In scope:** Ethereum mainnet; block, transaction, receipt, and log indexing; ERC-20 and ERC-721 transfer decoding; canonical chain tracking with reorg rollback; crash-safe resumable indexing; bounded-concurrency ingestion; a read API; Prometheus metrics; a reproducible benchmark suite.

**Deliberately excluded:** Multi-chain support, GraphQL, a frontend dashboard, Kubernetes, Kafka.

## License

Licensed under the Apache License, Version 2.0.
