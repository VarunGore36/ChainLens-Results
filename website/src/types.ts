export interface ChainLensData {
  lastUpdated: string;
  version: string;
  status: string;
  sampleData: boolean;
  summary: {
    sequentialThroughput?: {
      value: string;
      unit: string;
      phase: string;
    };
    decodeLatency?: {
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
    outdated?: number;
    scanDuration?: string;
  };
  decodeBenchmarks: DecodeBenchmark[];
  findings?: Finding[];
  dependencyStats?: DependencyStats;
  phases: Phase[];
}

export interface DecodeBenchmark {
  name: string;
  time_ns: number;
  status: string;
}

export interface Finding {
  id: string;
  package: string;
  version: string;
  type: 'vulnerability' | 'unmaintained' | 'warning' | 'informational';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  patchedVersion?: string;
  description: string;
  url?: string;
  status: 'open' | 'patched' | 'acknowledged';
  recommendation?: string;
}

export interface DependencyStats {
  direct: number;
  transitive: number;
  total: number;
  healthy: number;
  vulnerable: number;
  unmaintained: number;
  categories?: Record<string, number>;
  severityDistribution?: Record<string, number>;
}

export interface Phase {
  id: number;
  name: string;
  status: 'complete' | 'next' | 'planned';
}

export interface HistoricalEntry {
  date: string;
  version: string;
  phase: number;
  decode_eip1559_with_erc20_ns?: number;
  tests_passing?: number;
  total_dependencies?: number;
  vulnerabilities?: number;
  unmaintained?: number;
  note?: string;
}
