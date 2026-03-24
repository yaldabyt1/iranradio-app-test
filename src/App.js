import "./App.css";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ShowPage from "./pages/ShowPage";
import ListenLaterPage from "./pages/ListenLaterPage";
import LibraryPage from "./pages/LibraryPage";
import AlbumPage from "./pages/AlbumPage";
import ArtistPage from "./pages/ArtistPage";
import ResultSearchPage from "./pages/ResultSearchPage";
import NotFoundPage from "./pages/NotFoundPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import PlaylistDetailPage from "./pages/PlaylistDetailPage";

import PlayerComp from "./components/PlayerComp";

function App() {
  return (
    <>
      <Routes>
        {/* mobile-first main routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/podcast/:podcastSlug" element={<ShowPage />} />
        <Route path="/listen-later" element={<ListenLaterPage />} />
        <Route path="/library" element={<LibraryPage />} />

        {/* ✅ PLAYLIST ROUTES (مهم) */}
        <Route path="/playlists" element={<PlaylistsPage />} />
        <Route path="/playlists/:playlistId" element={<PlaylistDetailPage />} />

        {/* legacy routes */}
        <Route path="/album_page/:albumID" element={<AlbumPage />} />
        <Route path="/artist_page/:artistID" element={<ArtistPage />} />
        <Route path="/search_result/:query" element={<ResultSearchPage />} />
        <Route path="/library_page" element={<LibraryPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <PlayerComp />
    </>
  );
}

export default App;