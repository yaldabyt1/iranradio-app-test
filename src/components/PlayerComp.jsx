import React, { useEffect, useRef, useCallback } from "react";
import { Container } from "react-bootstrap";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import * as player from "../slice/playerSlice";
import { useNavigate } from "react-router-dom";
import { useResumePlayback } from "../hooks/useResumePlayback";

export default function PlayerComp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const src = useSelector(player.selectCurrentSrc);
  const currentEpisode = useSelector(player.selectCurrentEpisode);
  const speed = useSelector((s) => s.player.speed);

  const { load, persist } = useResumePlayback();

  const hasEpisode = !!currentEpisode?.id && !!src;

  const persistNow = useCallback(() => {
    const audioEl = playerRef.current?.audio?.current;
    if (!audioEl || !currentEpisode?.id) return;

    const seconds = Math.floor(audioEl.currentTime || 0);
    // ✅ backend sync
    persist(currentEpisode.id, seconds);
  }, [currentEpisode?.id, persist]);

  // -------- Resume on episode change --------
  useEffect(() => {
    if (!currentEpisode?.id) return;

    let cancelled = false;

    async function resume() {
      const sec = await load(currentEpisode.id);
      if (cancelled) return;

      const audioEl = playerRef.current?.audio?.current;
      if (audioEl && sec > 0) {
        // اگر metadata هنوز نیومده بود، در onLoadedMetadata هم دوباره ست می‌کنیم
        audioEl.currentTime = sec;
      }
    }

    resume();
    return () => {
      cancelled = true;
    };
  }, [currentEpisode?.id, load]);

  // -------- Apply playback speed --------
  useEffect(() => {
    const audioEl = playerRef.current?.audio?.current;
    if (audioEl) audioEl.playbackRate = speed;
  }, [speed, src]);

  // -------- Save progress periodically (10s) --------
  useEffect(() => {
    if (!currentEpisode?.id) return;

    const timer = setInterval(() => {
      persistNow();
    }, 10000);

    return () => clearInterval(timer);
  }, [currentEpisode?.id, persistNow]);

  const seekBy = (deltaSeconds) => {
    const audioEl = playerRef.current?.audio?.current;
    if (!audioEl) return;
    audioEl.currentTime = Math.max(0, (audioEl.currentTime || 0) + deltaSeconds);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.5, 2];
    const idx = speeds.indexOf(speed);
    dispatch(player.setSpeed(speeds[(idx + 1) % speeds.length]));
  };

  const handleLoadedMetadata = async () => {
    if (!currentEpisode?.id) return;
    const sec = await load(currentEpisode.id);
    const audioEl = playerRef.current?.audio?.current;

    // اگر هنوز اولش بودیم، resume کن
    if (audioEl && sec > 0 && (audioEl.currentTime || 0) < 1) {
      audioEl.currentTime = sec;
    }
  };

  if (!hasEpisode) return null;

  return (
    <Container fluid className="fixed-bottom bg-container pt-1 d-flex">
      <div className="col-md-3 offset-md-1 text-white text-center">
        <p className="mb-0 d-none d-lg-block">
          {currentEpisode.title?.length > 34
            ? currentEpisode.title.slice(0, 31) + "..."
            : currentEpisode.title}
        </p>

        <p
          className="mb-0 d-none d-lg-block artist"
          style={{ cursor: "pointer" }}
          onClick={() =>
            currentEpisode.showId && navigate(`/shows/${currentEpisode.showId}`)
          }
        >
          {currentEpisode.showTitle?.length > 34
            ? currentEpisode.showTitle.slice(0, 31) + "..."
            : currentEpisode.showTitle}
        </p>
      </div>

      <div className="col-12 col-lg-6 mainPage mt-2">
        <AudioPlayer
          ref={playerRef}
          src={src}
          showSkipControls
          onLoadedMetadata={handleLoadedMetadata}
          onClickNext={() => dispatch(player.next())}
          onClickPrevious={() => dispatch(player.prev())}
          onEnded={() => dispatch(player.next())}
          onPlay={() => dispatch(player.setIsPlaying(true))}
          onPause={() => {
            dispatch(player.setIsPlaying(false));
            persistNow();
          }}
          // برای دمو خوبه: هر 5 ثانیه ذخیره کن
          onListen={persistNow}
          listenInterval={5000}
          customAdditionalControls={[
            <button
              key="back15"
              className="btn btn-sm btn-outline-light mx-1"
              onClick={() => seekBy(-15)}
              type="button"
            >
              -15s
            </button>,
            <button
              key="fwd30"
              className="btn btn-sm btn-outline-light mx-1"
              onClick={() => seekBy(30)}
              type="button"
            >
              +30s
            </button>,
            <button
              key="speed"
              className="btn btn-sm btn-outline-light mx-1"
              onClick={cycleSpeed}
              type="button"
            >
              {speed}x
            </button>,
          ]}
        />
      </div>
    </Container>
  );
}
