import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex } from "../../slice/playerSlice";

export default function MiniPlayerBar() {
  const dispatch = useDispatch();

  const queue = useSelector((s) => s.player?.queue || []);
  const currentIndex = useSelector((s) => s.player?.currentIndex ?? 0);

  const current = queue?.[currentIndex];

  // اگر چیزی در صف نیست، مینی پلیر را نشان نده
  if (!current) return null;

  const title = current?.title || "Now Playing";
  const showTitle = current?.showTitle || "";

  const onPrev = () => {
    if (!queue.length) return;
    const next = Math.max(0, currentIndex - 1);
    dispatch(setCurrentIndex(next));
  };

  const onNext = () => {
    if (!queue.length) return;
    const next = Math.min(queue.length - 1, currentIndex + 1);
    dispatch(setCurrentIndex(next));
  };

  return (
    <div className="miniPlayer">
      <div className="miniPlayerText">
        <div className="miniPlayerTitle">{title}</div>
        <div className="miniPlayerSub">{showTitle}</div>
      </div>

      <div className="miniPlayerBtns">
        <button className="miniBtn" onClick={onPrev} aria-label="Previous">
          <i className="bi bi-skip-backward-fill" />
        </button>
        <button className="miniBtn" onClick={onNext} aria-label="Next">
          <i className="bi bi-skip-forward-fill" />
        </button>
      </div>
    </div>
  );
}