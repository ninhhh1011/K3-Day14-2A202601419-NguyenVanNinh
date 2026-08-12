"""Canonical artifact generator & evaluator script.

Generates:
1. artifacts/actual_answers.json
2. artifacts/benchmark_results.json
3. ui/public/data/dashboard-data.json (via sync)

Embeds full provenance metadata:
- Corpus SHA-256 (64 hex characters)
- Golden Dataset SHA-256 (64 hex characters)
- Git HEAD commit
- working_tree_dirty status
- Source files hash
- prompt_version
- evaluator_version
- model_id and snapshot status
- UTC generated_at timestamp
- generator_parameters
- dataset size and ordered IDs
"""

import json
import os
import sys
import glob
import hashlib
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent

def get_git_info():
    try:
        git_head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT_DIR, text=True).strip()
    except Exception:
        git_head = 'unknown'

    try:
        status_output = subprocess.check_output(['git', 'status', '--porcelain'], cwd=ROOT_DIR, text=True).strip()
        is_dirty = bool(status_output)
    except Exception:
        is_dirty = True

    return git_head, is_dirty

def compute_corpus_hash():
    corpus_files = sorted(glob.glob(str(ROOT_DIR / 'data' / 'student_services' / '*.*')))
    hasher = hashlib.sha256()
    for file_path in corpus_files:
        with open(file_path, 'rb') as f:
            hasher.update(f.read())
    return hasher.hexdigest()

def compute_file_hash(relative_path):
    file_path = ROOT_DIR / relative_path
    if not file_path.exists():
        return 'file_not_found'
    hasher = hashlib.sha256()
    with open(file_path, 'rb') as f:
        hasher.update(f.read())
    return hasher.hexdigest()

def get_provenance_metadata():
    git_head, is_dirty = get_git_info()
    corpus_sha = compute_corpus_hash()
    golden_sha = compute_file_hash('golden_dataset.json')
    domain_assistant_sha = compute_file_hash('domain_assistant.py')
    template_sha = compute_file_hash('template.py')

    source_files_hasher = hashlib.sha256()
    source_files_hasher.update(domain_assistant_sha.encode('utf-8'))
    source_files_hasher.update(template_sha.encode('utf-8'))
    source_files_hash = source_files_hasher.hexdigest()

    model = os.getenv('OPENAI_MODEL', 'gpt-4o-mini').strip()

    return {
        'corpus_sha256': corpus_sha,
        'golden_dataset_sha256': golden_sha,
        'git_head': git_head,
        'working_tree_dirty': is_dirty,
        'source_files_hash': source_files_hash,
        'prompt_version': '1.0-hardened-isolated',
        'evaluator_version': '1.0-error-aware',
        'model_id': model,
        'model_snapshot_status': 'snapshot_not_pinned',
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'generator_parameters': {
            'temperature': 0,
            'max_output_tokens': 300,
            'top_k': 5
        },
        'dataset_size': 20,
        'ordered_ids': [
            'E01', 'E02', 'E03', 'E04', 'E05',
            'M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07',
            'H01', 'H02', 'H03', 'H04', 'H05',
            'A01', 'A02', 'A03'
        ]
    }

def generate_actual_answers(assistant, questions, provenance):
    print(f"Generating actual answers for {len(questions)} QA pairs...")
    answers = []
    for idx, q_item in enumerate(questions, start=1):
        qa_id = q_item['id']
        question_text = q_item['question']
        print(f"[{idx:02d}/{len(questions):02d}] Generating response for {qa_id}...")

        trace = assistant.answer_with_trace(question_text)
        retrieved_contexts = [
            {
                'chunk_id': c.chunk_id,
                'doc_id': '-'.join(c.chunk_id.split('-')[:2]) if c.chunk_id.startswith('NU-') else c.chunk_id.split('-')[0],
                'source': c.source_doc,
                'title': c.title,
                'text': c.text,
                'rank': rank + 1,
                'score': c.score
            }
            for rank, c in enumerate(trace.retrieved_chunks)
        ]

        answers.append({
            'id': qa_id,
            'question': question_text,
            'actual_answer': trace.actual_answer,
            'retrieved_contexts': retrieved_contexts
        })

    actual_artifact = {
        'provenance': provenance,
        'answers': answers
    }

    os.makedirs(ROOT_DIR / 'artifacts', exist_ok=True)
    actual_path = ROOT_DIR / 'artifacts' / 'actual_answers.json'
    with open(actual_path, 'w', encoding='utf-8') as f:
        json.dump(actual_artifact, f, ensure_ascii=False, indent=2)
    print(f"Saved actual answers to {actual_path}")
    return actual_artifact

