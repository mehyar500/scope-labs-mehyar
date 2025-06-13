/**
 * Video player error handling utilities
 */
import { getVideoType } from './videoHelpers';

/**
 * Generates a user-friendly error message based on video type and error details
 * @param error The error object from the video player
 * @param videoUrl The URL of the video that failed to load
 * @returns A formatted error message
 */
export const getVideoErrorMessage = (error: any, videoUrl: string): string => {
  let errorMessage = 'Failed to load video. ';
  const videoType = videoUrl ? getVideoType(videoUrl) : 'unknown';
  
  if (error && typeof error === 'object') {
    // YouTube specific errors
    if (videoType === 'youtube') {
      if (error.data === 101 || error.data === 150) {
        errorMessage += 'This video cannot be played because embedding has been disabled by the owner.';
      } else if (error.data === 2) {
        errorMessage += 'Invalid YouTube video ID or URL format.';
      } else if (error.data === 5) {
        errorMessage += 'This YouTube video cannot be played in your browser.';
      } else if (error.data === 100) {
        errorMessage += 'This YouTube video has been removed or is private.';
      } else {
        errorMessage += `YouTube player error (${error.data || 'unknown'}). Please try a different video.`;
      }
    }
    // Vimeo specific errors
    else if (videoType === 'vimeo') {
      errorMessage += 'Vimeo video playback error. The video may be private or have embedding disabled.';
    }
    // Dailymotion specific errors
    else if (videoType === 'dailymotion') {
      errorMessage += 'Dailymotion video playback error. The video may be private or region-restricted.';
    }
    // Facebook specific errors
    else if (videoType === 'facebook') {
      errorMessage += 'Facebook video playback error. The video may be private or have restricted sharing settings.';
    }
    // Twitch specific errors
    else if (videoType === 'twitch') {
      errorMessage += 'Twitch video playback error. The stream may be offline or the video may be subscriber-only.';
    }
    // SoundCloud specific errors
    else if (videoType === 'soundcloud') {
      errorMessage += 'SoundCloud audio playback error. The track may be private or region-restricted.';
    }
    // File specific errors
    else if (videoType === 'file') {
      errorMessage += 'Media file playback error. The file may be corrupted, in an unsupported format, or the server may not allow direct access.';
    }
    // Generic error
    else {
      errorMessage += 'Please check the video URL or try a different browser.';
    }
  } else {
    errorMessage += 'Please check the video URL or try a different browser.';
  }
  
  return errorMessage;
};

/**
 * Generates troubleshooting suggestions for video errors
 * @param videoUrl The URL of the video that failed to load
 * @returns An array of troubleshooting suggestions
 */
export const getVideoTroubleshootingSuggestions = (videoUrl: string): string[] => {
  return [
    'Make sure the URL format is correct for the platform:',
    '  • YouTube: https://www.youtube.com/watch?v=VIDEO_ID',
    '  • Vimeo: https://vimeo.com/VIDEO_ID',
    '  • Dailymotion: https://www.dailymotion.com/video/VIDEO_ID',
    '  • Direct files: Link ending with .mp4, .webm, or .ogg',
    'Check if the video is available in your region',
    'Ensure the video allows embedding (some creators restrict this)',
    'Try opening the URL directly in a browser to confirm it works'
  ];
};

/**
 * Common date formatting utility
 * @param dateString The date string to format
 * @returns Formatted date string or fallback
 */
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return 'Unknown date';
  }
};

/**
 * Common date formatting for video lists (shorter format)
 * @param dateString The date string to format
 * @returns Formatted date string or fallback
 */
export const formatDateShort = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'Unknown date';
  }
};
