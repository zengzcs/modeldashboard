import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#050a14',
      paper: 'rgba(12, 20, 32, 0.7)',
    },
    text: {
      primary: '#e6f7ff',
      secondary: '#9bb7d4',
    },
  },
  typography: {
    fontFamily: `'Noto Sans SC', 'JetBrains Mono', system-ui, sans-serif`,
    h4: { fontWeight: 700, letterSpacing: '0.02em' },
    h6: { fontWeight: 600 },
    body2: { fontFamily: `'JetBrains Mono', monospace` }
  },
  shape: { borderRadius: 16 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,229,255,0.15)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          overflow: 'hidden',
        }
      }
    }
  }
});

// keyframes injection
const style = document.createElement('style');
style.innerHTML = `
.glass { backdrop-filter: blur(12px); }
.pulse { animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.6 } }
`;
document.head.appendChild(style);
