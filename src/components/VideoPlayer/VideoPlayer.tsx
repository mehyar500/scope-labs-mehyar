import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import React Player with all needed players
import ReactPlayer from 'react-player';
import 'react-player/youtube';
import 'react-player/vimeo';
import 'react-player/dailymotion';
import 'react-player/file';

import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Edit,
  MessageCircle,
  Send,
  User,
  Clock,
  Play,
  Pause
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchVideoById, setCurrentVideo } from '../../store/slices/videosSlice';
import { fetchComments, createComment } from '../../store/slices/commentsSlice';
import { setFullscreen, setPlaybackSpeed, setVolume, setShowEditModal, setSelectedVideoId } from '../../store/slices/uiSlice';
import { CreateCommentRequest } from '../../types';
import { getUserId } from '../../utils/environment';
import { getVideoType, fixVideoUrl } from '../../utils/videoHelpers';
import {
  PlayerContainer,
  PlayerHeader,
  BackButton,
  PlayerControls,
  ControlButton,
  PlayerWrapper,
  VideoInfo,
  VideoTitle,
  VideoDescription,
  VideoMeta,
  MetaItem,
  CommentsSection,
  CommentsHeader,
  CommentForm,
  CommentInput,
  CommentButton,
  CommentsList,
  CommentItem,
  CommentHeader,
  CommentContent,
  LoadingContainer,
  ErrorContainer,
  SpeedSelector,
  VolumeSlider,
  PlayButtonOverlay,
  VideoUrlDisplay
} from './VideoPlayerStyles';

