import { createSlice, nanoid } from "@reduxjs/toolkit";

const LS_KEY = "podcast_playlists";

function loadPlaylists() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePlaylists(items) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {
    // ignore localStorage errors
  }
}

const initialState = {
  items: loadPlaylists(),
};

const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    createPlaylist: {
      reducer(state, action) {
        state.items.unshift(action.payload);
        savePlaylists(state.items);
      },
      prepare(name) {
        return {
          payload: {
            id: nanoid(),
            name: String(name).trim(),
            episodes: [],
            createdAt: new Date().toISOString(),
          },
        };
      },
    },

    deletePlaylist(state, action) {
      const playlistId = action.payload;
      state.items = state.items.filter((pl) => pl.id !== playlistId);
      savePlaylists(state.items);
    },

    addEpisodeToPlaylist(state, action) {
      const { playlistId, episode } = action.payload;
      const playlist = state.items.find((pl) => pl.id === playlistId);

      if (!playlist || !episode?.id) return;

      const exists = playlist.episodes.some(
        (ep) => String(ep.id) === String(episode.id)
      );

      if (exists) return;

      playlist.episodes.unshift({
        id: String(episode.id),
        title: episode.title || "",
        audioUrl: episode.audioUrl || "",
        podcastId: episode.podcastId || "",
        podcastTitle: episode.podcastTitle || "",
        podcastSlug: episode.podcastSlug || "",
        cover: episode.cover || "",
        description: episode.description || "",
      });

      savePlaylists(state.items);
    },

    removeEpisodeFromPlaylist(state, action) {
      const { playlistId, episodeId } = action.payload;
      const playlist = state.items.find((pl) => pl.id === playlistId);

      if (!playlist) return;

      playlist.episodes = playlist.episodes.filter(
        (ep) => String(ep.id) !== String(episodeId)
      );

      savePlaylists(state.items);
    },

    renamePlaylist(state, action) {
      const { playlistId, name } = action.payload;
      const playlist = state.items.find((pl) => pl.id === playlistId);

      if (!playlist) return;

      const trimmed = String(name).trim();
      if (!trimmed) return;

      playlist.name = trimmed;
      savePlaylists(state.items);
    },
  },
});

export const {
  createPlaylist,
  deletePlaylist,
  addEpisodeToPlaylist,
  removeEpisodeFromPlaylist,
  renamePlaylist,
} = playlistsSlice.actions;

export const selectPlaylists = (state) => state.playlists.items;

export const selectPlaylistById = (state, playlistId) =>
  state.playlists.items.find((pl) => pl.id === playlistId);

export default playlistsSlice.reducer;