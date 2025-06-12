import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Comment, CreateCommentRequest } from '../../types';
import * as api from '../../services/api';

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (videoId: string) => {
    const response = await api.getVideoComments(videoId);
    return response.comments || [];
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (commentData: CreateCommentRequest) => {
    const response = await api.createComment(commentData);
    return response;
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      })
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new comment if it's a Comment object
        if (typeof action.payload === 'object' && action.payload.id) {
          state.comments.push(action.payload);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create comment';
      });
  },
});

export const { clearComments, clearError } = commentsSlice.actions;
export default commentsSlice.reducer;
