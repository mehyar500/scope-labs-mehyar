import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchVideos } from '../../store/slices/videosSlice';
import { Video } from '../../types';
import {
  VideoListContainer,
  Title,
  VideosGrid,
  VideoCard,
  VideoThumbnail,
  PlayButton,
  VideoInfo,
  VideoTitle,
  VideoDescription,
  VideoMeta,
  MetaItem,
  LoadingContainer,
  ErrorContainer,
  EmptyState
} from './VideoListStyles';

import { getUserId } from '../../utils/environment';
import { getVideoThumbnail } from '../../utils/videoHelpers';

// Get user ID from environment variables
const USER_ID = getUserId();

export const VideoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { videos, loading, error } = useAppSelector((state) => state.videos);

  useEffect(() => {
    dispatch(fetchVideos(USER_ID));
  }, [dispatch]);
  // Filter videos to only show those with valid URLs
  const validVideos = videos.filter(video => 
    video.video_url && video.video_url.trim() !== ''
  );

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  if (loading) {
    return (
      <VideoListContainer>
        <LoadingContainer>
          Loading videos...
        </LoadingContainer>
      </VideoListContainer>
    );
  }

  if (error) {
    return (
      <VideoListContainer>
        <Title>Educational Videos</Title>
        <ErrorContainer>
          Error loading videos: {error}
        </ErrorContainer>
      </VideoListContainer>
    );
  }

  return (
    <VideoListContainer>
      <Title>Educational Videos</Title>
      {validVideos.length === 0 ? (
        <EmptyState>
          <h3>No videos found</h3>
          <p>Create your first educational video to get started!</p>
        </EmptyState>
      ) : (
        <VideosGrid>
          {validVideos.map((video: Video) => {
            const thumbnail = getVideoThumbnail(video.video_url);
            return (
              <Link key={video.id} to={`/video/${video.id}`} style={{ textDecoration: 'none' }}>
                <VideoCard>
                  <VideoThumbnail>
                    {thumbnail && (
                      <img 
                        src={thumbnail} 
                        alt={video.title}
                        onError={(e) => {
                          // Fallback to play button if thumbnail fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <PlayButton>
                      <Play size={32} color="#667eea" fill="#667eea" />
                    </PlayButton>
                  </VideoThumbnail>
                
                  <VideoInfo>
                    <VideoTitle>{video.title}</VideoTitle>
                    <VideoDescription>{video.description}</VideoDescription>
                    
                    <VideoMeta>
                      <MetaItem>
                        <User size={14} />
                        {video.user_id}
                      </MetaItem>
                      {video.created_at && (
                        <MetaItem>
                          <Clock size={14} />
                          {formatDate(video.created_at)}
                        </MetaItem>
                      )}
                    </VideoMeta>
                  </VideoInfo>
                </VideoCard>
              </Link>
            );
          })}
        </VideosGrid>
      )}
    </VideoListContainer>
  );
};
