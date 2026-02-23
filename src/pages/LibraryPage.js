import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as player from "../slice/playerSlice";
import { getListenLaterIds, unsaveListenLater } from "../api/playback";

// دیتای محلی اپیزودها (همون که ShowPage استفاده می‌کنه)
import { podcastEpisodes } from "../data/episodes";

export default function LibraryPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [episodeIds, setEpisodeIds] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadListenLaterIds() {
    setLoading(true);
    try {
      const data = await getListenLaterIds(); // { episode_ids: [] }
      setEpisodeIds(Array.isArray(data?.episode_ids) ? data.episode_ids : []);
    } catch (e) {
      console.error("Failed to load listen later ids", e);
      setEpisodeIds([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadListenLaterIds();
  }, []);

  // ✅ ساخت آیتم‌ها از روی ids + دیتای محلی
  const items = useMemo(() => {
    const set = new Set((episodeIds || []).map((x) => Number(x)));
    return podcastEpisodes.filter((ep) => set.has(Number(ep.id)));
  }, [episodeIds]);

  const handlePlay = (ep) => {
    if (!ep) return;

    dispatch(
      player.setQueue([
        {
          id: ep.id,
          title: ep.title,
          showId: ep.showId,
          showTitle: ep.showTitle,
          audioUrl: ep.audioUrl, // مهم: با selectCurrentSrc شما یکیه
          durationSec: ep.durationSec,
          date: ep.date,
          artworkUrl: ep.artworkUrl,
        },
      ])
    );
    dispatch(player.setCurrentIndex(0));
  };

  const handleUnsave = async (episodeId) => {
    try {
      await unsaveListenLater(episodeId); // DELETE /me/listen-later/{episodeId}/
      // ✅ UI sync
      setEpisodeIds((prev) => prev.filter((id) => Number(id) !== Number(episodeId)));
    } catch (e) {
      console.error("Failed to unsave", e);
    }
  };

  return (
    <div className="col-12 col-md-9 offset-md-3 mainPage">
      <div className="row">
        <div className="col-10">
          <div id="listenLater">
            <div className="d-flex align-items-center justify-content-between">
              <h2 className="text-white">
                Listen Later <strong>(Saved)</strong>
              </h2>

              <button
                className="btn btn-sm btn-outline-light"
                onClick={loadListenLaterIds}
                type="button"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-white-50">Loading...</p>
            ) : items.length === 0 ? (
              <p className="text-white-50">
                Nothing saved yet. Save episodes to see them here.
              </p>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 imgLinks py-3">
                {items.map((ep) => {
                  return (
                    <div className="col mb-3" key={ep.id}>
                      <div className="card bg-dark text-white h-100">
                        {ep.artworkUrl ? (
                          <img
                            src={ep.artworkUrl}
                            className="card-img-top"
                            alt={ep.title || "Episode cover"}
                            style={{ objectFit: "cover", height: 160 }}
                            onClick={() => ep.showId && navigate(`/shows/${ep.showId}`)}
                          />
                        ) : null}

                        <div className="card-body d-flex flex-column">
                          <h6 className="card-title">{ep.title || "Untitled Episode"}</h6>

                          <p
                            className="card-text text-white-50 mb-3"
                            style={{ cursor: ep.showId ? "pointer" : "default" }}
                            onClick={() => ep.showId && navigate(`/shows/${ep.showId}`)}
                          >
                            {ep.showTitle || ""}
                          </p>

                          <div className="mt-auto d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success"
                              type="button"
                              onClick={() => handlePlay(ep)}
                            >
                              Play
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              type="button"
                              onClick={() => handleUnsave(ep.id)}
                            >
                              Unsave
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
