import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setQueue, setCurrentIndex } from "../slice/playerSlice";
import { useGetPodcastsByCategoryIdQuery } from "../services/iranradioApi";
import { stripHtml } from "../shared/mappers/iranradio";
import MobileShell from "../components/mobile/MobileShell";

export default function ListenLaterPage() {
  const dispatch = useDispatch();

  const savedIds = useSelector((s) =>
    (s.listenLater?.ids || []).map(String)
  );

  const {
    data: playlists = [],
    isLoading,
    isError,
    error,
  } = useGetPodcastsByCategoryIdQuery({
    categoryId: null,
    page: 1,
    perPage: 50,
  });

  const allEpisodes = useMemo(() => {
    const items = [];

    playlists.forEach((pl) => {
      if (Array.isArray(pl?.episodes)) {
        pl.episodes.forEach((ep) => {
          items.push({
            ...ep,
            podcastTitle: ep?.podcastTitle || pl?.title || "",
            podcastId: ep?.podcastId || pl?.id,
          });
        });
      }
    });

    return items;
  }, [playlists]);

  const savedEpisodes = useMemo(() => {
    return allEpisodes.filter((ep) =>
      savedIds.includes(String(ep.id))
    );
  }, [allEpisodes, savedIds]);

  const handlePlay = (idx) => {
    if (!savedEpisodes.length) return;

    const queue = savedEpisodes.map((ep) => ({
      id: String(ep.id),
      title: stripHtml(ep.title),
      showId: String(ep.podcastId),
      showTitle: stripHtml(ep.podcastTitle || ""),
      audioUrl: ep.audioUrl || "",
    }));

    dispatch(setQueue(queue));
    dispatch(setCurrentIndex(idx));
  };

  return (
    <MobileShell title="Saved">
      {isLoading && (
        <div className="text-white-50 mt-3">
          Loading…
        </div>
      )}

      {isError && (
        <div className="text-danger mt-3">
          {String(error?.data || error?.error || error)}
        </div>
      )}

      {!isLoading && !isError && savedIds.length === 0 && (
        <div className="text-white-50 mt-3">
          No saved episodes yet.
        </div>
      )}

      {!isLoading && !isError && savedIds.length > 0 && savedEpisodes.length === 0 && (
        <div className="text-white-50 mt-3">
          Saved items found, but episode details are not loaded yet.
        </div>
      )}

      {!isLoading && !isError && savedEpisodes.length > 0 && (
        <div className="d-flex flex-column gap-2 mt-2">
          {savedEpisodes.map((ep, idx) => (
            <button
              key={ep.id}
              type="button"
              className="mobileEpCard mobileEpBtn"
              onClick={() => handlePlay(idx)}
            >
              <div className="mobileEpIndex">
                {idx + 1}
              </div>

              <div className="mobileEpText">
                <div className="mobileEpTitle">
                  {stripHtml(ep.title)}
                </div>
                <div className="mobileEpSub">
                  {stripHtml(ep.podcastTitle)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </MobileShell>
  );
}