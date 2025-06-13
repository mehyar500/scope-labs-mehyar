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

// async thunks
export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (userId: string) => {
    const response = await api.getUserVideos(userId);
    // extract videos array from the response object
    return response.videos || [];
  }
);

export const fetchVideoById = createAsyncThunk(
  'videos/fetchVideoById',
  async ({ videoId, userId }: { videoId: string; userId: string }) => {
    const response = await api.getSingleVideo(videoId, userId);
    return response;
  }
);

export const createVideo = createAsyncThunk(
  'videos/createVideo',
  async (videoData: CreateVideoRequest, { rejectWithValue }) => {
    try {
      const response = await api.createVideo(videoData);
      return { ...videoData, response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create video');
    }
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
      // fetch videos
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;        // replace all videos with fresh data from server
        // this will remove any temporary videos and show real ones
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch videos';
      })
      // fetch single video
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
      // create video
      .addCase(createVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.loading = false;        // create a temporary video object to show immediately
        const tempVideo: Video = {
          id: `temp-${Date.now()}`, // temporary id
          user_id: action.payload.user_id,
          title: action.payload.title,
          description: action.payload.description,
          video_url: action.payload.video_url,
          created_at: new Date().toISOString(),
        };
        // add the new video to the beginning of the array for immediate display
        state.videos.unshift(tempVideo);
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create video';
      })
      // update video
      .addCase(updateVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.loading = false;
        // update the video in the list
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
