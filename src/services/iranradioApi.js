import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  mapWpPlaylistToPodcast,
  mapWpTrackToEpisode,
  pickTracksFromPlaylistPost,
} from "../shared/mappers/iranradio";

/**
 * اگر اپ روی مسیر بدون زبان اجرا شود
 * (مثلاً localhost:3000/)
 * ما زبان پیش‌فرض را es می‌گذاریم
 */
const DEFAULT_LANG = "es";

function detectLangBase() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const maybeLang = parts[0];

  const lang =
    typeof maybeLang === "string" && /^[a-z]{2,3}$/i.test(maybeLang)
      ? maybeLang
      : DEFAULT_LANG;

  return `https://iranradio.ir/${lang}/wp-json/wp/v2`;
}

export const iranradioApi = createApi({
  reducerPath: "iranradioApi",
  baseQuery: fetchBaseQuery({
    baseUrl: detectLangBase(),
  }),
  tagTypes: ["PlaylistCategory", "Podcast"],

  endpoints: (builder) => ({
    // =========================
    // 1) Categories (playlist-category)
    // =========================
    getPodcastCategories: builder.query({
      query: () => `/playlist-category?per_page=100`,
      providesTags: (res) =>
        res
          ? [
              ...res.map((c) => ({
                type: "PlaylistCategory",
                id: c.id,
              })),
              { type: "PlaylistCategory", id: "LIST" },
            ]
          : [{ type: "PlaylistCategory", id: "LIST" }],
    }),

    // =========================
    // 2) Category by slug
    // =========================
    getPodcastCategoryBySlug: builder.query({
      query: (slug) =>
        `/playlist-category?slug=${encodeURIComponent(slug)}`,
      transformResponse: (res) =>
        Array.isArray(res) && res[0] ? res[0] : null,
      providesTags: (cat) =>
        cat ? [{ type: "PlaylistCategory", id: cat.id }] : [],
    }),

    // =========================
    // 3) Playlists by CategoryId
    // مهم: اینجا episodes هم می‌سازیم
    // =========================
    getPodcastsByCategoryId: builder.query({
      query: ({ categoryId, page = 1, perPage = 20 }) => {
        const params = new URLSearchParams({
          page: String(page),
          per_page: String(perPage),
          _embed: "1",
        });

        if (categoryId) {
          params.set("playlist-category", String(categoryId));
        }

        return `/sr_playlist?${params.toString()}`;
      },

      transformResponse: (res) =>
        Array.isArray(res)
          ? res.map((post) => {
              const podcast = mapWpPlaylistToPodcast(post);
              const tracks = pickTracksFromPlaylistPost(post);

              const episodes = tracks.map((track, index) =>
                mapWpTrackToEpisode(track, {
                  podcastId: podcast.id,
                  podcastSlug: podcast.slug,
                  podcastTitle: podcast.title,
                  podcastCover: podcast.cover,
                  index,
                })
              );

              return {
                ...podcast,
                episodes,
              };
            })
          : [],

      providesTags: (res) =>
        res
          ? [
              ...res.map((p) => ({
                type: "Podcast",
                id: p.id,
              })),
              { type: "Podcast", id: "LIST" },
            ]
          : [{ type: "Podcast", id: "LIST" }],
    }),

    // =========================
    // 4) Podcast Detail by Slug
    // =========================
    getPodcastDetailBySlug: builder.query({
      query: (slug) =>
        `/sr_playlist?slug=${encodeURIComponent(slug)}&_embed=1`,

      transformResponse: (res) => {
        const post =
          Array.isArray(res) && res.length ? res[0] : null;

        if (!post) return null;

        const podcast = mapWpPlaylistToPodcast(post);
        const tracks = pickTracksFromPlaylistPost(post);

        const episodes = tracks.map((track, index) =>
          mapWpTrackToEpisode(track, {
            podcastId: podcast.id,
            podcastSlug: podcast.slug,
            podcastTitle: podcast.title,
            podcastCover: podcast.cover,
            index,
          })
        );

        return { podcast, episodes };
      },

      providesTags: (_res, _err, slug) => [
        { type: "Podcast", id: slug },
      ],
    }),
  }),
});

export const {
  useGetPodcastCategoriesQuery,
  useGetPodcastCategoryBySlugQuery,
  useGetPodcastsByCategoryIdQuery,
  useGetPodcastDetailBySlugQuery,
} = iranradioApi;