export const VideoPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentVideo, loading: videoLoading, error: videoError } = useAppSelector(state => state.videos);
  const { comments, loading: commentsLoading } = useAppSelector(state => state.comments);
  const { isFullscreen, playbackSpeed, volume } = useAppSelector(state => state.ui);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchVideoById(id));
      dispatch(fetchComments(id));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    if (isFullscreen) {
      dispatch(setFullscreen(false));
    } else {
      navigate('/');
    }
  };

  const handleFullscreen = () => {
    dispatch(setFullscreen(!isFullscreen));
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPlaybackSpeed(parseFloat(e.target.value)));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(setVolume(newVolume));
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      dispatch(setVolume(1));
      setIsMuted(false);
    } else {
      dispatch(setVolume(0));
      setIsMuted(true);
    }
  };

  const handleEditVideo = () => {
    if (currentVideo) {
      dispatch(setSelectedVideoId(currentVideo.id));
      dispatch(setShowEditModal(true));
    }
  };
  const handlePlayPause = () => {
    // Toggle playing state and log for debugging
    const newPlayingState = !isPlaying;
    console.log('Play button clicked, setting isPlaying to:', newPlayingState);
    console.log('Current video URL:', currentVideo?.video_url);
    setIsPlaying(newPlayingState);
  };  const handlePlayerError = (error: any) => {
    console.error('Video player error:', error);
    
    // Try to determine the type of error for more helpful messages
    let errorMessage = 'Failed to load video. ';
    const videoType = currentVideo?.video_url ? getVideoType(currentVideo.video_url) : 'unknown';
    
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
      // File specific errors
      else if (videoType === 'file') {
        errorMessage += 'Media file playback error. The file may be corrupted or in an unsupported format.';
      }
      // Generic error
      else {
        errorMessage += 'Please check the video URL or try a different browser.';
      }
    } else {
      errorMessage += 'Please check the video URL or try a different browser.';
    }
    
    setPlayerError(errorMessage);
    
    // Reset playing state on error
    setIsPlaying(false);
  };

  const handlePlayerReady = () => {
    console.log('Player ready event fired');
    setPlayerError(null);
    
    // Set isPlaying to true to auto-play when ready
    // Only if not already playing
    if (!isPlaying) {
      console.log('Setting isPlaying to true after player ready');
      setIsPlaying(true);
    }
    
    if (currentVideo?.video_url) {
      console.log('Video ready to play:', currentVideo.video_url);
    }
  };  // Validate and fix video URL if needed
  useEffect(() => {
    if (currentVideo?.video_url) {
      console.log('Current video URL:', currentVideo.video_url);
      const canPlay = ReactPlayer.canPlay(currentVideo.video_url);
      console.log('ReactPlayer can play this URL:', canPlay);
      
      if (canPlay) {
        // If ReactPlayer can play the URL, clear any previous error
        setPlayerError(null);
      } else {
        // Try to fix the URL using our utility
        const fixedUrl = fixVideoUrl(currentVideo.video_url);
        
        if (fixedUrl !== currentVideo.video_url) {
          console.log(`Attempting to fix URL: ${currentVideo.video_url} → ${fixedUrl}`);
          dispatch(setCurrentVideo({
            ...currentVideo,
            video_url: fixedUrl
          }));
          return; // Exit early as we're updating the state which will trigger this effect again
        }
        
        // If we couldn't fix it, show an error
        setPlayerError('This video URL format is not supported. Try a YouTube, Vimeo, Dailymotion URL or direct video file (.mp4, .webm, .ogg).');
      }
    }
  }, [currentVideo, dispatch]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;

    setSubmittingComment(true);
    try {      const commentData: CreateCommentRequest = {
        video_id: id,
        user_id: getUserId(),
        content: commentText.trim(),
      };
      
      await dispatch(createComment(commentData));
      setCommentText('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Unknown date';
    }
  };

  if (videoLoading) {
    return (
      <LoadingContainer>
        Loading video...
      </LoadingContainer>
    );
  }

  if (videoError || !currentVideo) {
    return (
      <div>
        <PlayerHeader>
          <BackButton onClick={handleBack}>
            <ArrowLeft size={20} />
          </BackButton>
        </PlayerHeader>
        <ErrorContainer>
          Error loading video: {videoError || 'Video not found'}
        </ErrorContainer>
      </div>
    );
  }

  return (
    <PlayerContainer $isFullscreen={isFullscreen}>
      <PlayerHeader>
        <BackButton onClick={handleBack}>
          <ArrowLeft size={20} />
        </BackButton>
        <PlayerControls>
          <ControlButton onClick={handlePlayPause}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </ControlButton>
          
          <SpeedSelector value={playbackSpeed} onChange={handleSpeedChange}>
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </SpeedSelector>
          
          <ControlButton onClick={toggleMute}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </ControlButton>
          
          <VolumeSlider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />
          
          <ControlButton onClick={handleEditVideo}>
            <Edit size={20} />
          </ControlButton>
          
          <ControlButton onClick={handleFullscreen}>
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </ControlButton>
        </PlayerControls>
      </PlayerHeader>      {/* Always show video URL regardless of fullscreen state */}      <VideoUrlDisplay>
        <div>
          {currentVideo.video_url ? (
            <>
              <strong>Source:</strong> {getVideoType(currentVideo.video_url).toUpperCase()} | <strong>URL:</strong>{' '}
              <a href={currentVideo.video_url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>
                {currentVideo.video_url}
              </a>
            </>
          ) : (
            <span style={{ color: '#ff6b6b' }}>No video URL provided</span>
          )}
        </div>
      </VideoUrlDisplay>

      <PlayerWrapper $isFullscreen={isFullscreen}>        {playerError ? (
          <ErrorContainer>
            <h3>{playerError}</h3>
            <p>Try the following:</p>
            <ul>
              <li>Make sure the URL format is correct for the platform:</li>
              <ul>
                <li>YouTube: https://www.youtube.com/watch?v=VIDEO_ID</li>
                <li>Vimeo: https://vimeo.com/VIDEO_ID</li>
                <li>Dailymotion: https://www.dailymotion.com/video/VIDEO_ID</li>
                <li>Direct files: Link ending with .mp4, .webm, or .ogg</li>
              </ul>
              <li>Check if the video is available in your region</li>
              <li>Ensure the video allows embedding (some creators restrict this)</li>
              <li>Try opening the URL directly in a browser to confirm it works</li>
            </ul>
            <p>Current URL: <a href={currentVideo.video_url} target="_blank" rel="noopener noreferrer">{currentVideo.video_url}</a></p>
          </ErrorContainer>
        ) : (<ReactPlayer
            url={currentVideo.video_url}
            width="100%"
            height="100%"
            controls={true}
            playing={isPlaying}
            playbackRate={playbackSpeed}
            volume={volume}
            muted={isMuted}
            onError={handlePlayerError}
            onReady={handlePlayerReady}
            onPlay={() => console.log('Video playback started')}
            onPause={() => console.log('Video playback paused')}
            config={{
              youtube: {
                playerVars: { 
                  showinfo: 1,
                  origin: window.location.origin,
                  autoplay: isPlaying ? 1 : 0,
                  iv_load_policy: 3,
                  modestbranding: 1,
                  enablejsapi: 1,
                  rel: 0, // Don't show related videos
                  fs: 1 // Allow fullscreen
                }
              },
              vimeo: {
                playerOptions: {
                  autoplay: isPlaying,
                  muted: isMuted,
                  controls: true,
                  responsive: true,
                  dnt: true // Do not track
                }
              },
              dailymotion: {
                params: {
                  controls: true,
                  autoplay: isPlaying,
                  mute: isMuted
                }
              },              file: {
                attributes: {
                  controlsList: 'nodownload',
                  autoPlay: isPlaying,
                  muted: isMuted
                },
                forceVideo: true,
                tracks: []
              }
            }}
          />
        )}        {/* Always show play button overlay if not playing or if there's an error */}
        {(!isPlaying || playerError) && (
          <PlayButtonOverlay 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('Play button overlay clicked');
              if (!playerError) {
                handlePlayPause();
              } else {
                // If there's an error, try reloading the video
                setPlayerError(null);
                // Small delay before attempting to play again
                setTimeout(() => {
                  console.log('Attempting to reload video after error');
                  setIsPlaying(true);
                }, 300);
              }
            }}
            role="button"
            aria-label="Play video"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePlayPause();
              }
            }}
          >
            <Play size={48} color="white" strokeWidth={1.5} />
            {playerError && <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Try Again</div>}
          </PlayButtonOverlay>
        )}
      </PlayerWrapper>

      {!isFullscreen && (
        <>
          <VideoInfo>
            <VideoTitle>{currentVideo.title}</VideoTitle>
            <VideoDescription>{currentVideo.description}</VideoDescription>
            
            <VideoMeta>
              <MetaItem>
                <User size={16} />
                {currentVideo.user_id}
              </MetaItem>
              {currentVideo.created_at && (
                <MetaItem>
                  <Clock size={16} />
                  {formatDate(currentVideo.created_at)}
                </MetaItem>
              )}
            </VideoMeta>
          </VideoInfo>

          <CommentsSection>
            <CommentsHeader>
              <MessageCircle size={20} />
              Comments ({comments.length})
            </CommentsHeader>

            <CommentForm onSubmit={handleCommentSubmit}>
              <CommentInput
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                required
              />
              <CommentButton type="submit" disabled={submittingComment || !commentText.trim()}>
                <Send size={20} />
              </CommentButton>
            </CommentForm>

            <CommentsList>
              {comments.map((comment) => (
                <CommentItem key={comment.id}>
                  <CommentHeader>
                    <MetaItem>
                      <User size={14} />
                      {comment.user_id}
                    </MetaItem>
                    <MetaItem>
                      <Clock size={14} />
                      {formatDate(comment.created_at)}
                    </MetaItem>
                  </CommentHeader>
                  <CommentContent>{comment.content}</CommentContent>
                </CommentItem>
              ))}
              
              {comments.length === 0 && !commentsLoading && (
                <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>
                  No comments yet. Be the first to comment!
                </div>
              )}
            </CommentsList>
          </CommentsSection>
        </>
      )}
    </PlayerContainer>
  );
};
