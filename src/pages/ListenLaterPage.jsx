import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setQueue, setCurrentIndex } from "../slice/playerSlice";
import { useGetPodcastsByCategoryIdQuery } from "../services/iranradioApi";
import { stripHtml } from "../shared/mappers/iranradio";
import MobileShell from "../components/mobile/MobileShell";

export default function ListenLaterPage() {
  const dispatch = useDispatch();
  const savedIds = useSelector((s) => (s.listenLater?.ids || []).map(String));

  // همه playlist ها رو بگیر
  const { data: playlists = [], isLoading } =
    useGetPodcastsByCategoryIdQuery({
      categoryId: null,
      page: 1,
      perPage: 50,
    });

  // تمام اپیزودها رو استخراج کن
  const allEpisodes = useMemo(() => {
    const eps = [];
    playlists.forEach((pl) => {
      if (Array.isArray(pl.episodes)) {
        eps.push(...pl.episodes);
      }
    });
    return eps;
  }, [playlists]);

  // فقط اپیزودهای ذخیره شده
  const savedEpisodes = useMemo(
    () =>
      allEpisodes.filter((ep) =>
        savedIds.includes(String(ep.id))
      ),
    [allEpisodes, savedIds]
  );

  const handlePlay = (idx) => {
    dispatch(setQueue(savedEpisodes));
    dispatch(setCurrentIndex(idx));
  };

  return (
    <MobileShell title="Saved">
      {isLoading && (
        <div className="text-white-50 mt-3">
          Loading…
        </div>
      )}

      {!isLoading && savedEpisodes.length === 0 && (
        <div className="text-white-50">
          No saved episodes yet.
        </div>
      )}

      <div className="d-flex flex-column gap-2">
        {savedEpisodes.map((ep, idx) => (
          <div
            key={ep.id}
            className="mobileEpCard"
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
          </div>
        ))}
      </div>
    </MobileShell>
  );
}