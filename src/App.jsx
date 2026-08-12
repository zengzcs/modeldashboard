import { useEffect, useRef } from 'react';
import { ThemeProvider, CssBaseline, Container, Typography, Paper, Box, Alert } from '@mui/material';
import { darkTheme } from './styles/theme';
import { useMetricsStore } from './store/useMetricsStore';
import MetricsCard from './components/MetricsCard';
import ChartPanel from './components/ChartPanel';
import { parsePrometheus, buildSnapshot } from './utils/parseMetrics';

export default function App() {
  const latest = useMetricsStore(s => s.latest);
  const status = useMetricsStore(s => s.status);
  const error = useMetricsStore(s => s.error);
  const addSnapshot = useMetricsStore(s => s.addSnapshot);
  const setStatus = useMetricsStore(s => s.setStatus);
  const setError = useMetricsStore(s => s.setError);
  const prevRef = useRef(null);

  useEffect(() => {
    setStatus('connecting');
    const poll = async () => {
      try {
        const res = await fetch('/metrics');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const raw = parsePrometheus(text);
        const prev = prevRef.current;
        const snap = buildSnapshot(raw, prev);
        prevRef.current = snap;
        addSnapshot(snap);
        setStatus('ok');
        setError(null);
      } catch (e) {
        setStatus('error');
        setError(e.message);
      }
    };
    poll();
    const id = setInterval(poll, 2000);
    return () => clearInterval(id);
  }, [addSnapshot, setStatus, setError]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', background: 'radial-gradient(1200px 600px at 80% -10%, rgba(0,229,255,0.15), transparent), radial-gradient(800px 400px at -10% 100%, rgba(255,64,129,0.15), transparent)', backgroundColor: '#050a14' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Paper sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(90deg,#00e5ff,#ff4081)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Llama.cpp 实时监控台
              </Typography>
              <Typography variant="body2" color="text.secondary">192.168.1.100:8080/metrics • 内存缓存 1h • 每 2s 刷新</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span className={`pulse`} style={{ width: 10, height: 10, borderRadius: '50%', background: status==='ok'?'#00e5ff': status==='error'?'#ff4081':'#ffb300', display: 'inline-block' }} />
                {status.toUpperCase()}
              </Typography>
            </Box>
          </Paper>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <MetricsCard latest={latest} />
          <Box sx={{ mt: 3 }}>
            <ChartPanel />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 4, textAlign: 'center' }}>
            Prefill = Prompt 阶段, Decode = Predict 阶段 • 数据仅保存在内存，刷新后丢失
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
