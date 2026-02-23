import { createSlice } from "@reduxjs/toolkit";

const LS_KEY = "listenLaterIds";

const load = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids.map(String) : [];
  } catch {
    return [];
  }
};

const save = (ids) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(ids));
  } catch {}
};

const listenLaterSlice = createSlice({
  name: "listenLater",
  initialState: { ids: load() },
  reducers: {
    toggleListenLaterLocal(state, action) {
      const id = String(action.payload);
      state.ids = state.ids.includes(id)
        ? state.ids.filter((x) => x !== id)
        : [...state.ids, id];
      save(state.ids);
    },
  },
});

export const { toggleListenLaterLocal } = listenLaterSlice.actions;
export default listenLaterSlice.reducer;