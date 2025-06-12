import styled from 'styled-components';

export const PlayerContainer = styled.div<{ $isFullscreen: boolean }>`
  background: ${props => props.$isFullscreen ? 'black' : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: ${props => props.$isFullscreen ? 'none' : 'blur(10px)'};
  border-radius: ${props => props.$isFullscreen ? '0' : '15px'};
  padding: ${props => props.$isFullscreen ? '0' : '1.5rem'};
  border: ${props => props.$isFullscreen ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'};
  position: ${props => props.$isFullscreen ? 'fixed' : 'relative'};
  top: ${props => props.$isFullscreen ? '0' : 'auto'};
  left: ${props => props.$isFullscreen ? '0' : 'auto'};
  width: ${props => props.$isFullscreen ? '100vw' : '100%'};
  height: ${props => props.$isFullscreen ? '100vh' : 'auto'};
  z-index: ${props => props.$isFullscreen ? '1000' : '1'};
  display: flex;
  flex-direction: column;
`;

export const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: white;
`;

export const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

export const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const PlayerWrapper = styled.div<{ $isFullscreen: boolean }>`
  position: relative;
  width: 100%;
  height: ${props => props.$isFullscreen ? 'calc(100vh - 100px)' : '500px'};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;

  .react-player {
    border-radius: 10px;
    overflow: hidden;
  }
`;

export const VideoInfo = styled.div`
  color: white;
  margin-bottom: 2rem;
`;

export const VideoTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

export const VideoDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
`;

export const VideoMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CommentsSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
`;

export const CommentsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

export const CommentForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const CommentInput = styled.textarea`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 1rem;
  color: white;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
`;

export const CommentButton = styled.button`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  min-width: 60px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CommentItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

export const CommentContent = styled.p`
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
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
  
  a {
    color: #fff;
    text-decoration: underline;
    font-weight: bold;
  }
  
  ul {
    text-align: left;
    margin-top: 1rem;
    padding-left: 1rem;
  }
  
  li {
    margin: 0.5rem 0;
  }
`;

export const SpeedSelector = styled.select`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 0.5rem;
  font-size: 0.9rem;

  option {
    background: #333;
    color: white;
  }
`;

export const VolumeSlider = styled.input`
  width: 80px;
`;

export const PlayButtonOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100; /* Increase z-index to ensure it's above all player elements */
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(102, 126, 234, 0.9); /* Use theme color on hover */
    transform: translate(-50%, -50%) scale(1.2);
    box-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
  }
  
  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }
`;

export const VideoUrlDisplay = styled.div`
  background: rgba(255, 255, 255, 0.15);
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-all;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: block;
`;
