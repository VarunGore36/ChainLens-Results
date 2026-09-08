# ChainLens Results

Performance metrics, benchmark results, and analysis from [ChainLens](https://github.com/VarunGore36/ChainLens) — an Ethereum blockchain indexer built in Rust.

**Live dashboard:** [https://varungore36.github.io/ChainLens-Results/](https://varungore36.github.io/ChainLens-Results/)

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

## Repository Structure

```
ChainLens-Results/
├── README.md
├── LICENSE
├── data/
│   ├── latest.json           Primary source of truth
│   ├── RESULTS.md            Detailed benchmark documentation
│   └── historical/
│       └── results.json      Historical scan snapshots
├── website/                  React dashboard (Vite + TypeScript + Tailwind)
│   ├── src/
│   ├── public/
│   └── dist/                 Built static site
└── docs/                     Additional documentation
```

## How the Website Works

The dashboard is a React + Vite + TypeScript application styled with Tailwind CSS. It loads data from:

- `/data/latest.json` — current benchmark results
- `/data/historical/results.json` — historical results over time

**No benchmark numbers are hardcoded in components.** The JSON files are the single source of truth. Updating `data/latest.json` and redeploying automatically updates the dashboard.

### Sections

1. **Overview** — project status, version, test results, last updated
2. **Latest Results** — decode benchmarks, throughput metrics
3. **Security Findings** — advisory table (populated when dependency data is available)
4. **Dependency Analysis** — charts for dependency health distribution
5. **Historical Results** — timeline of scans with trend charts
6. **Methodology** — how ChainLens evaluates performance and correctness
7. **About** — project description, links, roadmap

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

The site will be available at `http://localhost:3000`.

## Building for Production

```bash
cd website
npm run build
```

The built site is output to `website/dist/`. The `data/` directory is copied to `dist/data/` during build.

## Deploying

The site is deployed on **Vercel**. Pushing to `main` triggers an automatic deployment.

### Vercel Setup

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project**
3. Import `VarunGore36/ChainLens-Results`
4. Vercel will auto-detect the Vite framework from `vercel.json`
5. Click **Deploy**

The `vercel.json` at the repo root handles all configuration:

```json
{
  "buildCommand": "cd website && npm run build",
  "outputDirectory": "website/dist",
  "installCommand": "cd website && npm install",
  "framework": "vite"
}
```

No environment variables required.

## Data Schema

### latest.json

```typescript
interface ChainLensData {
  lastUpdated: string;          // ISO 8601 timestamp
  version: string;              // ChainLens version
  status: string;               // Current project status
  sampleData: boolean;          // Whether this is sample data
  summary: {
    sequentialThroughput?: {    // Throughput measurement
      value: string;
      unit: string;
      phase: string;
    };
    decodeLatency?: {           // Decode benchmark summary
      value: number;
      unit: string;
      description: string;
    };
    maxReorgDepth?: number;
    totalTests?: number;
    testsPassing?: number;
    totalDependencies?: number;
    directDependencies?: number;
    transitiveDependencies?: number;
    vulnerabilities?: number;
    unmaintained?: number;
  };
  decodeBenchmarks: Array<{
    name: string;
    time_ns: number;
    status: string;
  }>;
  findings?: Array<{
    id: string;
    package: string;
    version: string;
    type: 'vulnerability' | 'unmaintained' | 'warning' | 'informational';
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    patchedVersion?: string;
    description: string;
    url?: string;
    status: 'open' | 'patched' | 'acknowledged';
  }>;
  phases: Array<{
    id: number;
    name: string;
    status: 'complete' | 'next' | 'planned';
  }>;
}
```

### historical/results.json

```typescript
Array<{
  date: string;
  version: string;
  phase: number;
  decode_eip1559_with_erc20_ns?: number;
  tests_passing?: number;
  total_dependencies?: number;
  vulnerabilities?: number;
  unmaintained?: number;
  note?: string;
}>
```

## How Result Updates Work

```
PRIVATE CHAINLENS REPO
        │
        │ run analysis / benchmarks
        v
published results
        │
        v
ChainLens-Results/data/latest.json
        │
        v
website rebuild (automatic or manual)
        │
        v
live dashboard
```

1. Benchmarks and analysis run in the private ChainLens repository
2. Results are published to `data/latest.json` in this repository
3. The website reads the JSON at runtime
4. Redeploying (or GitHub Pages auto-build) updates the dashboard

## Latest Results

| Benchmark | Time (ns) |
|-----------|-----------|
| `decode_empty_block` | 28.3 |
| `decode_legacy_tx` | 67.2 |
| `decode_eip1559_with_erc20` | 150.6 |
| `decode_erc721` | 125.6 |
| `decode_contract_creation` | 65.1 |
| `decode_multi_tx_with_logs` | 241.5 |

63 tests passing. Zero failures.

See [data/RESULTS.md](data/RESULTS.md) for detailed benchmark documentation.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE).
