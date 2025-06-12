import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isFullscreen: boolean;
  showCreateModal: boolean;
  showEditModal: boolean;
  selectedVideoId: string | null;
  playbackSpeed: number;
  volume: number;
  theme: 'light' | 'dark';
}

const initialState: UiState = {
  isFullscreen: false,
  showCreateModal: false,
  showEditModal: false,
  selectedVideoId: null,
  playbackSpeed: 1,
  volume: 1,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },
    setShowCreateModal: (state, action: PayloadAction<boolean>) => {
      state.showCreateModal = action.payload;
    },
    setShowEditModal: (state, action: PayloadAction<boolean>) => {
      state.showEditModal = action.payload;
    },
    setSelectedVideoId: (state, action: PayloadAction<string | null>) => {
      state.selectedVideoId = action.payload;
    },
    setPlaybackSpeed: (state, action: PayloadAction<number>) => {
      state.playbackSpeed = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const {
  setFullscreen,
  setShowCreateModal,
  setShowEditModal,
  setSelectedVideoId,
  setPlaybackSpeed,
  setVolume,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
