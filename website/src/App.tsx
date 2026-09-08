import { Navbar } from './components/Navbar';
import { Overview } from './components/Overview';
import { LatestResults } from './components/LatestResults';
import { SecurityFindings } from './components/SecurityFindings';
import { DependencyAnalysis } from './components/DependencyAnalysis';
import { HistoricalResults } from './components/HistoricalResults';
import { Methodology } from './components/Methodology';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { useLatestData, useHistoricalData } from './hooks';

function App() {
  const { data, loading, error } = useLatestData();
  const { data: historical } = useHistoricalData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent-light border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-bold mb-4">ChainLens</h1>
          <p className="text-muted mb-4">
            Failed to load results data. Please check that data/latest.json exists and is valid.
          </p>
          <p className="text-sm text-red font-mono">{error ?? 'No data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Overview data={data} />
        <Divider />
        <LatestResults data={data} />
        <Divider />
        <SecurityFindings data={data} />
        <Divider />
        <DependencyAnalysis data={data} />
        <Divider />
        <HistoricalResults data={historical} />
        <Divider />
        <Methodology />
        <Divider />
        <About data={data} />
      </main>
      <Footer />
    </div>
  );
}

function Divider() {
  return <div className="max-w-7xl mx-auto px-6"><hr className="border-border" /></div>;
}

export default App;
