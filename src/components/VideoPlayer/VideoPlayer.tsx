import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
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
import { fetchVideoById } from '../../store/slices/videosSlice';
import { fetchComments, createComment } from '../../store/slices/commentsSlice';
import { setFullscreen, setPlaybackSpeed, setVolume, setShowEditModal, setSelectedVideoId } from '../../store/slices/uiSlice';
import { CreateCommentRequest } from '../../types';
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
    setIsPlaying(!isPlaying);
  };

  const handlePlayerError = (error: any) => {
    console.error('Video player error:', error);
    setPlayerError('Failed to load video. Please check the video URL.');
  };

  const handlePlayerReady = () => {
    setPlayerError(null);
    setIsPlaying(true);
    if (currentVideo?.video_url) {
      console.log('Video ready to play:', currentVideo.video_url);
    }
  };

  // Debug video URL
  useEffect(() => {
    if (currentVideo?.video_url) {
      console.log('Current video URL:', currentVideo.video_url);
      console.log('ReactPlayer can play this URL:', ReactPlayer.canPlay(currentVideo.video_url));
    }
  }, [currentVideo]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;

    setSubmittingComment(true);
    try {
      const commentData: CreateCommentRequest = {
        video_id: id,
        user_id: 'anonymous_user', // You can make this dynamic
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
      </PlayerHeader>

      {!isFullscreen && (
        <VideoUrlDisplay>
          Video URL: {currentVideo.video_url}
        </VideoUrlDisplay>
      )}

      <PlayerWrapper $isFullscreen={isFullscreen}>
        {playerError ? (
          <ErrorContainer>
            {playerError}
          </ErrorContainer>
        ) : (
          <ReactPlayer
            url={currentVideo.video_url}
            width="100%"
            height="100%"
            controls
            playing={isPlaying}
            light={true}
            playbackRate={playbackSpeed}
            volume={volume}
            muted={isMuted}
            onError={handlePlayerError}
            onReady={handlePlayerReady}
            config={{
              youtube: {
                playerVars: { showinfo: 1 }
              }
            }}
          />
        )}
        {!isPlaying && (
          <PlayButtonOverlay onClick={handlePlayPause}>
            <Play size={48} color="white" />
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
