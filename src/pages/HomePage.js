import React from "react";
import { Link } from "react-router-dom";
import { useGetPodcastsByCategoryIdQuery } from "../services/iranradioApi";
import { stripHtml } from "../shared/mappers/iranradio";
import MobileShell from "../components/mobile/MobileShell";

export default function HomePage() {
  const {
    data: podcasts = [],
    isLoading,
    isError,
    error,
  } = useGetPodcastsByCategoryIdQuery({
    categoryId: null,
    page: 1,
    perPage: 30,
  });

  return (
    <MobileShell title="IranRadio">
      {isLoading && (
        <div className="text-white-50 mt-3">Loading…</div>
      )}

      {isError && (
        <div className="text-danger mt-3">
          {String(error?.data || error?.error || error)}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {!podcasts.length ? (
            <div className="text-white-50">No podcasts found.</div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {podcasts.map((p) => (
                <Link
                  key={p.id}
                  to={`/podcast/${p.slug}`}
                  className="mobileCard"
                >
                  <div className="mobileCardImg">
                    {p.cover ? (
                      <img
                        src={p.cover}
                        alt={stripHtml(p.title)}
                      />
                    ) : (
                      <div className="mobileCardImgPh" />
                    )}
                  </div>

                  <div className="mobileCardBody">
                    <div className="mobileCardTitle">
                      {stripHtml(p.title)}
                    </div>
                    <div className="mobileCardSub">
                      Tap to view episodes
                    </div>
                  </div>

                  <div className="mobileCardChevron">›</div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </MobileShell>
  );
}