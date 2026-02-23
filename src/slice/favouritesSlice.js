import { createSlice } from "@reduxjs/toolkit";

const LS_EPISODES_KEY = "savedEpisodes";
const LS_SHOWS_KEY = "savedShows";

const readLSArray = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : fallback;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  // جدید (پادکست)
  savedEpisodes: readLSArray(LS_EPISODES_KEY, []),
  savedShows: readLSArray(LS_SHOWS_KEY, []),

  // قدیمی (برای اینکه کدهای قبلی نشکنند)
  favourites: readLSArray("myFav", []),
  albumFavoriti: readLSArray("myAlbumFav", []),

  // قبلاً SideBar استفاده می‌کرد
  fantoccio: false,
};

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    // ---- جدید: Podcast Library ----
    toggleSavedEpisode(state, action) {
      const id = action.payload;
      if (!id) return;

      if (state.savedEpisodes.includes(id)) {
        state.savedEpisodes = state.savedEpisodes.filter((x) => x !== id);
      } else {
        state.savedEpisodes.push(id);
      }
      localStorage.setItem(LS_EPISODES_KEY, JSON.stringify(state.savedEpisodes));
    },

    toggleSavedShow(state, action) {
      const id = action.payload;
      if (!id) return;

      if (state.savedShows.includes(id)) {
        state.savedShows = state.savedShows.filter((x) => x !== id);
      } else {
        state.savedShows.push(id);
      }
      localStorage.setItem(LS_SHOWS_KEY, JSON.stringify(state.savedShows));
    },

    clearLibrary(state) {
      state.savedEpisodes = [];
      state.savedShows = [];
      localStorage.setItem(LS_EPISODES_KEY, JSON.stringify([]));
      localStorage.setItem(LS_SHOWS_KEY, JSON.stringify([]));
    },

    // ---- قدیمی: برای سازگاری ----
    addFavourite(state, action) {
      const id = action.payload;
      if (state.favourites.includes(id)) return;
      state.favourites.push(id);
      localStorage.setItem("myFav", JSON.stringify(state.favourites));
    },
    removeFavourite(state, action) {
      const id = action.payload;
      state.favourites = state.favourites.filter((x) => x !== id);
      localStorage.setItem("myFav", JSON.stringify(state.favourites));
    },
    addAlbumFavourite(state, action) {
      const id = action.payload;
      if (state.albumFavoriti.includes(id)) return;
      state.albumFavoriti.push(id);
      // ✅ باگ قبلی: باید albumFavoriti ذخیره شود
      localStorage.setItem("myAlbumFav", JSON.stringify(state.albumFavoriti));
    },
    removeAlbumFavourite(state, action) {
      const id = action.payload;
      state.albumFavoriti = state.albumFavoriti.filter((x) => x !== id);
      localStorage.setItem("myAlbumFav", JSON.stringify(state.albumFavoriti));
    },
    cambioFantoccio(state) {
      state.fantoccio = !state.fantoccio;
    },
  },
});

export const {
  // جدید
  toggleSavedEpisode,
  toggleSavedShow,
  clearLibrary,

  // قدیمی
  addFavourite,
  removeFavourite,
  addAlbumFavourite,
  removeAlbumFavourite,
  cambioFantoccio,
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
