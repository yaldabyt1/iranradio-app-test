import "./App.css";
import { Route, Routes } from "react-router-dom";
import ListenLaterPage from "./pages/ListenLaterPage";
import HomePage from "./pages/HomePage";
import AlbumPage from "./pages/AlbumPage";
import ArtistPage from "./pages/ArtistPage";
import LibraryPage from "./pages/LibraryPage";
import NotFoundPage from "./pages/NotFoundPage";
import ResultSearchPage from "./pages/ResultSearchPage";

import SideBar from "./components/SideBarComp";
import PlayerComp from "./components/PlayerComp";
import ShowPage from "./pages/ShowPage";



function App() {
  return (
    <>
      <SideBar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* ✅ Podcast routes */}
        <Route path="/podcast/:podcastSlug" element={<ShowPage />} />

        {/* قدیمی‌ها فعلاً نگه داریم */}
        <Route path="/album_page/:albumID" element={<AlbumPage />} />
        <Route path="/artist_page/:artistID" element={<ArtistPage />} />
        <Route path="/search_result/:query" element={<ResultSearchPage />} />
        <Route path="/library_page" element={<LibraryPage />} />
        <Route path="/listen-later" element={<ListenLaterPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <PlayerComp />
    </>
  );
}

export default App;

