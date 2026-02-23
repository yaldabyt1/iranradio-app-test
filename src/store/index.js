import { configureStore } from "@reduxjs/toolkit";

import favouritesReducer from "../slice/favouritesSlice";
import rockReducer from "../slice/rockSlice";
import currentSrcReducer from "../slice/currentSrc";
import playerReducer from "../slice/playerSlice";
import listenLaterReducer from "../slice/listenLaterSlice";
import progressReducer from "../slice/progressSlice";
import catalogReducer from "../slice/catalogSlice";

import { iranradioApi } from "../services/iranradioApi";

export const store = configureStore({
  reducer: {
    favourites: favouritesReducer,
    rock: rockReducer,
    currentSrc: currentSrcReducer,
    player: playerReducer,
    listenLater: listenLaterReducer,
    progress: progressReducer,
    catalog: catalogReducer,

    // ✅ RTK Query
    [iranradioApi.reducerPath]: iranradioApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(iranradioApi.middleware),
});