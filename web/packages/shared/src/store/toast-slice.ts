import {
  createSlice,
  nanoid,
  type Dispatch,
  type PayloadAction,
} from "@reduxjs/toolkit";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type ToastNotification = {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  durationMs: number;
};

export type ToastInput = {
  id?: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
};

export type ToastState = {
  notifications: ToastNotification[];
};

const defaultToastDurationMs = 5000;

const initialState: ToastState = {
  notifications: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: {
      reducer(state, action: PayloadAction<ToastNotification>) {
        state.notifications.push(action.payload);
      },
      prepare(input: ToastInput) {
        return {
          payload: {
            id: input.id ?? nanoid(),
            title: input.title,
            message: input.message,
            variant: input.variant ?? "info",
            durationMs: input.durationMs ?? defaultToastDurationMs,
          },
        };
      },
    },
    removeToast(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload,
      );
    },
    clearToasts(state) {
      state.notifications = [];
    },
  },
});

export const { addToast, clearToasts, removeToast } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;

export function showToast(dispatch: Dispatch, toast: ToastInput) {
  dispatch(addToast(toast));
}
