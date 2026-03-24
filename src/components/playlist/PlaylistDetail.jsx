import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  removeEpisodeFromPlaylist,
  selectPlaylistById,
} from "../../slice/playlistsSlice";
import { setQueue, setCurrentIndex } from "../../slice/playerSlice";
import { stripHtml } from "../../shared/mappers/iranradio";

export default function PlaylistDetail() {
  const { playlistId } = useParams();
  const dispatch = useDispatch();

  const playlist = useSelector((state) =>
    selectPlaylistById(state, playlistId)
  );

  if (!playlist) {
    return <div className="text-white-50">Playlist not found.</div>;
  }

  const handlePlay = (index) => {
    const queue = playlist.episodes.map((ep) => ({
      id: String(ep.id),
      title: stripHtml(ep.title),
      showId: String(ep.podcastId),
      showTitle: stripHtml(ep.podcastTitle || ""),
      audioUrl: ep.audioUrl || "",
    }));

    dispatch(setQueue(queue));
    dispatch(setCurrentIndex(index));
  };

  return (
    <div>
      <div className="mobileSectionTitle mb-2">{playlist.name}</div>

      {!playlist.episodes.length ? (
        <div className="text-white-50">This playlist is empty.</div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {playlist.episodes.map((ep, idx) => (
            <div key={ep.id} className="mobileEpCard">
              <button
                type="button"
                className="mobileEpMain"
                onClick={() => handlePlay(idx)}
              >
                <div className="mobileEpIndex">{idx + 1}</div>

                <div className="mobileEpText">
                  <div className="mobileEpTitle">
                    {stripHtml(ep.title)}
                  </div>
                  <div className="mobileEpSub">
                    {stripHtml(ep.podcastTitle)}
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="mobileEpSave"
                onClick={() =>
                  dispatch(
                    removeEpisodeFromPlaylist({
                      playlistId: playlist.id,
                      episodeId: ep.id,
                    })
                  )
                }
                aria-label="Remove from playlist"
              >
                <i className="bi bi-trash" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}