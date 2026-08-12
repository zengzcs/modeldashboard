# Llama.cpp 实时监控台

纯前端 React + MUI + ECharts + Zustand

- 监控指标: Prefill/Decode TPS, 延迟, Token 累计, 请求状态, Spec Decode
- 内存数据库缓存最近 1 小时数据, Zustand store 管理
- 每 2s Poll `http://192.168.1.100:8080/metrics` Prometheus 格式
- 炫酷暗色玻璃拟态风格

## 运行
```bash
npm install
npm run dev
```

Vite 代理 `/metrics` 到 192.168.1.100:8080
