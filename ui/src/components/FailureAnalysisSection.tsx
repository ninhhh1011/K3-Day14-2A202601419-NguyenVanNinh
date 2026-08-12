import React from 'react';
import type { FailureAnalysisData, QACase } from '../types';
import { ShieldAlert, AlertTriangle, ListOrdered, Wrench, Eye } from 'lucide-react';

interface FailureProps {
  data: FailureAnalysisData;
  cases: QACase[];
  onSelectCase: (qaCase: QACase) => void;
}

export const FailureAnalysisSection: React.FC<FailureProps> = ({ data, cases, onSelectCase }) => {
  const getCaseById = (id: string) => cases.find((c) => c.id === id);

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
        <h2 style={{ fontSize: '24px', color: 'var(--color-primary-dark)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={24} color="var(--color-error-red)" /> Failure Analysis & 5 Whys Diagnostics
        </h2>
        <p style={{ color: 'var(--color-warm-taupe)', fontSize: '14px' }}>
          Phân tích sâu nguyên nhân gốc rễ (Root Causes) cho 3 cases điểm thấp nhất và phân nhóm lỗi Failure Clusters.
        </p>
      </div>

      {/* Top 3 Worst Cases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="var(--color-error-red)" /> Ba Cases Có Overall Score Thấp Nhất
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {data.worst_3_cases.map((wc, idx) => {
            const fullCase = getCaseById(wc.id);
            return (
              <div key={wc.id} style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-card)',
                padding: '20px',
                border: '1px solid var(--color-light-gray)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-deep-slate)' }}>
                      #{idx + 1}. Case {wc.id}
                    </span>
                    <span style={{ backgroundColor: 'rgba(185, 77, 53, 0.12)', color: 'var(--color-error-red)', padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
                      Score: {wc.score.toFixed(3)}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-primary-dark)' }}>
                    Question: {fullCase?.question}
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--color-warm-taupe)', marginBottom: '12px' }}>
                    <strong>Phân tích:</strong> {wc.reason}
                  </p>
                </div>

                {fullCase && (
                  <button
                    onClick={() => onSelectCase(fullCase)}
                    style={{
                      backgroundColor: 'var(--color-pale-beige)',
                      border: '1px solid var(--color-muted-border)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '6px 14px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      color: 'var(--color-primary-dark)',
                      width: '100%'
                    }}
                  >
                    <Eye size={13} /> Xem Chi tiết Trace 5 Whys
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Failure Clusters Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        padding: '24px',
        border: '1px solid var(--color-light-gray)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ListOrdered size={18} color="var(--color-heritage-gold)" /> Phân nhóm Lỗi (Failure Clusters) & Độ ưu tiên
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-pale-beige)', borderBottom: '1px solid var(--color-light-gray)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Failure Cluster Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Số cases</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Priority</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Affected IDs</th>
              </tr>
            </thead>
            <tbody>
              {data.clusters.map((cl, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{cl.name}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>{cl.count}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: cl.priority === 'High' ? 'rgba(185, 77, 53, 0.15)' : 'rgba(193, 154, 75, 0.15)',
                      color: cl.priority === 'High' ? 'var(--color-error-red)' : 'var(--color-earthy-brown)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '11px'
                    }}>
                      {cl.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{cl.ids.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Improvements */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        padding: '24px 32px',
        border: '1px solid var(--color-light-gray)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wrench size={18} color="var(--color-heritage-gold)" /> Khuyến nghị Cải tiến Ưu tiên (Improvement Log)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--color-primary-dark)' }}>
          <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-pale-beige)', borderRadius: '6px' }}>
            <strong>1. Triển khai Refusal-Aware Evaluation & LLM-as-a-Judge:</strong> Chuyển sang chấm bằng LLM Judge hoặc bổ sung bộ nhận diện câu từ chối an toàn để không phạt lầm các câu hỏi Prompt Injection (A01, A02). Dự kiến nâng Pass Rate tổng thể từ 55% lên &gt;75%.
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-pale-beige)', borderRadius: '6px' }}>
            <strong>2. Chuẩn hóa Refusal System Prompt & Few-shot Guidance:</strong> Cung cấp vài ví dụ mẫu hướng dẫn LLM cách giải quyết câu hỏi bẫy (False Premise): đính chính thông tin không tồn tại trước, sau đó dẫn chiếu quy định thật (A03).
          </div>
          <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-pale-beige)', borderRadius: '6px' }}>
            <strong>3. Tinh chỉnh BM25 Top-K từ 5 lên 7:</strong> Tăng số lượng chunks truy xuất ban đầu để đảm bảo bao phủ 100% bằng chứng cho các câu hỏi quy trình nhiều bước phức tạp.
          </div>
        </div>
      </div>

    </div>
  );
};
