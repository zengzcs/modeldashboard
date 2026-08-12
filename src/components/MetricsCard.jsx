import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Speed, Memory, Timer, TrendingUp, Storage } from '@mui/icons-material';

const Metric = ({ icon: Icon, label, value, unit, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Icon sx={{ color, fontSize: 28, opacity: 0.9 }} />
    <Box>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="h6" sx={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
        {value.toLocaleString()} <span style={{ opacity: 0.6, fontSize: '0.8em' }}>{unit}</span>
      </Typography>
    </Box>
  </Box>
);

export default function MetricsCard({ latest }) {
  if (!latest) return null;
  return (
    <Card sx={{ p: 1 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" /> 实时核心指标
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          <Metric icon={Speed} label="Prefill 吞吐" value={latest.instant_prefill_tps ?? latest.prefill_tps ?? 0} unit="tok/s" color="#00e5ff" />
          <Metric icon={Memory} label="Decode 吞吐" value={latest.instant_decode_tps ?? latest.decode_tps ?? 0} unit="tok/s" color="#ff4081" />
          <Metric icon={Timer} label="Avg Prefill 延迟" value={latest.avg_prefill_latency_ms.toFixed(2)} unit="ms/tok" color="#7c4dff" />
          <Metric icon={Timer} label="Avg Decode 延迟" value={latest.avg_decode_latency_ms.toFixed(2)} unit="ms/tok" color="#00bfa5" />
          <Metric icon={Storage} label="Prefill 累计 Token" value={latest.prefill_cumulative_tokens || 0} unit="tok" color="#00e5ff" />
          <Metric icon={Storage} label="Decode 累计 Token" value={latest.decode_cumulative_tokens || 0} unit="tok" color="#ff4081" />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={`处理中: ${latest.requests_processing}`} color="primary" size="small" />
          <Chip label={`排队: ${latest.requests_deferred}`} color="secondary" size="small" />
          <Chip label={`Busy Slots: ${latest.n_busy_slots_per_decode}`} size="small" />
          <Chip label={`Cache Hit: ${(latest.instant_cache_accept_rate_percent ?? latest.cache_accept_rate_percent ?? 0).toFixed(1)}%`} sx={{ background: 'linear-gradient(90deg, rgba(0,229,255,0.2), rgba(255,64,129,0.2))' }} size="small" />
          <Chip label={`Spec Draft: ${latest.spec_decode_num_draft_tokens_total || 0}`} size="small" />
          <Chip label={`Spec Accepted: ${latest.spec_decode_num_accepted_tokens_total || 0}`} size="small" />
          <Chip label={`Spec Draft Steps: ${latest.spec_decode_num_drafts_total || 0}`} size="small" />
        </Box>
      </CardContent>
    </Card>
  );
}
