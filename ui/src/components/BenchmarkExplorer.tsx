import React, { useState, useMemo } from 'react';
import type { QACase } from '../types';
import { Search, Filter, ArrowUpDown, CheckCircle, XCircle, Eye } from 'lucide-react';

interface ExplorerProps {
  cases: QACase[];
  onSelectCase: (qaCase: QACase) => void;
}

export const BenchmarkExplorer: React.FC<ExplorerProps> = ({ cases, onSelectCase }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [failureTypeFilter, setFailureTypeFilter] = useState('all');
  const [sortField, setSortField] = useState<'id' | 'overall' | 'faithfulness' | 'relevance' | 'completeness' | 'context_recall' | 'context_precision'>('overall');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.actual_answer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDiff = difficultyFilter === 'all' || c.difficulty === difficultyFilter;
      const matchStatus = statusFilter === 'all' || (statusFilter === 'passed' ? c.passed : !c.passed);
      const matchFailure = failureTypeFilter === 'all' || c.failure_type === failureTypeFilter;

      return matchSearch && matchDiff && matchStatus && matchFailure;
    }).sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortField === 'id') {
        valA = a.id;
        valB = b.id;
      } else {
        valA = a.scores[sortField] ?? -1;
        valB = b.scores[sortField] ?? -1;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [cases, searchTerm, difficultyFilter, statusFilter, failureTypeFilter, sortField, sortDirection]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatScore = (val: number | null) => (val !== null ? val.toFixed(3) : 'N/A');

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Search & Filter Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        padding: '20px 24px',
        border: '1px solid var(--color-light-gray)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '280px', flex: 1 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} color="var(--color-warm-taupe)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="Tìm theo ID, câu hỏi hoặc đáp án..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-light-gray)',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-warm-taupe)' }}>
            <Filter size={14} /> Độ khó:
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-light-gray)', fontSize: '13px' }}
            >
              <option value="all">Tất cả</option>
              <option value="easy">Easy (5)</option>
              <option value="medium">Medium (7)</option>
              <option value="hard">Hard (5)</option>
              <option value="adversarial">Adversarial (3)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-warm-taupe)' }}>
            Trạng thái:
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-light-gray)', fontSize: '13px' }}
            >
              <option value="all">Tất cả</option>
              <option value="passed">Passed (11)</option>
              <option value="failed">Failed (9)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-warm-taupe)' }}>
            Loại lỗi:
            <select
              value={failureTypeFilter}
              onChange={(e) => setFailureTypeFilter(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--color-light-gray)', fontSize: '13px' }}
            >
              <option value="all">Tất cả</option>
              <option value="off_topic">off_topic (7)</option>
              <option value="hallucination">hallucination (2)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-light-gray)',
        boxShadow: 'var(--shadow-card)',
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--color-pale-beige)', borderBottom: '1px solid var(--color-light-gray)', color: 'var(--color-primary-dark)' }}>
              <th onClick={() => toggleSort('id')} style={{ padding: '12px 16px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                ID <ArrowUpDown size={12} style={{ inlineSize: '12px', verticalAlign: 'middle' }} />
              </th>
              <th style={{ padding: '12px 16px' }}>Question</th>
              <th style={{ padding: '12px 16px' }}>Diff</th>
              <th onClick={() => toggleSort('context_recall')} style={{ padding: '12px 12px', textAlign: 'right', cursor: 'pointer' }}>Recall</th>
              <th onClick={() => toggleSort('context_precision')} style={{ padding: '12px 12px', textAlign: 'right', cursor: 'pointer' }}>Precision</th>
              <th onClick={() => toggleSort('faithfulness')} style={{ padding: '12px 12px', textAlign: 'right', cursor: 'pointer' }}>Faith</th>
              <th onClick={() => toggleSort('relevance')} style={{ padding: '12px 12px', textAlign: 'right', cursor: 'pointer' }}>Relev</th>
              <th onClick={() => toggleSort('completeness')} style={{ padding: '12px 12px', textAlign: 'right', cursor: 'pointer' }}>Comp</th>
              <th onClick={() => toggleSort('overall')} style={{ padding: '12px 12px', textAlign: 'right', cursor: 'pointer' }}>Overall</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.15s' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-deep-slate)' }}>
                  {c.id}
                </td>
                <td style={{ padding: '12px 16px', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.question}
                </td>
                <td style={{ padding: '12px 16px', textTransform: 'capitalize' }}>
                  <span style={{
                    backgroundColor: c.difficulty === 'easy' ? 'rgba(46, 125, 50, 0.1)' : c.difficulty === 'medium' ? 'rgba(155, 122, 58, 0.1)' : c.difficulty === 'hard' ? 'rgba(111, 88, 48, 0.15)' : 'rgba(185, 77, 53, 0.15)',
                    color: c.difficulty === 'easy' ? 'var(--color-success-green)' : c.difficulty === 'medium' ? 'var(--color-heritage-gold)' : c.difficulty === 'hard' ? 'var(--color-earthy-brown)' : 'var(--color-error-red)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '11px',
                    fontWeight: 600
                  }}>
                    {c.difficulty}
                  </span>
                </td>
                <td style={{ padding: '12px 12px', textAlign: 'right' }}>{formatScore(c.scores.context_recall)}</td>
                <td style={{ padding: '12px 12px', textAlign: 'right' }}>{formatScore(c.scores.context_precision)}</td>
                <td style={{ padding: '12px 12px', textAlign: 'right' }}>{formatScore(c.scores.faithfulness)}</td>
                <td style={{ padding: '12px 12px', textAlign: 'right' }}>{formatScore(c.scores.relevance)}</td>
                <td style={{ padding: '12px 12px', textAlign: 'right' }}>{formatScore(c.scores.completeness)}</td>
                <td style={{ padding: '12px 12px', textAlign: 'right', fontWeight: 700, color: c.passed ? 'var(--color-success-green)' : 'var(--color-error-red)' }}>
                  {formatScore(c.scores.overall)}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  {c.passed ? (
                    <span style={{ color: 'var(--color-success-green)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
                      <CheckCircle size={14} /> Passed
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-error-red)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
                      <XCircle size={14} /> {c.failure_type}
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => onSelectCase(c)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid var(--color-muted-border)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '4px 10px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--color-primary-dark)'
                    }}
                  >
                    <Eye size={13} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCases.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-warm-taupe)' }}>
            Không tìm thấy test case khớp với bộ lọc.
          </div>
        )}
      </div>
    </div>
  );
};
