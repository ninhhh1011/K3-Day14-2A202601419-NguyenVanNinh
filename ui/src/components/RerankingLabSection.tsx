import React, { useState } from 'react';
import type { RerankingLabData } from '../types';
import { ArrowUpDown, CheckCircle, Zap } from 'lucide-react';

interface RerankingProps {
  data: RerankingLabData;
}

export const RerankingLabSection: React.FC<RerankingProps> = ({ data }) => {
  const [selectedTraceId, setSelectedTraceId] = useState<string>(data.traces[0]?.id || 'M06');

  const selectedTrace = data.traces.find((t) => t.id === selectedTraceId) || data.traces[0];

  const formatScore = (val: number) => val.toFixed(3);
  const formatDelta = (val: number) => (val >= 0 ? `+${val.toFixed(3)}` : val.toFixed(3));

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
              <ArrowUpDown size={24} color="var(--color-heritage-gold)" /> Exercise 3.5 — Lexical Reranking Lab
            </h2>
            <p style={{ color: 'var(--color-warm-taupe)', fontSize: '14px' }}>
              Thử nghiệm sắp xếp lại các chunks bằng thuật toán Lexical Overlap (`rerank_by_overlap`) để cải thiện Context Precision mà không làm thay đổi tập hợp chunks.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              color: 'var(--color-success-green)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle size={14} /> Chunk Multiset Unchanged
            </span>
            <span style={{
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              color: 'var(--color-success-green)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle size={14} /> Context Recall Unchanged
            </span>
          </div>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-light-gray)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)' }}>Avg Precision Before</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-warm-taupe)' }}>
            {formatScore(data.avg_precision_before)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)' }}>Xếp hạng ban đầu của BM25</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-light-gray)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)' }}>Avg Precision After</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-success-green)' }}>
            {formatScore(data.avg_precision_after)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-success-green)' }}>Sau khi Rerank theo overlap</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-light-gray)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)' }}>Avg Delta Precision</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-heritage-gold)' }}>
            {formatDelta(data.avg_delta_precision)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-heritage-gold)' }}>Mức tăng độ chính xác vị trí</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-light-gray)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)' }}>Avg Context Recall</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-deep-slate)' }}>
            {formatScore(data.avg_recall_after)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)' }}>Giữ nguyên 100% (Delta = 0.000)</div>
        </div>
      </div>

      {/* Trace Selector Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary-dark)', marginRight: '4px' }}>Chọn Trace:</span>
        {data.traces.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTraceId(t.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              border: selectedTraceId === t.id ? '1px solid var(--color-heritage-gold)' : '1px solid var(--color-light-gray)',
              backgroundColor: selectedTraceId === t.id ? 'rgba(155, 122, 58, 0.15)' : '#FFFFFF',
              color: selectedTraceId === t.id ? 'var(--color-earthy-brown)' : 'var(--color-primary-dark)',
              fontWeight: selectedTraceId === t.id ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Case {t.id} ({t.difficulty}) {t.delta_precision > 0 && `(+${t.delta_precision.toFixed(3)})`}
          </button>
        ))}
      </div>

      {/* Selected Trace Visual Diff */}
      {selectedTrace && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-card)',
          padding: '24px',
          border: '1px solid var(--color-light-gray)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Question info */}
          <div style={{ backgroundColor: 'var(--color-pale-beige)', padding: '14px 18px', borderRadius: '6px', borderLeft: '4px solid var(--color-heritage-gold)' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)', fontWeight: 600 }}>CÂU HỎI TRUY VẤN (QUERY)</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-primary-dark)' }}>{selectedTrace.question}</div>
          </div>

          {/* Trace metrics bar */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '12px 16px', backgroundColor: '#F8F9FA', borderRadius: '6px', fontSize: '13px' }}>
            <div><span style={{ color: 'var(--color-warm-taupe)' }}>Precision Before:</span> <strong>{formatScore(selectedTrace.precision_before)}</strong></div>
            <div><span style={{ color: 'var(--color-warm-taupe)' }}>Precision After:</span> <strong style={{ color: 'var(--color-success-green)' }}>{formatScore(selectedTrace.precision_after)}</strong></div>
            <div><span style={{ color: 'var(--color-warm-taupe)' }}>Delta Precision:</span> <strong style={{ color: 'var(--color-heritage-gold)' }}>{formatDelta(selectedTrace.delta_precision)}</strong></div>
            <div><span style={{ color: 'var(--color-warm-taupe)' }}>Recall Before/After:</span> <strong>{formatScore(selectedTrace.recall_before)} → {formatScore(selectedTrace.recall_after)}</strong></div>
          </div>

          {/* Side by side ranking comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Before Rerank */}
            <div style={{ backgroundColor: '#FAF8F5', padding: '16px', borderRadius: '6px', border: '1px solid var(--color-light-gray)' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--color-warm-taupe)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Thứ tự Ban đầu (BM25 Ranking)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedTrace.retrieved_chunks_before.map((chunk, idx) => (
                  <div key={idx} style={{ padding: '10px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--color-light-gray)', fontSize: '12px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-warm-taupe)', marginRight: '6px' }}>#{idx + 1}:</span>
                    {chunk}
                  </div>
                ))}
              </div>
            </div>

            {/* After Rerank */}
            <div style={{ backgroundColor: '#F4F7F6', padding: '16px', borderRadius: '6px', border: '1px solid rgba(46, 125, 50, 0.3)' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '12px', color: 'var(--color-success-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={15} /> Thứ tự Sau khi Rerank (Lexical Overlap Reranked)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedTrace.reranked_chunks_after.map((chunk, idx) => (
                  <div key={idx} style={{ padding: '10px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid rgba(46, 125, 50, 0.2)', fontSize: '12px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-success-green)', marginRight: '6px' }}>#{idx + 1}:</span>
                    {chunk}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theoretical Explanation Card */}
      <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-light-gray)' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Giải thích Kết quả Reranking</h3>
        <p style={{ fontSize: '14px', color: 'var(--color-warm-taupe)', marginBottom: '8px' }}>
          • <strong>Vì sao Context Recall không thay đổi?</strong> Vì `rerank_by_overlap()` chỉ sắp xếp lại vị trí hiển thị (ranking) mà không thêm/xóa chunk. Tỷ lệ phủ bằng chứng `Context Recall` tính trên tập hợp hợp (Union) nên giữ nguyên 100%.
        </p>
        <p style={{ fontSize: '14px', color: 'var(--color-warm-taupe)' }}>
          • <strong>Khi nào Lexical Reranking không đủ?</strong> Khi Retriever ban đầu bị sót bằng chứng (Recall thấp) hoặc khi truy vấn sử dụng từ đồng nghĩa/ngữ nghĩa ẩn khác từ khóa nguyên văn. Trường hợp này cần nâng cấp sang Semantic Reranking (Cross-Encoder / Cohere API).
        </p>
      </div>
    </div>
  );
};
