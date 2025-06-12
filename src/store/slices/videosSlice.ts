import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Video, CreateVideoRequest, EditVideoRequest } from '../../types';
import * as api from '../../services/api';

interface VideosState {
  videos: Video[];
  currentVideo: Video | null;
  loading: boolean;
  error: string | null;
}

const initialState: VideosState = {
  videos: [],
  currentVideo: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (userId: string) => {
    const response = await api.getUserVideos(userId);
    // Extract videos array from the response object
    return response.videos || [];
  }
);

export const fetchVideoById = createAsyncThunk(
  'videos/fetchVideoById',
  async (videoId: string) => {
    const response = await api.getSingleVideo(videoId);
    return response;
  }
);

export const createVideo = createAsyncThunk(
  'videos/createVideo',
  async (videoData: CreateVideoRequest) => {
    const response = await api.createVideo(videoData);
    return response;
  }
);

export const updateVideo = createAsyncThunk(
  'videos/updateVideo',
  async (videoData: EditVideoRequest) => {
    const response = await api.editVideo(videoData);
    return response;
  }
);

const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    setCurrentVideo: (state, action: PayloadAction<Video | null>) => {
      state.currentVideo = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch videos
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch videos';
      })
      // Fetch single video
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch video';
      })
      // Create video
      .addCase(createVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new video to the list if it's a Video object
        if (typeof action.payload === 'object' && action.payload.id) {
          state.videos.unshift(action.payload);
        }
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create video';
      })
      // Update video
      .addCase(updateVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.loading = false;
        // Update the video in the list
        const index = state.videos.findIndex(v => v.id === action.meta.arg.video_id);
        if (index !== -1 && typeof action.payload === 'object' && action.payload.id) {
          state.videos[index] = action.payload;
          if (state.currentVideo?.id === action.payload.id) {
            state.currentVideo = action.payload;
          }
        }
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update video';
      });
  },
});

export const { setCurrentVideo, clearError } = videosSlice.actions;
export default videosSlice.reducer;
