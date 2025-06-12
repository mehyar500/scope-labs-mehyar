export interface Video {
  id: string;
  user_id: string;
  title: string;
  description: string;
  video_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVideoRequest {
  user_id: string;
  title: string;
  description: string;
  video_url: string;
}

export interface EditVideoRequest {
  video_id: string;
  title?: string;
  description?: string;
  video_url?: string;
}

export interface Comment {
  id: string;
  video_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface CreateCommentRequest {
  video_id: string;
  user_id: string;
  content: string;
}

// API response types
export interface GetVideosResponse {
  videos: Video[];
}

export interface GetCommentsResponse {
  comments: Comment[];
}

export interface ApiError {
  detail: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
