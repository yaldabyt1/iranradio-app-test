// عنوان‌ها در WP معمولاً { rendered: "<p>...</p>" } هستند
export function stripHtml(s) {
    if (!s) return "";
    return String(s).replace(/<[^>]*>/g, "").trim();
  }
  
  export function mapWpPlaylistToPodcast(post) {
    // featured image اگر _embed باشد از آن می‌آید؛ اگر نه fallback
    const coverFromEmbed =
      post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.medium?.source_url;
  
    return {
      id: post.id,
      slug: post.slug,
      title: stripHtml(post?.title?.rendered),
      description: post?.excerpt?.rendered || post?.content?.rendered || "",
      cover: coverFromEmbed || "",
      categoryIds: Array.isArray(post?.["playlist-category"]) ? post["playlist-category"] : [],
      link: post?.link || "",
      modified: post?.modified_gmt || post?.modified || "",
    };
  }
  
  /**
   * خیلی مهم:
   * در JSON شما trackها جایی قبل از _wp_old_date و ... دیده می‌شوند و فیلدهایی مثل track_mp3 دارند. :contentReference[oaicite:5]{index=5}
   * اسم دقیق آرایه trackها ممکن است در سایت شما یکی از این‌ها باشد:
   * - alb_tracklist
   * - tracklist
   * - tracks
   * - یا حتی داخل یک فیلد سفارشی
   */
  export function pickTracksFromPlaylistPost(post) {
    const candidates = [
      post?.alb_tracklist,
      post?.tracklist,
      post?.tracks,
      post?.playlist_tracks,
    ];
  
    for (const c of candidates) {
      if (Array.isArray(c) && c.length) return c;
    }
  
    // بعضی سایت‌ها trackها را در root به صورت آرایه‌ای با آیتم‌هایی که track_mp3 دارند نگه می‌دارند
    // (اگر ساختار دقیق‌تان این شکلی است، این خط کمکتان می‌کند)
    const maybeRootArray = Array.isArray(post) ? post : null;
    if (maybeRootArray) return maybeRootArray;
  
    return [];
  }
  
  export function mapWpTrackToEpisode(track, ctx) {
    // JSON شما: track_mp3, track_image, track_description ... :contentReference[oaicite:6]{index=6}
    const title =
      stripHtml(track?.track_title) ||
      stripHtml(track?.title) ||
      stripHtml(track?.podcast_itunes_episode_title) ||
      `Episode ${Number(ctx.index) + 1}`;
  
    return {
      id: track?.track_mp3_id || `${ctx.podcastId}-${ctx.index}`,
      title,
      podcastId: ctx.podcastId,
      podcastTitle: ctx.podcastTitle,
      podcastSlug: ctx.podcastSlug,
      audioUrl: track?.track_mp3 || "",
      cover: track?.track_image || ctx.podcastCover || "",
      description: track?.track_description || "",
    };
  }