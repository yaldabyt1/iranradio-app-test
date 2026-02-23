import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleListenLaterLocal } from "../slice/listenLaterSlice";

export default function EpisodeSaveButton({ episodeId, className = "" }) {
  const dispatch = useDispatch();
  const ids = useSelector((s) => (s.listenLater?.ids || []).map(String));

  if (!episodeId) return null;

  const id = String(episodeId);
  const saved = ids.includes(id);

  return (
    <button
      type="button"
      className={`btn btn-sm ${saved ? "btn-success" : "btn-outline-light"} ${className}`}
      onClick={() => dispatch(toggleListenLaterLocal(id))}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}