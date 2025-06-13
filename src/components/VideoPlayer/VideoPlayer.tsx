import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import React Player with all needed players
import ReactPlayer from 'react-player';
import 'react-player/youtube';
import 'react-player/vimeo';
import 'react-player/dailymotion';
import 'react-player/file';
import 'react-player/facebook';
import 'react-player/twitch';
import 'react-player/soundcloud';

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
import { fetchVideoById, setCurrentVideo, clearError } from '../../store/slices/videosSlice';
import { fetchComments, createComment } from '../../store/slices/commentsSlice';
import { setFullscreen, setPlaybackSpeed, setVolume, setShowEditModal, setSelectedVideoId } from '../../store/slices/uiSlice';
import { CreateCommentRequest } from '../../types';
import { getUserId } from '../../utils/environment';
import { getVideoType } from '../../utils/videoHelpers';
import { getVideoErrorMessage, getVideoTroubleshootingSuggestions, formatDate } from '../../utils/errorHelpers';
import { getPlayerConfig, validateAndFixUrl } from '../../utils/playerHelpers';
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

export const VideoPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentVideo, videos, loading: videoLoading, error: videoError } = useAppSelector(state => state.videos);
  const { comments, loading: commentsLoading } = useAppSelector(state => state.comments);
  const { isFullscreen, playbackSpeed, volume } = useAppSelector(state => state.ui);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);  const [playerError, setPlayerError] = useState<string | null>(null);

  // check if we have the video data and fetch if needed
  useEffect(() => {
    if (id) {
      
      // if currentVideo exists and matches the id, we're good
      if (currentVideo && currentVideo.id === id) {
        return;
      }
      
      // first check if video is already in the videos array
      const existingVideo = videos.find(v => v.id === id);
      if (existingVideo && existingVideo.video_url) {
        // set it as current video immediately
        dispatch(setCurrentVideo(existingVideo));
      } else {
        // fetch from api - this is essential for page refreshes
        dispatch(fetchVideoById({ videoId: id, userId: getUserId() }));
      }
    }
  }, [dispatch, id, currentVideo, videos, videoLoading, videoError]);
  // separate effect for fetching comments
  useEffect(() => {
    if (id) {
      dispatch(fetchComments(id));
    }
  }, [dispatch, id]);

  // clear video error when we successfully have a currentVideo
  useEffect(() => {
    if (currentVideo && currentVideo.id === id) {
      setPlayerError(null);
      // clear any redux video error as well
      if (videoError) {
        dispatch(clearError());
      }
    }
  }, [currentVideo, id, videoError, dispatch]);

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
    // toggle playing state and log for debugging
    const newPlayingState = !isPlaying;
    console.log('Play button clicked, setting isPlaying to:', newPlayingState);
    console.log('Current video URL:', currentVideo?.video_url);
    setIsPlaying(newPlayingState);
  };  const handlePlayerError = (error: any) => {
    console.error('Video player error:', error);
    
    const errorMessage = getVideoErrorMessage(error, currentVideo?.video_url || '');
    setPlayerError(errorMessage);
    
    // reset playing state on error
    setIsPlaying(false);
  };

  const handlePlayerReady = () => {
    console.log('Player ready event fired');
    setPlayerError(null);
      // set isPlaying to true to auto-play when ready
    // only if not already playing
    if (!isPlaying) {
      console.log('Setting isPlaying to true after player ready');
      setIsPlaying(true);
    }
    
    if (currentVideo?.video_url) {
      console.log('Video ready to play:', currentVideo.video_url);
    }
  };  // validate and fix video url if needed
  useEffect(() => {
    if (currentVideo?.video_url) {
      console.log('Current video URL:', currentVideo.video_url);
      
      // use enhanced validation and fixing
      const { isValid, fixedUrl, error } = validateAndFixUrl(currentVideo.video_url);
      
      if (isValid) {
        // check if ReactPlayer can play this url
        const canPlay = ReactPlayer.canPlay(fixedUrl);
        console.log('ReactPlayer can play this URL:', canPlay);
        
        if (canPlay) {
          // if the url was fixed, update it
          if (fixedUrl !== currentVideo.video_url) {
            console.log(`URL was fixed: ${currentVideo.video_url} → ${fixedUrl}`);
            dispatch(setCurrentVideo({
              ...currentVideo,
              video_url: fixedUrl
            }));
            return;
          }
          setPlayerError(null);
        } else {
          setPlayerError('This video URL format is not supported by the player. Try a different URL or platform.');
        }
      } else {
        setPlayerError(error || 'Invalid video URL format.');
      }
    } else if (currentVideo) {
      // Video exists but no URL
      setPlayerError('No video URL provided for this video.');
    }
  }, [currentVideo, dispatch]);  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;

    setSubmittingComment(true);
    try {
      const commentData: CreateCommentRequest = {
        video_id: id,
        user_id: getUserId(),
        content: commentText.trim(),
      };
      
      await dispatch(createComment(commentData));
      setCommentText('');
      
      // Refresh comments list to show the new comment immediately
      dispatch(fetchComments(id));
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };
  if (videoLoading) {
    return (
      <LoadingContainer>
        Loading video...
      </LoadingContainer>
    );
  }

  // Show error only if we have an error AND we're not loading AND we've actually tried to fetch
  if (videoError && !videoLoading && (!currentVideo || currentVideo.id !== id)) {
    return (
      <div>
        <PlayerHeader>
          <BackButton onClick={handleBack}>
            <ArrowLeft size={20} />
          </BackButton>
        </PlayerHeader>
        <ErrorContainer>
          Error loading video: {videoError}
          <br />
          <button 
            onClick={() => {
              if (id) {
                dispatch(fetchVideoById({ videoId: id, userId: getUserId() }));
              }
            }}
            style={{ 
              marginTop: '10px', 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Retry
          </button>
        </ErrorContainer>
      </div>
    );
  }
  // If no current video but we have an ID and we're not in an error state, show loading while we fetch
  if (!currentVideo && id && !videoError && !videoLoading) {
    return (
      <LoadingContainer>
        Loading video...
      </LoadingContainer>
    );
  }

  // If no current video and no ID, that's an error
  if (!currentVideo) {
    return (
      <div>
        <PlayerHeader>
          <BackButton onClick={handleBack}>
            <ArrowLeft size={20} />
          </BackButton>
        </PlayerHeader>
        <ErrorContainer>
          Video not found
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
              {getVideoTroubleshootingSuggestions(currentVideo.video_url).map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
            <p>Current URL: <a href={currentVideo.video_url} target="_blank" rel="noopener noreferrer">{currentVideo.video_url}</a></p>
          </ErrorContainer>
        ) : (          <ReactPlayer
            url={currentVideo.video_url || ''}
            width="100%"
            height="100%"
            controls={true}
            playing={isPlaying}
            playbackRate={playbackSpeed}
            volume={volume}
            muted={isMuted}
            onError={handlePlayerError}
            onReady={handlePlayerReady}
            onPlay={() => {
              console.log('Video playback started');
              setIsPlaying(true);
            }}
            onPause={() => {
              console.log('Video playback paused');
              setIsPlaying(false);
            }}
            onBuffer={() => console.log('Video buffering')}
            onSeek={(seconds: number) => console.log('Video seeked to:', seconds)}
            config={getPlayerConfig(currentVideo.video_url, isPlaying, isMuted)}
          />
        )}        {/* Always show play button overlay if not playing or if there's an error */}        {(!isPlaying || playerError) && (
          <PlayButtonOverlay 
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
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
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePlayPause();
              }
            }}
          >
            <Play size={48} />
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

            <CommentForm onSubmit={handleCommentSubmit}>              <CommentInput
                value={commentText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
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
