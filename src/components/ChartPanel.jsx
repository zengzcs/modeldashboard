import { Card, CardContent, Typography, Box } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { useMetricsStore } from '../store/useMetricsStore';

function makeOption(title, seriesKey, color) {
  return (snapshots) => {
    const data = snapshots.map(s => [s.ts, s[seriesKey] || 0]);
    return {
      title: { text: title, left: 'center', textStyle: { color: '#e6f7ff', fontSize: 14 } },
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(12,20,32,0.9)', borderColor: '#00e5ff', textStyle: { color: '#e6f7ff' } },
      grid: { left: 50, right: 20, top: 40, bottom: 30 },
      xAxis: { type: 'time', axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#9bb7d4' } },
      yAxis: { type: 'value', axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#9bb7d4' } },
      series: [{ data, type: 'line', smooth: true, showSymbol: false, lineStyle: { color }, areaStyle: { opacity: 0.2, color } }]
    };
  };
}

export default function ChartPanel() {
  const snapshots = useMetricsStore(s => s.snapshots);
  const prefillOpt = makeOption('Prefill TPS 瞬时', 'instant_prefill_tps', '#00e5ff')(snapshots);
  const decodeOpt = makeOption('Decode TPS 瞬时', 'instant_decode_tps', '#ff4081')(snapshots);
  const prefillCumOpt = makeOption('Prefill 累计 Token', 'prefill_cumulative_tokens', '#00e5ff')(snapshots);
  const decodeCumOpt = makeOption('Decode 累计 Token', 'decode_cumulative_tokens', '#ff4081')(snapshots);
  const cacheOpt = makeOption('Speculative Cache Hit Rate % 瞬时', 'instant_cache_accept_rate_percent', '#7c4dff')(snapshots);
  const specAcceptedOpt = makeOption('Spec Accepted Tokens 累计', 'spec_decode_num_accepted_tokens_total', '#ff9800')(snapshots);
  const specDraftOpt = makeOption('Spec Draft Tokens 累计', 'spec_decode_num_draft_tokens_total', '#ff9800')(snapshots);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
      <Card><CardContent sx={{ height: 320 }}><ReactECharts option={prefillOpt} /></CardContent></Card>
      <Card><CardContent sx={{ height: 320 }}><ReactECharts option={decodeOpt} /></CardContent></Card>
      <Card><CardContent sx={{ height: 320 }}><ReactECharts option={prefillCumOpt} /></CardContent></Card>
      <Card><CardContent sx={{ height: 320 }}><ReactECharts option={decodeCumOpt} /></CardContent></Card>
      <Card><CardContent sx={{ height: 320 }}><ReactECharts option={cacheOpt} /></CardContent></Card>
      <Card><CardContent sx={{ height: 320 }}><ReactECharts option={specAcceptedOpt} /></CardContent></Card>
      <Card><CardContent sx={{ height: 320 }}><ReactECharts option={specDraftOpt} /></CardContent></Card>
    </Box>
  );
}
