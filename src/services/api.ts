import axios from 'axios';
import {
  Video,
  CreateVideoRequest,
  EditVideoRequest,
  CreateCommentRequest,
  GetVideosResponse,
  GetCommentsResponse,
} from '../types';
import { getApiBaseUrl } from '../utils/environment';

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Video endpoints
export const createVideo = async (videoData: CreateVideoRequest): Promise<any> => {
  const response = await apiClient.post('/videos', videoData);
  return response.data;
};

export const getUserVideos = async (userId: string): Promise<GetVideosResponse> => {
  const response = await apiClient.get(`/videos?user_id=${userId}`);
  return response.data;
};

export const getSingleVideo = async (videoId: string, userId: string): Promise<Video> => {
  const response = await apiClient.get(`/videos/single?video_id=${videoId}&user_id=${userId}`);
  return response.data.video || response.data;
};

export const editVideo = async (videoData: EditVideoRequest): Promise<any> => {
  const response = await apiClient.put('/videos', videoData);
  return response.data;
};

// Comment endpoints
export const createComment = async (commentData: CreateCommentRequest): Promise<any> => {
  const response = await apiClient.post('/videos/comments', commentData);
  return response.data;
};

export const getVideoComments = async (videoId: string): Promise<GetCommentsResponse> => {
  const response = await apiClient.get(`/videos/comments?video_id=${videoId}`);
  return response.data;
};
