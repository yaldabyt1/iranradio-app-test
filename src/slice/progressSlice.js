import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProgress, putProgress } from "../api/playback";

export const fetchProgress = createAsyncThunk("progress/fetch", async () => {
  const data = await getProgress();
  return data || [];
});

export const upsertProgress = createAsyncThunk(
  "progress/upsert",
  async ({ episodeId, seconds }) => {
    const data = await putProgress(episodeId, seconds);
    return data;
  }
);

const progressSlice = createSlice({
  name: "progress",
  initialState: { byEpisodeId: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        const map = {};
        for (const row of action.payload) {
          // row: { episode: {...} , position_seconds }
          const episodeId = row?.episode?.id ?? row?.episode_id;
          if (episodeId) map[episodeId] = row.position_seconds || 0;
        }
        state.byEpisodeId = map;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed";
      })
      .addCase(upsertProgress.fulfilled, (state, action) => {
        const epId = action.payload?.episode?.id ?? action.payload?.episode_id;
        if (epId) state.byEpisodeId[epId] = action.payload.position_seconds || 0;
      });
  },
});

export default progressSlice.reducer;