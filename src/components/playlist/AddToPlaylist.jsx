import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addEpisodeToPlaylist,
  selectPlaylists,
} from "../../slice/playlistsSlice";
import { stripHtml } from "../../shared/mappers/iranradio";

export default function AddToPlaylist({ episode }) {
  const dispatch = useDispatch();
  const playlists = useSelector(selectPlaylists);
  const [open, setOpen] = useState(false);

  const normalizedEpisode = useMemo(() => {
    if (!episode) return null;

    return {
      id: String(episode.id),
      title: stripHtml(episode.title),
      audioUrl: episode.audioUrl || "",
      podcastId: episode.podcastId || "",
      podcastTitle: stripHtml(episode.podcastTitle || ""),
      podcastSlug: episode.podcastSlug || "",
      cover: episode.cover || "",
      description: episode.description || "",
    };
  }, [episode]);

  const handleAdd = (playlistId) => {
    if (!normalizedEpisode) return;

    dispatch(
      addEpisodeToPlaylist({
        playlistId,
        episode: normalizedEpisode,
      })
    );

    setOpen(false);
  };

  return (
    <div className="playlistMenuWrap">
      <button
        type="button"
        className="mobileEpSave"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Add to playlist"
      >
        <i className="bi bi-music-note-list" />
      </button>

      {open && (
        <div className="playlistMenuBox">
          {!playlists.length ? (
            <div className="playlistMenuEmpty">
              No playlist yet.
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  type="button"
                  className="playlistMenuItem"
                  onClick={() => handleAdd(playlist.id)}
                >
                  <div className="playlistMenuItemTitle">
                    {playlist.name}
                  </div>
                  <div className="playlistMenuItemSub">
                    {playlist.episodes.length} episodes
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}