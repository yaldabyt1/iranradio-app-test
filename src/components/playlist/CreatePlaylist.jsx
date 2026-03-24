import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPlaylist } from "../../slice/playlistsSlice";

export default function CreatePlaylist() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) return;

    dispatch(createPlaylist(trimmed));
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="playlistCreateBox mb-3">
      <div className="playlistCreateTitle">Create Playlist</div>

      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit" className="btn btn-success">
          Create
        </button>
      </div>
    </form>
  );
}