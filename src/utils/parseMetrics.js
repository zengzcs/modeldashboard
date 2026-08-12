export function parsePrometheus(text) {
  const data = {};
  const lines = text.split('\n');
  for (const line of lines) {
    if (!line || line.startsWith('#')) continue;
    const [key, value] = line.trim().split(/\s+/);
    if (!key || value === undefined) continue;
    // strip labels
    const cleanKey = key.split('{')[0];
    const num = parseFloat(value);
    if (!isNaN(num)) {
      data[cleanKey] = num;
    }
  }
  return data;
}

export function buildSnapshot(raw, prev) {
  const ts = Date.now();
  const snap = {
    ts,
    prompt_tokens_total: raw['llamacpp:prompt_tokens_total'] ?? 0,
    prompt_seconds_total: raw['llamacpp:prompt_seconds_total'] ?? 0,
    tokens_predicted_total: raw['llamacpp:tokens_predicted_total'] ?? 0,
    tokens_predicted_seconds_total: raw['llamacpp:tokens_predicted_seconds_total'] ?? 0,
    n_decode_total: raw['llamacpp:n_decode_total'] ?? 0,
    n_tokens_max: raw['llamacpp:n_tokens_max'] ?? 0,
    prompt_tokens_seconds: raw['llamacpp:prompt_tokens_seconds'] ?? 0,
    predicted_tokens_seconds: raw['llamacpp:predicted_tokens_seconds'] ?? 0,
    requests_processing: raw['llamacpp:requests_processing'] ?? 0,
    requests_deferred: raw['llamacpp:requests_deferred'] ?? 0,
    n_busy_slots_per_decode: raw['llamacpp:n_busy_slots_per_decode'] ?? 0,
    spec_decode_num_draft_tokens_total: raw['llamacpp:spec_decode_num_draft_tokens_total'] ?? 0,
    spec_decode_num_accepted_tokens_total: raw['llamacpp:spec_decode_num_accepted_tokens_total'] ?? 0,
    spec_decode_num_drafts_total: raw['llamacpp:spec_decode_num_drafts_total'] ?? 0,
  };
  // cumulative aliases
  snap.prefill_cumulative_tokens = snap.prompt_tokens_total;
  snap.decode_cumulative_tokens = snap.tokens_predicted_total;

  // derived
  snap.prefill_tps = snap.prompt_tokens_seconds;
  snap.decode_tps = snap.predicted_tokens_seconds;
  snap.avg_prefill_latency_ms = snap.prompt_tokens_total > 0 ? (snap.prompt_seconds_total / snap.prompt_tokens_total) * 1000 : 0;
  snap.avg_decode_latency_ms = snap.tokens_predicted_total > 0 ? (snap.tokens_predicted_seconds_total / snap.tokens_predicted_total) * 1000 : 0;

  // cache hit rate from speculative decoding
  const draft = snap.spec_decode_num_draft_tokens_total;
  const accepted = snap.spec_decode_num_accepted_tokens_total;
  snap.cache_hit_rate = draft > 0 ? accepted / draft : 0;
  snap.cache_accept_rate_percent = snap.cache_hit_rate * 100;
  
  if (prev) {
    const dt = (ts - prev.ts) / 1000;
    if (dt > 0) {
      snap.delta_prompt_tokens = snap.prompt_tokens_total - prev.prompt_tokens_total;
      snap.delta_predicted_tokens = snap.tokens_predicted_total - prev.tokens_predicted_total;
      snap.instant_prefill_tps = snap.delta_prompt_tokens / dt;
      snap.instant_decode_tps = snap.delta_predicted_tokens / dt;
      
      const deltaDraft = snap.spec_decode_num_draft_tokens_total - (prev.spec_decode_num_draft_tokens_total || 0);
      const deltaAccepted = snap.spec_decode_num_accepted_tokens_total - (prev.spec_decode_num_accepted_tokens_total || 0);
      snap.instant_cache_hit_rate = deltaDraft > 0 ? deltaAccepted / deltaDraft : 0;
      snap.instant_cache_accept_rate_percent = snap.instant_cache_hit_rate * 100;
    }
  }

  return snap;
}
