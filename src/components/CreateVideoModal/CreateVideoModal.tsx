import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import { useAppDispatch } from '../../hooks/redux';
import { setShowCreateModal } from '../../store/slices/uiSlice';
import { createVideo, fetchVideos } from '../../store/slices/videosSlice';
import { CreateVideoRequest } from '../../types';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  Label,
  Input,
  TextArea,
  ButtonGroup,
  Button,
  ErrorMessage,
  UrlHint
} from './CreateVideoModalStyles';

import { getUserId } from '../../utils/environment';
import { validateVideoUrl } from '../../utils/videoHelpers';

// Get user ID from environment variables
const USER_ID = getUserId();

export const CreateVideoModal = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    dispatch(setShowCreateModal(false));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!formData.title?.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.description?.trim()) {
      setError('Description is required');
      return;
    }
    
    if (!formData.video_url?.trim()) {
      setError('Video URL is required');
      return;
    }
    if (!validateVideoUrl(formData.video_url)) {
      setError('Please enter a valid URL from YouTube, Vimeo, Dailymotion, or a direct video file (.mp4, .webm, .ogg)');
      return;
    }

    setIsSubmitting(true);
    setError(null);    try {
      const videoData: CreateVideoRequest = {
        user_id: USER_ID,
        title: formData.title?.trim() || '',
        description: formData.description?.trim() || '',
        video_url: formData.video_url?.trim() || '',
      };

      await dispatch(createVideo(videoData)).unwrap();
      
      // Refresh videos list to show the new video immediately
      dispatch(fetchVideos(USER_ID));
      
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create video. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <Upload size={24} />
            Create New Video
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a descriptive title for your video"
              maxLength={100}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what this video is about, what learners will gain..."
              maxLength={500}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="video_url">Video URL</Label>
            <Input
              id="video_url"
              name="video_url"
              type="url"
              value={formData.video_url}
              onChange={handleInputChange}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              required
            />            <UrlHint>
              <LinkIcon size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              <strong>Supported platforms:</strong>
              <ul style={{ marginTop: '0.5rem', marginBottom: '0', paddingLeft: '1.5rem' }}>
                <li>YouTube (youtube.com, youtu.be)</li>
                <li>Vimeo (vimeo.com)</li>
                <li>Dailymotion (dailymotion.com, dai.ly)</li>
                <li>Direct video files (.mp4, .webm, .ogg)</li>
              </ul>
            </UrlHint>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              $variant="primary" 
              disabled={isSubmitting || !formData.title?.trim() || !formData.description?.trim() || !formData.video_url?.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Video'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};
