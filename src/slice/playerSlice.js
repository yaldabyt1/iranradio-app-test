import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  speed: 1.0,
  progressById: {},
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setQueue(state, action) {
      state.queue = Array.isArray(action.payload) ? action.payload : [];
      state.currentIndex = 0;
      state.isPlaying = true;
    },
    setCurrentIndex(state, action) {
      const idx = Number(action.payload ?? 0);
      if (!Number.isFinite(idx)) return;
      if (!state.queue.length) {
        state.currentIndex = 0;
        return;
      }
      state.currentIndex = Math.max(0, Math.min(idx, state.queue.length - 1));
      state.isPlaying = true;
    },
    next(state) {
      if (!state.queue.length) return;
      state.currentIndex =
        state.currentIndex + 1 >= state.queue.length ? 0 : state.currentIndex + 1;
      state.isPlaying = true;
    },
    prev(state) {
      if (!state.queue.length) return;
      state.currentIndex =
        state.currentIndex - 1 < 0 ? state.queue.length - 1 : state.currentIndex - 1;
      state.isPlaying = true;
    },
    setSpeed(state, action) {
      const s = Number(action.payload);
      if (!Number.isFinite(s)) return;
      state.speed = s;
    },
    setIsPlaying(state, action) {
      state.isPlaying = !!action.payload;
    },
    saveProgress(state, action) {
      const { episodeId, seconds } = action.payload || {};
      if (!episodeId) return;
      state.progressById[episodeId] = Math.max(0, Math.floor(Number(seconds || 0)));
    },
  },
});

export const {
  setQueue,
  setCurrentIndex,
  next,
  prev,
  setSpeed,
  setIsPlaying,
  saveProgress,
} = playerSlice.actions;

export const selectCurrentEpisode = (state) =>
  state?.player?.queue?.[state?.player?.currentIndex ?? 0] ?? null;

export const selectCurrentSrc = (state) => {
  const ep = selectCurrentEpisode(state);
  return ep?.audioUrl ?? "";
};

export default playerSlice.reducer;
