# ChainLens — Benchmark Results

All benchmark results from the ChainLens Ethereum indexer project. Each result records its git revision, configuration, and environment.

**Latest update:** 2026-09-09 (Phase 4 complete)

---

## Decode Benchmarks (Phase 3)

**Git revision:** Phase 3 complete
**Environment:** Release profile, single-threaded, no I/O
**Fixture set:** 6 synthetic blocks covering all transaction types

| Benchmark | Time (ns) | Description |
|-----------|-----------|-------------|
| `decode_empty_block` | 28.3 | Block with zero transactions |
| `decode_legacy_tx` | 67.2 | Legacy (type 0) transaction |
| `decode_eip1559_with_erc20` | 150.6 | EIP-1559 transaction with ERC-20 Transfer event |
| `decode_erc721` | 125.6 | ERC-721 NFT Transfer event (4 topics) |
| `decode_contract_creation` | 65.1 | Contract creation (to = null) |
| `decode_multi_tx_with_logs` | 241.5 | 2 transactions, 2 logs (Transfer + Approval) |

### Analysis

The decode path is pure CPU — synchronous, side-effect-free, no allocations beyond the output vectors. At ~150 ns per block with ERC-20 transfers:

- At 100 blocks/sec: ~15 µs of CPU per second (negligible)
- At 1000 blocks/sec: ~150 µs of CPU per second (still negligible)
- The decode stage will not be the bottleneck even at aggressive backfill rates

The cost scales linearly with transaction count and log count. A block with 200 transactions would take roughly ~15 µs to decode — still far below the RPC round-trip latency that dominates the pipeline.

---

## Test Results

| Metric | Value |
|--------|-------|
| Total tests | 63 |
| Unit tests | 56 |
| Integration tests | 7 |
| Failures | 0 |
| Clippy warnings | 0 |
| Fmt deviations | 0 |

### Test Coverage by Module

| Module | Tests | What's tested |
|--------|-------|---------------|
| `config` | 12 | URL redaction, validation, CLI definition |
| `db` | 1 | Error message formatting |
| `decode/block` | 5 | Empty block, EIP-1559, receipt mismatch, hash mismatch, log gap |
| `decode/erc20` | 7 | ERC-20, ERC-721, skips, rejects, round-trip |
| `domain/token_transfer` | 2 | Topic constants match keccak256 |
| `rpc/http` | 4 | Error classification, BlockId serialization |
| `rpc/retry` | 5 | Delay bounds, doubling, cap, jitter |
| `rpc/ratelimit` | 2 | Delays excess, passes within limit |
| `rpc/types` | 6 | Hex quantity, JSON deserialization |
| `store/postgres` | 2 | U256 numeric conversion |
| `telemetry` | 2 | Filter parsing |
| `shutdown` | 1 | Token registration |
| Integration | 7 | All fixture files decode correctly |

---

## Fixture Set

Six JSON fixtures covering all transaction types:

| Fixture | Content | Purpose |
|---------|---------|---------|
| `empty_block` | Block with no transactions | Baseline overhead |
| `legacy_tx` | Legacy (type 0) transaction | Pre-EIP-1559 format |
| `eip1559_erc20_transfer` | EIP-1559 + ERC-20 Transfer event | Most common modern pattern |
| `erc721_transfer` | ERC-721 NFT Transfer (4 topics) | Topic count distinction |
| `contract_creation` | Contract creation (to = null) | Null address handling |
| `multi_tx_with_logs` | 2 transactions, 2 logs | Multi-tx block, Approval event |

---

## Pending Results (Phase 11)

The following benchmarks will be measured in Phase 11:

### Throughput Scaling

- Sequential vs concurrent (workers: 1, 2, 4, 8, 16, 32, 64)
- DB batch size (1, 10, 50, 100, 500 blocks per transaction)
- Insert strategy (single INSERT vs multi-row vs COPY)
- Index cost (with indexes vs created after)

### Crash Recovery

- 100+ `kill -9` cycles at randomized offsets
- Invariant check after each cycle
- Recovery time measurement

### Reorg Handling

- Reorg depths: 1, 5, 20, 50
- Rollback latency vs depth
- Rows deleted vs depth

---

## Reproducibility

Every result in this document records:
- Git revision (when Phase 11 runs)
- Full configuration
- Hardware specifications
- PostgreSQL version and settings
- Dataset block range
- Wall-clock duration

Results that cannot be re-run from a single documented command are anecdotes, not benchmarks.
