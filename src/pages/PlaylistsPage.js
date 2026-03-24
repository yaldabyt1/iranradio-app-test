import React from "react";
import MobileShell from "../components/mobile/MobileShell";
import CreatePlaylist from "../components/playlist/CreatePlaylist";
import PlaylistList from "../components/playlist/PlaylistList";

export default function PlaylistsPage() {
  return (
    <MobileShell title="Playlists">
      <CreatePlaylist />
      <PlaylistList />
    </MobileShell>
  );
}