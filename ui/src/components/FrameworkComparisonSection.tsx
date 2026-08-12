import React from 'react';
import type { FrameworkComparisonData } from '../types';
import { GitCompare, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ComparisonProps {
  data: FrameworkComparisonData;
}

export const FrameworkComparisonSection: React.FC<ComparisonProps> = ({ data }) => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        padding: '24px 32px',
        border: '1px solid var(--color-light-gray)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '24px', color: 'var(--color-primary-dark)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitCompare size={24} color="var(--color-heritage-gold)" /> Exercise 3.4 — RAGAS vs DeepEval Comparison
            </h2>
            <p style={{ color: 'var(--color-warm-taupe)', fontSize: '14px' }}>
              So sánh thiết kế hai framework đánh giá RAG phổ biến hàng đầu trên cùng 20 QA Golden Dataset.
            </p>
          </div>

          <span style={{
            backgroundColor: 'rgba(193, 154, 75, 0.15)',
            color: 'var(--color-earthy-brown)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid rgba(193, 154, 75, 0.4)'
          }}>
            <AlertTriangle size={15} /> {data.mode}
          </span>
        </div>
      </div>

      {/* Environment Note Card */}
      <div style={{
        backgroundColor: 'var(--color-pale-beige)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-card)',
        borderLeft: '4px solid var(--color-heritage-gold)',
        fontSize: '13px',
        color: 'var(--color-primary-dark)'
      }}>
        <strong>Ghi chú Môi trường:</strong> {data.reason}
      </div>

      {/* Comparison Matrix Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-light-gray)',
        boxShadow: 'var(--shadow-card)',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-pale-beige)', borderBottom: '1px solid var(--color-light-gray)' }}>
              <th style={{ padding: '14px 20px', width: '22%' }}>Tiêu chí So sánh</th>
              <th style={{ padding: '14px 20px', width: '39%', color: 'var(--color-deep-slate)' }}>RAGAS Framework (v0.4.3)</th>
              <th style={{ padding: '14px 20px', width: '39%', color: 'var(--color-earthy-brown)' }}>DeepEval Framework (v4.1.7)</th>
            </tr>
          </thead>
          <tbody>
            {data.table.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--color-primary-dark)', backgroundColor: '#FAFAFA' }}>
                  {row.criterion}
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--color-primary-dark)' }}>
                  {row.ragas}
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--color-primary-dark)' }}>
                  {row.deepeval}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hypotheses & Key Insights */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        padding: '24px 32px',
        border: '1px solid var(--color-light-gray)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="var(--color-heritage-gold)" /> Giả thuyết Kiểm chứng & Insights Thiết kế
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.hypotheses.map((h, idx) => (
            <div key={idx} style={{
              backgroundColor: '#F9FAFB',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid var(--color-light-gray)'
            }}>
              <h4 style={{ fontSize: '15px', color: 'var(--color-deep-slate)', marginBottom: '4px' }}>
                {idx + 1}. {h.title}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-warm-taupe)' }}>
                {h.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
