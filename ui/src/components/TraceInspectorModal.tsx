import React from 'react';
import type { QACase } from '../types';
import { X, CheckCircle, AlertTriangle, Shield, Sparkles, BookOpen } from 'lucide-react';

interface ModalProps {
  qaCase: QACase | null;
  onClose: () => void;
}

export const TraceInspectorModal: React.FC<ModalProps> = ({ qaCase, onClose }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!qaCase) return null;

  const formatScore = (val: number | null) => (val !== null ? val.toFixed(3) : 'N/A');

  const auditNote = typeof qaCase.human_analysis === 'object' && qaCase.human_analysis !== null
    ? qaCase.human_analysis
    : { analysis_source: 'manual_audit', analysis_status: 'reviewed', note: String(qaCase.human_analysis) };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(7, 23, 28, 0.75)',
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-overlay)',
        border: '1px solid var(--color-muted-border)',
        display: 'flex',
        flexDirection: 'column'
      }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: '20px 28px',
          backgroundColor: 'var(--color-primary-dark)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--color-soft-gold)'
            }}>
              Trace Inspector — Case {qaCase.id}
            </span>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '2px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              textTransform: 'uppercase'
            }}>
              {qaCase.difficulty}
            </span>
            {qaCase.attack_type && (
              <span style={{
                backgroundColor: 'rgba(185, 77, 53, 0.3)',
                color: '#FF8A75',
                padding: '2px 10px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Shield size={12} /> {qaCase.attack_type}
              </span>
            )}
          </div>

          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            cursor: 'pointer',
            padding: '4px'
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Question Card */}
          <div style={{ backgroundColor: 'var(--color-pale-beige)', padding: '16px 20px', borderRadius: '6px', borderLeft: '4px solid var(--color-heritage-gold)' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
              Question (Câu hỏi sinh viên)
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
              {qaCase.question}
            </div>
          </div>

          {/* Scores Overview Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', padding: '16px', backgroundColor: '#F8F9FA', borderRadius: '6px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-warm-taupe)' }}>Overall Score</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: qaCase.passed ? 'var(--color-success-green)' : 'var(--color-error-red)' }}>
                {formatScore(qaCase.scores.overall)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-warm-taupe)' }}>Faithfulness</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatScore(qaCase.scores.faithfulness)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-warm-taupe)' }}>Relevance</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatScore(qaCase.scores.relevance)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-warm-taupe)' }}>Completeness</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatScore(qaCase.scores.completeness)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-warm-taupe)' }}>Context Recall</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatScore(qaCase.scores.context_recall)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-warm-taupe)' }}>Context Precision</div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>{formatScore(qaCase.scores.context_precision)}</div>
            </div>
          </div>

          {/* Actual Answer vs Expected Answer Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Expected Answer */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '6px', border: '1px solid var(--color-light-gray)' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} color="var(--color-success-green)" /> Expected Answer (Ground Truth)
              </div>
              <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', color: 'var(--color-primary-dark)' }}>
                {qaCase.expected_answer}
              </p>
            </div>

            {/* Actual Answer */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '6px', border: '1px solid var(--color-light-gray)' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-warm-taupe)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} color="var(--color-heritage-gold)" /> Actual Answer (RAG Generator)
              </div>
              <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', color: 'var(--color-primary-dark)' }}>
                {qaCase.actual_answer}
              </p>
            </div>
          </div>

          {/* Human Analyst Note vs Evaluator Result */}
          <div style={{
            backgroundColor: 'rgba(36, 56, 60, 0.05)',
            border: '1px solid var(--color-deep-slate)',
            padding: '16px',
            borderRadius: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-deep-slate)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={15} color="var(--color-warning-gold)" /> Human Audit Note (Manual Expert Review)
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '11px', backgroundColor: 'var(--color-pale-beige)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--color-muted-border)' }}>
                  Source: {auditNote.analysis_source}
                </span>
                <span style={{ fontSize: '11px', backgroundColor: 'rgba(46, 125, 50, 0.1)', color: 'var(--color-success-green)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Status: {auditNote.analysis_status}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-primary-dark)' }}>
              {auditNote.note}
            </p>
          </div>

          {/* Retrieved Chunks */}
          <div>
            <h4 style={{ fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} color="var(--color-heritage-gold)" /> Retrieved Chunks ({qaCase.retrieved_contexts.length} chunks)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
              {qaCase.retrieved_contexts.map((chunk, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#F8F9FA',
                  padding: '10px 14px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-light-gray)',
                  fontSize: '13px'
                }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-heritage-gold)', marginRight: '8px' }}>
                    Rank #{idx + 1}:
                  </span>
                  {chunk}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
