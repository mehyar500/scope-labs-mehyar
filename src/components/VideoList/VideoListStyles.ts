import styled from 'styled-components';

export const VideoListContainer = styled.div`
  padding: 2rem 0;
`;

export const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

export const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export const VideoCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const VideoThumbnail = styled.div`
  width: 100%;
  height: 180px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    z-index: 2;
  }
`;

export const PlayButton = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  transition: all 0.3s ease;
  position: relative;

  ${VideoCard}:hover & {
    background: white;
    transform: scale(1.1);
  }
`;

export const VideoInfo = styled.div`
  color: white;
`;

export const VideoTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

export const VideoDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: white;
  font-size: 1.2rem;
`;

export const ErrorContainer = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 10px;
  padding: 1.5rem;
  color: #ff6b6b;
  text-align: center;
  margin: 2rem 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  padding: 3rem;
`;
