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

// async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (videoId: string) => {
    const response = await api.getVideoComments(videoId);
    return response.comments || [];
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (commentData: CreateCommentRequest, { rejectWithValue }) => {
    try {
      const response = await api.createComment(commentData);
      return { ...commentData, response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create comment');
    }
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
      // fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;        // replace all comments with fresh data from server
        // this will remove any temporary comments and show real ones
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      })
      // create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;        // create a temporary comment object to show immediately
        const tempComment: Comment = {
          id: `temp-${Date.now()}`, // temporary id
          video_id: action.payload.video_id,
          user_id: action.payload.user_id,
          content: action.payload.content,
          created_at: new Date().toISOString(),
        };
        // add the new comment to the beginning of the array for immediate display
        state.comments.unshift(tempComment);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create comment';
      });
  },
});

export const { clearComments, clearError } = commentsSlice.actions;
export default commentsSlice.reducer;
