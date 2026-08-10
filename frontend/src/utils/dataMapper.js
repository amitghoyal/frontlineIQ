/**
 * Normalizes MongoDB TriageResult records for React components
 */
export function mapTriageRecord(record) {
  if (!record) return null;

  return {
    id: record._id || record.message_id || 'm-raw',
    message_id: record.message_id || record._id,
    message: record.message || '',
    category: record.category || 'unclear',
    priority: record.priority ?? 5,
    confidence: record.confidence ?? 0.85,
    needs_human: Boolean(record.needs_human),
    summary: record.summary || 'No summary available.',
    suggested_action: record.suggested_action || 'No action specified.',
    test_group: record.test_group || 'production',
    createdAt: record.createdAt || record.created_at || new Date().toISOString(),
    
    // Schema normalizations
    latency: record.latency_ms ?? record.latency ?? 0,
    prompt_tokens: record.usage?.input_tokens ?? record.prompt_tokens ?? 0,
    completion_tokens: record.usage?.output_tokens ?? record.completion_tokens ?? 0,
    total_tokens: record.usage?.total_tokens ?? (
      (record.usage?.input_tokens || 0) + (record.usage?.output_tokens || 0)
    )
  };
}

export function mapTriageRecords(records = []) {
  return Array.isArray(records) ? records.map(mapTriageRecord) : [];
}