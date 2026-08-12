import { create } from 'zustand';

const ONE_HOUR = 60 * 60 * 1000;

export const useMetricsStore = create((set, get) => ({
  snapshots: [],
  latest: null,
  status: 'idle',
  error: null,

  addSnapshot(snap) {
    const snapshots = [...get().snapshots, snap];
    const cutoff = Date.now() - ONE_HOUR;
    const pruned = snapshots.filter(s => s.ts >= cutoff);
    set({ snapshots: pruned, latest: snap });
  },

  setStatus(s) { set({ status: s }); },
  setError(e) { set({ error: e }); },

  clear() { set({ snapshots: [], latest: null }); },
}));
