import { configureStore } from '@reduxjs/toolkit';
import videosReducer from './slices/videosSlice';
import commentsReducer from './slices/commentsSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    videos: videosReducer,
    comments: commentsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
