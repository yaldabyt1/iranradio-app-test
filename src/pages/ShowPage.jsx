import React, { useMemo } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useGetPodcastDetailBySlugQuery } from "../services/iranradioApi";
import { setQueue, setCurrentIndex } from "../slice/playerSlice";
import { toggleListenLaterLocal } from "../slice/listenLaterSlice";
import { stripHtml } from "../shared/mappers/iranradio";
import MobileShell from "../components/mobile/MobileShell";

const EMPTY_EPISODES = [];

export default function ShowPage() {
  const { podcastSlug } = useParams();
  const dispatch = useDispatch();

  const { data, isLoading, isError, error } =
    useGetPodcastDetailBySlugQuery(podcastSlug);

  const listenLaterIds = useSelector(
    (s) => (s.listenLater?.ids || []).map(String)
  );

  const show = data?.podcast;
  const episodes = data?.episodes ?? EMPTY_EPISODES;

  const queue = useMemo(
    () => episodes.map(mapEpisodeToPlayer),
    [episodes]
  );

  const handlePlayAll = () => {
    if (!queue.length) return;
    dispatch(setQueue(queue));
    dispatch(setCurrentIndex(0));
  };

  const handlePlayEpisode = (idx) => {
    dispatch(setQueue(queue));
    dispatch(setCurrentIndex(idx));
  };

  const onToggleSave = (episodeId) =>
    dispatch(toggleListenLaterLocal(String(episodeId)));

  return (
    <MobileShell title="Podcast">
      {isLoading && (
        <div className="text-white-50 mt-3">Loading…</div>
      )}

      {isError && (
        <div className="text-danger mt-3">
          {String(error?.data || error?.error || error)}
        </div>
      )}

      {!isLoading && !isError && show && (
        <>
          {/* Hero Section */}
          <div className="mobileHero">
            <div className="mobileHeroImg">
              {show.cover ? (
                <img
                  src={show.cover}
                  alt={stripHtml(show.title)}
                />
              ) : (
                <div className="mobileHeroImgPh" />
              )}
            </div>

            <div className="mobileHeroBody">
              <div className="mobileHeroTitle">
                {stripHtml(show.title)}
              </div>

              <div className="mobileHeroSub">
                {episodes.length
                  ? `${episodes.length} episodes`
                  : "No episodes"}
              </div>

              <div className="mobileHeroActions">
                <Button
                  variant="success"
                  className="w-100"
                  onClick={handlePlayAll}
                  disabled={!queue.length}
                >
                  Play All
                </Button>
              </div>
            </div>
          </div>

          {/* Episodes */}
          <div className="mobileSectionTitle">
            Episodes
          </div>

          {episodes.length === 0 ? (
            <div className="text-white-50">
              No episodes yet.
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {episodes.map((ep, idx) => {
                const id = String(ep.id);
                const isSaved =
                  listenLaterIds.includes(id);

                return (
                  <div
                    key={id}
                    className="mobileEpCard"
                  >
                    <button
                      type="button"
                      className="mobileEpMain"
                      onClick={() =>
                        handlePlayEpisode(idx)
                      }
                    >
                      <div className="mobileEpIndex">
                        {idx + 1}
                      </div>

                      <div className="mobileEpText">
                        <div className="mobileEpTitle">
                          {stripHtml(ep.title)}
                        </div>
                        <div className="mobileEpSub">
                          Tap to play
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="mobileEpSave"
                      onClick={() =>
                        onToggleSave(id)
                      }
                      aria-pressed={isSaved}
                    >
                      {isSaved ? (
                        <i className="bi bi-bookmark-fill" />
                      ) : (
                        <i className="bi bi-bookmark" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </MobileShell>
  );
}

function mapEpisodeToPlayer(ep) {
  return {
    id: String(ep.id),
    title: stripHtml(ep.title),
    showId: String(ep.podcastId),
    showTitle: stripHtml(ep.podcastTitle || ""),
    audioUrl: ep.audioUrl || "",
  };
}