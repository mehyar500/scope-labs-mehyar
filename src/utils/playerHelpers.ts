/**
 * Enhanced video player configuration for better URL support
 */
import { getVideoType } from './videoHelpers';

/**
 * Get optimal player configuration based on video type
 * @param videoUrl The video URL
 * @param isPlaying Current playing state
 * @param isMuted Current muted state
 * @returns Configuration object for ReactPlayer
 */
export const getPlayerConfig = (videoUrl: string | undefined | null, isPlaying: boolean, isMuted: boolean) => {
  // Handle undefined, null, or empty videoUrl
  const safeVideoUrl = videoUrl || '';
  
  const baseConfig = {
    youtube: {
      playerVars: { 
        showinfo: 1,
        origin: window.location.origin,
        autoplay: isPlaying ? 1 : 0,
        iv_load_policy: 3,
        modestbranding: 1,
        enablejsapi: 1,
        rel: 0, // Don't show related videos
        fs: 1, // Allow fullscreen
        cc_load_policy: 1, // Show captions by default
        hl: 'en', // Interface language
        playsinline: 1, // Play inline on mobile
        controls: 1,
        disablekb: 0, // Enable keyboard controls
        loop: 0,
        start: 0,
        end: 0
      }
    },
    vimeo: {
      playerOptions: {
        autoplay: isPlaying,
        muted: isMuted,
        controls: true,
        responsive: true,
        dnt: true, // Do not track
        speed: true, // Enable speed controls
        keyboard: true, // Enable keyboard controls
        pip: true, // Picture in picture
        title: true,
        byline: true,
        portrait: false,
        loop: false,
        autopause: true,
        quality: 'auto'
      }
    },
    dailymotion: {
      params: {
        controls: true,
        autoplay: isPlaying,
        mute: isMuted,
        'queue-enable': false,
        'sharing-enable': false,
        'ui-highlight': '667eea',
        'ui-logo': false,
        'ui-start-screen-info': false,
        'ui-theme': 'dark',
        quality: 'auto'
      }
    },
    facebook: {
      appId: process.env.REACT_APP_FACEBOOK_APP_ID || '',
      version: 'v2.5',
      playerId: 'facebook-player',
      attributes: {
        'data-width': '100%',
        'data-height': '100%',
        'data-autoplay': isPlaying,
        'data-allowfullscreen': true,
        'data-show-text': false
      }
    },
    twitch: {
      options: {
        width: '100%',
        height: '100%',
        channel: '', // Will be extracted from URL
        video: '', // Will be extracted from URL
        collection: '',
        autoplay: isPlaying,
        muted: isMuted,
        time: '0h0m0s',
        parent: [window.location.hostname]
      }
    },
    soundcloud: {
      options: {
        auto_play: isPlaying,
        visual: true,
        show_artwork: true,
        show_playcount: false,
        show_user: false,
        show_comments: false,
        show_teaser: false,
        buying: false,
        liking: false,
        download: false,
        sharing: false,
        single_active: true
      }
    },
    file: {
      attributes: {
        controlsList: 'nodownload',
        autoPlay: isPlaying,
        muted: isMuted,
        playsInline: true,
        preload: 'metadata',
        crossOrigin: 'anonymous',
        controls: true,
        loop: false
      },      forceVideo: safeVideoUrl.includes('.mp4') || safeVideoUrl.includes('.webm') || safeVideoUrl.includes('.ogg'),
      forceAudio: safeVideoUrl.includes('.mp3') || safeVideoUrl.includes('.wav') || safeVideoUrl.includes('.m4a'),
      tracks: []
    }
  };

  return baseConfig;
};

/**
 * Enhanced URL validation with automatic fixing
 * @param url The URL to validate and potentially fix
 * @returns Object with validation result and potentially fixed URL
 */
export const validateAndFixUrl = (url: string): { isValid: boolean; fixedUrl: string; error?: string } => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, fixedUrl: url, error: 'URL is required' };
  }

  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return { isValid: false, fixedUrl: url, error: 'URL is required' };
  }

  // Try to create a URL object to validate basic format
  try {
    new URL(trimmedUrl);
  } catch {
    // If it fails, try adding protocol
    if (!trimmedUrl.startsWith('http')) {
      const withHttps = `https://${trimmedUrl}`;
      try {
        new URL(withHttps);
        return validateAndFixUrl(withHttps);
      } catch {
        return { isValid: false, fixedUrl: url, error: 'Invalid URL format' };
      }
    } else {
      return { isValid: false, fixedUrl: url, error: 'Invalid URL format' };
    }
  }

  const videoType = getVideoType(trimmedUrl);
  
  if (videoType === 'unknown') {
    return { 
      isValid: false, 
      fixedUrl: trimmedUrl, 
      error: 'Unsupported video platform. Please use YouTube, Vimeo, Dailymotion, or direct video files.' 
    };
  }

  return { isValid: true, fixedUrl: trimmedUrl };
};
