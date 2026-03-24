import React from "react";
import MobileShell from "../components/mobile/MobileShell";
import PlaylistDetail from "../components/playlist/PlaylistDetail";

export default function PlaylistDetailPage() {
  return (
    <MobileShell title="Playlist">
      <PlaylistDetail />
    </MobileShell>
  );
}