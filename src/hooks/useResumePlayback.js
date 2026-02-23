import { useDispatch } from "react-redux";
import { saveProgress } from "../slice/playerSlice";

const key = (episodeId) => `progress_${episodeId}`;

export function useResumePlayback() {
  const dispatch = useDispatch();

  const load = async (episodeId) => {
    try {
      const raw = localStorage.getItem(key(episodeId));
      const seconds = raw ? Number(raw) : 0;
      return Number.isFinite(seconds) ? seconds : 0;
    } catch {
      return 0;
    }
  };

  const persist = async (episodeId, seconds) => {
    if (!episodeId) return;
    dispatch(saveProgress({ episodeId, seconds }));

    try {
      localStorage.setItem(key(episodeId), String(Math.floor(seconds || 0)));
    } catch {}
  };

  return { load, persist };
}