def evaluate_benchmark(golden_data, actual_artifact, provenance):
    from template import RAGASEvaluator
    evaluator = RAGASEvaluator()

    golden_list = golden_data['qa_pairs']
    actual_list = actual_artifact['answers']
    actual_map = {x['id']: x for x in actual_list}

    results = []
    for g_item in golden_list:
        qa_id = g_item['id']
        a_item = actual_map[qa_id]

        question = g_item['question']
        expected = g_item['expected_answer']
        actual = a_item['actual_answer']

        gold_context_text = ' '.join(c['text'] for c in g_item['contexts'])
        retrieved_chunks = [c['text'] if isinstance(c, dict) else str(c) for c in a_item['retrieved_contexts']]

        eval_res = evaluator.run_full_eval(
            answer=actual,
            question=question,
            context=gold_context_text,
            expected=expected,
            contexts=retrieved_chunks
        )

        results.append({
            'id': qa_id,
            'difficulty': g_item['difficulty'],
            'evaluation_status': 'success',
            'error_type': None,
            'faithfulness': eval_res.faithfulness,
            'relevance': eval_res.relevance,
            'completeness': eval_res.completeness,
            'context_recall': eval_res.context_recall,
            'context_precision': eval_res.context_precision,
            'overall': eval_res.overall_score(),
            'passed': eval_res.passed,
            'failure_type': eval_res.failure_type
        })

    total = len(results)
    passed = sum(1 for r in results if r['passed'])
    pass_rate = passed / total if total > 0 else 0.0

    avg_faithfulness = sum(r['faithfulness'] for r in results) / total
    avg_relevance = sum(r['relevance'] for r in results) / total
    avg_completeness = sum(r['completeness'] for r in results) / total

    recalls = [r['context_recall'] for r in results if r['context_recall'] is not None]
    precisions = [r['context_precision'] for r in results if r['context_precision'] is not None]

    avg_recall = sum(recalls) / len(recalls) if recalls else None
    avg_precision = sum(precisions) / len(precisions) if precisions else None

    failure_types = {}
    for r in results:
        if r['failure_type']:
            failure_types[r['failure_type']] = failure_types.get(r['failure_type'], 0) + 1

    summary = {
        'total': total,
        'passed': passed,
        'pass_rate': pass_rate,
        'avg_faithfulness': avg_faithfulness,
        'avg_relevance': avg_relevance,
        'avg_completeness': avg_completeness,
        'avg_context_recall': avg_recall,
        'avg_context_precision': avg_precision,
        'failure_types': failure_types
    }

    benchmark_artifact = {
        'provenance': provenance,
        'summary': summary,
        'results': results
    }

    bench_path = ROOT_DIR / 'artifacts' / 'benchmark_results.json'
    with open(bench_path, 'w', encoding='utf-8') as f:
        json.dump(benchmark_artifact, f, ensure_ascii=False, indent=2)
    print(f"Saved benchmark results to {bench_path}")
    return benchmark_artifact

def main():
    provenance = get_provenance_metadata()
    print("--- Provenance Metadata ---")
    for k, v in provenance.items():
        print(f"  {k}: {v}")

    with open(ROOT_DIR / 'golden_dataset.json', 'r', encoding='utf-8') as f:
        golden_data = json.load(f)

    from domain_assistant import DomainAssistant
    assistant = DomainAssistant.from_corpus(ROOT_DIR / 'data' / 'student_services')

    actual_artifact = generate_actual_answers(assistant, golden_data['qa_pairs'], provenance)
    evaluate_benchmark(golden_data, actual_artifact, provenance)

    # Run UI sync
    print("\nRunning UI data sync...")
    import subprocess
    subprocess.check_call([sys.executable, 'sync_ui_data.py'], cwd=ROOT_DIR)
    print("All artifacts generated and synced successfully!")

if __name__ == '__main__':
    main()
