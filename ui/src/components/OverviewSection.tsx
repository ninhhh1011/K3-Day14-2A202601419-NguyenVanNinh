import React from 'react';
import type { DashboardMetaData } from '../types';
import { CheckCircle2, Award, FileText, Activity, AlertCircle, Info } from 'lucide-react';

interface OverviewProps {
  meta: DashboardMetaData;
  onExploreCases: () => void;
}

export const OverviewSection: React.FC<OverviewProps> = ({ meta, onExploreCases }) => {
  const formatPercent = (val: number) => (val * 100).toFixed(1) + '%';
  const formatScore = (val: number | null) => (val !== null ? val.toFixed(3) : 'N/A');

  const metricsList = [
    { label: 'Context Recall', val: meta.avg_metrics.context_recall, desc: 'Tỷ lệ phủ bằng chứng từ corpus' },
    { label: 'Context Precision', val: meta.avg_metrics.context_precision, desc: 'Thứ tự ưu tiên xếp hạng chunks' },
    { label: 'Faithfulness', val: meta.avg_metrics.faithfulness, desc: 'Mức độ trung thực không bịa đặt' },
    { label: 'Answer Relevance', val: meta.avg_metrics.relevance, desc: 'Đúng trọng tâm thắc mắc' },
    { label: 'Completeness', val: meta.avg_metrics.completeness, desc: 'Đầy đủ điều kiện & hạn chót' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Prominent Synthetic Demo Notice Banner */}
      <div style={{
        backgroundColor: 'rgba(193, 154, 75, 0.15)',
        color: 'var(--color-earthy-brown)',
        padding: '12px 20px',
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(193, 154, 75, 0.4)',
        fontSize: '13px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Info size={16} color="var(--color-heritage-gold)" />
        <span>{meta.notice}</span>
      </div>

      {/* Banner Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        padding: '28px 32px',
        border: '1px solid var(--color-light-gray)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              color: 'var(--color-success-green)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle2 size={13} /> Required Scope: Completed
            </span>
            <span style={{
              backgroundColor: 'rgba(155, 122, 58, 0.12)',
              color: 'var(--color-earthy-brown)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Award size={13} /> Bonus Scope: Completed
            </span>
            <span style={{
              backgroundColor: 'rgba(36, 56, 60, 0.1)',
              color: 'var(--color-deep-slate)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: 600
            }}>
              {meta.test_status}
            </span>
          </div>

          <h1 style={{ fontSize: '28px', color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
            {meta.title}
          </h1>
          <p style={{ color: 'var(--color-warm-taupe)', fontSize: '14px', marginBottom: '8px' }}>
            {meta.subtitle} ({meta.dataset_status}).
          </p>
          <p style={{ color: 'var(--color-earthy-brown)', fontSize: '12px', fontStyle: 'italic' }}>
            Provenance: {meta.data_provenance}
          </p>
        </div>

        <button
          onClick={onExploreCases}
          style={{
            backgroundColor: 'var(--color-deep-slate)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(36, 56, 60, 0.25)'
          }}
        >
          Khám phá {meta.total_cases} Test Cases →
        </button>
      </div>

      {/* Summary KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-light-gray)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--color-warm-taupe)', marginBottom: '4px' }}>Pass Rate (Tỉ lệ Đạt)</div>
          <div style={{ fontSize: '32px', fontWeight: 600, color: meta.pass_rate >= 0.5 ? 'var(--color-success-green)' : 'var(--color-error-red)' }}>
            {formatPercent(meta.pass_rate)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)', marginTop: '4px' }}>
            {meta.passed_count} Đạt / {meta.failed_count} Không đạt
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-light-gray)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--color-warm-taupe)', marginBottom: '4px' }}>Overall Score Trung bình</div>
          <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-heritage-gold)' }}>
            {formatScore(meta.avg_metrics.overall)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)', marginTop: '4px' }}>
            (Faithfulness + Relevance + Completeness) / 3
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-light-gray)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--color-warm-taupe)', marginBottom: '4px' }}>Context Recall Trung bình</div>
          <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-deep-slate)' }}>
            {formatScore(meta.avg_metrics.context_recall)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-success-green)', marginTop: '4px' }}>
            Retriever bao phủ {formatPercent(meta.avg_metrics.context_recall || 0)} bằng chứng
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-light-gray)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontSize: '13px', color: 'var(--color-warm-taupe)', marginBottom: '4px' }}>Context Precision Trung bình</div>
          <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-deep-slate)' }}>
            {formatScore(meta.avg_metrics.context_precision)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-success-green)', marginTop: '4px' }}>
            Chunks chuẩn xếp hạng Top 1-2
          </div>
        </div>
      </div>

      {/* RAG Triad & Metrics Detail */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        padding: '24px 32px',
        border: '1px solid var(--color-light-gray)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} color="var(--color-heritage-gold)" /> Điểm số 5 Chống Đánh giá (Metrics Breakdown)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {metricsList.map((m) => (
            <div key={m.label} style={{
              backgroundColor: 'var(--color-pale-beige)',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid rgba(184, 170, 141, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{m.label}</span>
                <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-primary-dark)' }}>
                  {formatScore(m.val)}
                </span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: '#E5E7EB',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(m.val || 0) * 100}%`,
                  backgroundColor: (m.val || 0) >= 0.8 ? 'var(--color-success-green)' : (m.val || 0) >= 0.6 ? 'var(--color-warning-gold)' : 'var(--color-error-red)',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-warm-taupe)' }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Stratification & Failures Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {/* Dataset Stratification */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-card)',
          padding: '24px',
          border: '1px solid var(--color-light-gray)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--color-heritage-gold)" /> Phân bổ Golden Dataset ({meta.total_cases} QA Pairs)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(meta.difficulty_distribution).map(([level, count]) => (
              <div key={level} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'var(--color-pale-beige)', borderRadius: '4px' }}>
                <span style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '14px' }}>{level}</span>
                <span style={{ backgroundColor: 'var(--color-heritage-gold)', color: '#FFF', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                  {count} QA ({((count / meta.total_cases) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Failure Type Distribution */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-card)',
          padding: '24px',
          border: '1px solid var(--color-light-gray)',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="var(--color-error-red)" /> Phân loại Lỗi (Failure Taxonomy)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(meta.failure_distribution).map(([type, count]) => (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: 'rgba(185, 77, 53, 0.08)', borderRadius: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-error-red)' }}>{type}</span>
                <span style={{ backgroundColor: 'var(--color-error-red)', color: '#FFF', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                  {count} cases ({((count / meta.total_cases) * 100).toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
