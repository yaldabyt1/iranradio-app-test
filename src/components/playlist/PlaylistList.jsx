import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deletePlaylist,
  selectPlaylists,
} from "../../slice/playlistsSlice";

export default function PlaylistList() {
  const dispatch = useDispatch();
  const playlists = useSelector(selectPlaylists);

  if (!playlists.length) {
    return (
      <div className="text-white-50">
        No playlists yet.
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-2">
      {playlists.map((playlist) => (
        <div key={playlist.id} className="mobileCard playlistRow">
          <Link
            to={`/playlists/${playlist.id}`}
            className="playlistRowMain"
          >
            <div className="mobileCardBody p-0">
              <div className="mobileCardTitle">
                {playlist.name}
              </div>
              <div className="mobileCardSub">
                {playlist.episodes.length} episodes
              </div>
            </div>
          </Link>

          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => dispatch(deletePlaylist(playlist.id))}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}