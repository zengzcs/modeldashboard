# Llama.cpp 实时监控台

纯前端监控面板，实时展示 llama.cpp 服务的 Prefill / Decode 性能、Token 累计与 Speculative Decoding 命中率。

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![MUI](https://img.shields.io/badge/MUI-6-007FFF?logo=mui)
![ECharts](https://img.shields.io/badge/ECharts-5-FFB100)
![Zustand](https://img.shields.io/badge/Zustand-4-FF6B6B)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

## ✨ 特性

- **实时指标**：Prefill TPS / Decode TPS 瞬时吞吐、平均延迟 ms/tok
- **累计统计**：Prefill 累计 Token、Decode 累计 Token 独立曲线
- **Speculative Decoding**：Draft / Accepted 累计、瞬时缓存命中率 % 历史曲线
- **内存时序**：Zustand 管理最近 1 小时数据，自动裁剪
- **炫酷 UI**：MUI Dark + 玻璃拟态，ECharts 流畅曲线
- **零后端**：纯前端 Poll `http://192.168.1.100:8080/metrics`，Vite 代理

## 📊 监控指标

| 指标 | 说明 |
|------|------|
| Prefill TPS | `instant_prefill_tps` 基于 `prompt_tokens_total` 差值计算 |
| Decode TPS | `instant_decode_tps` 基于 `tokens_predicted_total` 差值计算 |
| Avg Prefill/Decode 延迟 | 累计秒数 / 累计 Token |
| Prefill 累计 Token | `llamacpp:prompt_tokens_total` |
| Decode 累计 Token | `llamacpp:tokens_predicted_total` |
| Cache Hit Rate | Speculative Decoding `accepted / draft` 瞬时命中率 |
| 请求状态 | `requests_processing`, `requests_deferred`, `n_busy_slots_per_decode` |

## 🚀 快速开始

```bash
git clone https://github.com/zengzcs/modeldashboard.git
cd modeldashboard
bun install
bun run dev
```

默认监听 `http://localhost:10001`，Vite 代理 `/metrics` 到 `http://192.168.1.100:8080/metrics`

生产构建：
```bash
bun run build
bun run preview
```

## 🖥️ Systemd User 服务

已内置 user service，开机自启并从 `dist` 启动。

服务文件：`modeldashboard.service`

```ini
[Service]
WorkingDirectory=/home/zcs/gitproj/modeldashboard
ExecStartPre=/usr/bin/bun run build
ExecStart=/usr/bin/bun run preview --host 0.0.0.0 --port 10001
```

安装：
```bash
cp modeldashboard.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now modeldashboard.service
loginctl enable-linger zcs
```

## ⚙️ 配置

`vite.config.js`
- `server.port` / `preview.port` = 10001
- `/metrics` 代理目标修改为你的 llama.cpp 地址

`src/utils/parseMetrics.js`
- `buildSnapshot` 计算瞬时 TPS 与瞬时缓存命中率
- 内存缓存 1h 在 `src/store/useMetricsStore.js`

## 📁 目录结构

```
src/
  App.jsx
  main.jsx
  store/useMetricsStore.js
  utils/parseMetrics.js
  styles/theme.js
  components/
    MetricsCard.jsx
    ChartPanel.jsx
```

## 📝 License

MIT
