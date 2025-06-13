/**
 * validates if a url is a supported video format
 * @param url the url to validate
 * @returns boolean indicating if the url is valid and supported
 */
export const validateVideoUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    
    // check if it's a valid url first
    if (!parsedUrl.protocol.startsWith('http')) {
      return false;
    }
    
    // check for supported video platforms
    const host = parsedUrl.hostname.toLowerCase();
    
    // youtube
    if (host.includes('youtube.com') || host.includes('youtu.be')) {
      return true;    }
    
    // vimeo
    if (host.includes('vimeo.com')) {
      return true;
    }
    
    // Dailymotion
    if (host.includes('dailymotion.com') || host.includes('dai.ly')) {
      return true;
    }
    
    // Facebook
    if (host.includes('facebook.com') || host.includes('fb.watch')) {
      return true;
    }
    
    // Twitch
    if (host.includes('twitch.tv')) {
      return true;
    }
    
    // SoundCloud
    if (host.includes('soundcloud.com')) {
      return true;
    }
    
    // Direct video files
    const path = parsedUrl.pathname.toLowerCase();
    if (path.endsWith('.mp4') || path.endsWith('.webm') || path.endsWith('.ogg') || 
        path.endsWith('.mp3') || path.endsWith('.wav') || path.endsWith('.m4a')) {
      return true;
    }
    
    // If it's none of the supported formats
    return false;
  } catch {
    return false;
  }
};

/**
 * Determines the video type from a URL
 * @param url The video URL
 * @returns Type of video as a string
 */
export const getVideoType = (url: string): 'youtube' | 'vimeo' | 'dailymotion' | 'facebook' | 'twitch' | 'soundcloud' | 'file' | 'unknown' => {
  if (!url) return 'unknown';
  
  url = url.toLowerCase();
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  
  if (url.includes('dailymotion.com') || url.includes('dai.ly')) {
    return 'dailymotion';
  }
  
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return 'facebook';
  }
  
  if (url.includes('twitch.tv')) {
    return 'twitch';
  }
  
  if (url.includes('soundcloud.com')) {
    return 'soundcloud';
  }
  
  if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') || 
      url.endsWith('.mp3') || url.endsWith('.wav') || url.endsWith('.m4a') ||
      url.includes('.mp4?') || url.includes('.webm?') || url.includes('.ogg?') || 
      url.includes('.mp3?') || url.includes('.wav?') || url.includes('.m4a?')) {
    return 'file';
  }
  
  return 'unknown';
};

/**
 * Attempts to fix common URL formatting issues for different video platforms
 * @param url The original video URL
 * @returns Fixed URL if corrections could be made, original URL otherwise
 */
export const fixVideoUrl = (url: string): string => {
  if (!url) return url;
  
  try {
    url = url.trim();
    let fixedUrl = url;
    
    // YouTube URL fixing
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      try {
        const urlObj = new URL(url);
        if (url.includes('youtube.com')) {
          const videoId = urlObj.searchParams.get('v');
          if (videoId) {
            fixedUrl = `https://www.youtube.com/watch?v=${videoId}`;
          }
        } else if (url.includes('youtu.be')) {
          const videoId = url.split('/').pop()?.split('?')[0];
          if (videoId) {
            fixedUrl = `https://www.youtube.com/watch?v=${videoId}`;
          }
        }
      } catch (e) {
        console.error('Error parsing YouTube URL:', e);
      }
    }
    
    // Vimeo URL fixing
    else if (url.includes('vimeo.com')) {
      const vimeoId = url.split('/').pop();
      if (vimeoId && /^\d+$/.test(vimeoId)) {
        fixedUrl = `https://vimeo.com/${vimeoId}`;
      }
    }
    
    // Dailymotion URL fixing
    else if (url.includes('dailymotion.com') || url.includes('dai.ly')) {
      try {
        let videoId;
        if (url.includes('dai.ly')) {
          videoId = url.split('/').pop();
        } else if (url.includes('dailymotion.com/video/')) {
          videoId = url.split('/video/')[1];
          // Remove any additional parameters
          videoId = videoId.split('?')[0];
        }
        
        if (videoId) {
          fixedUrl = `https://www.dailymotion.com/video/${videoId}`;
        }
      } catch (e) {
        console.error('Error parsing Dailymotion URL:', e);
      }
    }
    
    return fixedUrl;
  } catch (e) {
    console.error('Error fixing video URL:', e);
    return url;
  }
};

/**
 * Extracts YouTube video ID from a URL
 * @param url YouTube URL
 * @returns Video ID if found, null otherwise
 */
export const getYouTubeVideoId = (url: string): string | null => {
  const regexes = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const regex of regexes) {
    const match = url.match(regex);
    if (match) return match[1];
  }
  return null;
};

/**
 * Gets the thumbnail URL for a video
 * @param videoUrl Video URL
 * @returns Thumbnail URL if available, null otherwise
 */
export const getVideoThumbnail = (videoUrl: string): string | null => {
  const videoType = getVideoType(videoUrl);
  
  // YouTube thumbnails
  if (videoType === 'youtube') {
    const videoId = getYouTubeVideoId(videoUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  
  // For other platforms, we'd need to implement their specific thumbnail APIs
  
  return null;
};
