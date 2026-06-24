import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { themeReducer } from "./theme-slice";

export const rootReducer = combineReducers({
  theme: themeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function makeAppStore(preloadedState?: RootState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type AppStore = ReturnType<typeof makeAppStore>;
export type AppDispatch = AppStore["dispatch"];
