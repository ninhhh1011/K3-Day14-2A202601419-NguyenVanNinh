import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewSection } from './components/OverviewSection';
import { BenchmarkExplorer } from './components/BenchmarkExplorer';
import { TraceInspectorModal } from './components/TraceInspectorModal';
import { RerankingLabSection } from './components/RerankingLabSection';
import { FrameworkComparisonSection } from './components/FrameworkComparisonSection';
import { FailureAnalysisSection } from './components/FailureAnalysisSection';
import type { DashboardData, QACase } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedCase, setSelectedCase] = useState<QACase | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/dashboard-data.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((jsonData: DashboardData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data:', err);
        setError('Không thể tải dữ liệu benchmark. Vui lòng kiểm tra file public/data/dashboard-data.json.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--color-primary-dark)', fontFamily: 'var(--font-heading)' }}>
        <h2>Đang tải dữ liệu RAG Evaluation Lab...</h2>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-error-red)' }}>
        <h2>Lỗi Tải Dữ Liệu</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {activeTab === 'overview' && (
          <OverviewSection
            meta={data.meta}
            onExploreCases={() => setActiveTab('explorer')}
          />
        )}

        {activeTab === 'explorer' && (
          <BenchmarkExplorer
            cases={data.cases}
            onSelectCase={(qaCase) => setSelectedCase(qaCase)}
          />
        )}

        {activeTab === 'reranking' && (
          <RerankingLabSection data={data.reranking_lab} />
        )}

        {activeTab === 'framework' && (
          <FrameworkComparisonSection data={data.framework_comparison} />
        )}

        {activeTab === 'failures' && (
          <FailureAnalysisSection
            data={data.failure_analysis}
            cases={data.cases}
            onSelectCase={(qaCase) => setSelectedCase(qaCase)}
          />
        )}
      </main>

      {/* Modal Trace Inspector */}
      <TraceInspectorModal
        qaCase={selectedCase}
        onClose={() => setSelectedCase(null)}
      />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid var(--color-light-gray)',
        fontSize: '12px',
        color: 'var(--color-warm-taupe)'
      }}>
        Northstar University Student Services RAG Assistant Evaluation Pipeline • AICB-P1 Day 14
      </footer>
    </div>
  );
}

export default App;
