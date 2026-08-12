export interface ScoreSet {
  faithfulness: number;
  relevance: number;
  completeness: number;
  context_recall: number | null;
  context_precision: number | null;
  overall: number;
}

export interface GoldContext {
  source_doc: string;
  text: string;
}

export interface HumanAuditEntry {
  analysis_source: string;
  analysis_status: string;
  note: string;
}

export interface QACase {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'adversarial';
  question: string;
  expected_answer: string;
  gold_contexts: GoldContext[];
  actual_answer: string;
  retrieved_contexts: string[];
  scores: ScoreSet;
  passed: boolean;
  failure_type: string | null;
  attack_type: string | null;
  human_analysis: HumanAuditEntry;
}

export interface RerankingTrace {
  id: string;
  difficulty: string;
  question: string;
  expected_answer: string;
  recall_before: number;
  recall_after: number;
  precision_before: number;
  precision_after: number;
  delta_precision: number;
  multiset_equal: boolean;
  recall_equal: boolean;
  retrieved_chunks_before: string[];
  reranked_chunks_after: string[];
}

export interface RerankingLabData {
  traces: RerankingTrace[];
  avg_recall_before: number;
  avg_recall_after: number;
  avg_precision_before: number;
  avg_precision_after: number;
  avg_delta_precision: number;
}

export interface FrameworkTableRow {
  criterion: string;
  ragas: string;
  deepeval: string;
}

export interface Hypothesis {
  title: string;
  detail: string;
}

export interface FrameworkComparisonData {
  mode: string;
  reason: string;
  frameworks: string[];
  table: FrameworkTableRow[];
  hypotheses: Hypothesis[];
}

export interface FailureCluster {
  name: string;
  count: number;
  priority: string;
  ids: string[];
}

export interface WorstCase {
  id: string;
  score: number;
  failure_type: string;
  reason: string;
}

export interface FailureAnalysisData {
  worst_3_cases: WorstCase[];
  clusters: FailureCluster[];
}

export interface DashboardMetaData {
  title: string;
  subtitle: string;
  notice: string;
  data_provenance: string;
  required_scope: string;
  bonus_scope: string;
  test_status: string;
  dataset_status: string;
  total_cases: number;
  total_docs: number;
  pass_rate: number;
  passed_count: number;
  failed_count: number;
  avg_metrics: ScoreSet;
  difficulty_distribution: Record<string, number>;
  failure_distribution: Record<string, number>;
}

export interface DashboardData {
  meta: DashboardMetaData;
  cases: QACase[];
  reranking_lab: RerankingLabData;
  framework_comparison: FrameworkComparisonData;
  failure_analysis: FailureAnalysisData;
}
