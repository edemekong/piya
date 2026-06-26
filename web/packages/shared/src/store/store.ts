import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { domainApi } from "./domain-api";
import { themeReducer } from "./theme-slice";

export const rootReducer = combineReducers({
  [domainApi.reducerPath]: domainApi.reducer,
  theme: themeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function makeAppStore(preloadedState?: RootState) {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(domainApi.middleware),
    reducer: rootReducer,
    preloadedState,
  });
}

export type AppStore = ReturnType<typeof makeAppStore>;
export type AppDispatch = AppStore["dispatch"];
