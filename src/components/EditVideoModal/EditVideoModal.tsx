import React, { useState, useEffect } from 'react';
import { X, Edit, Link as LinkIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setShowEditModal, setSelectedVideoId } from '../../store/slices/uiSlice';
import { updateVideo, fetchVideoById } from '../../store/slices/videosSlice';
import { EditVideoRequest } from '../../types';
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
  LoadingMessage,
  UrlHint
} from './EditVideoModalStyles';

import { validateVideoUrl } from '../../utils/videoHelpers';

export const EditVideoModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedVideoId } = useAppSelector(state => state.ui);
  const { currentVideo, videos, loading } = useAppSelector(state => state.videos);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
  });
  const [originalData, setOriginalData] = useState({
    title: '',
    description: '',
    video_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find the video to edit
  const videoToEdit = currentVideo?.id === selectedVideoId 
    ? currentVideo 
    : videos.find(v => v.id === selectedVideoId);

  useEffect(() => {
    if (selectedVideoId && !videoToEdit) {
      // Fetch the video if not found in current state
      dispatch(fetchVideoById(selectedVideoId));
    }
  }, [dispatch, selectedVideoId, videoToEdit]);

  useEffect(() => {
    if (videoToEdit) {
      const data = {
        title: videoToEdit.title || '',
        description: videoToEdit.description || '',
        video_url: videoToEdit.video_url || '',
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [videoToEdit]);

  const handleClose = () => {
    dispatch(setShowEditModal(false));
    dispatch(setSelectedVideoId(null));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };  // Using the shared utility for URL validation

  // Check if any field has been changed
  const hasChanges = () => {
    return formData.title !== originalData.title ||
           formData.description !== originalData.description ||
           formData.video_url !== originalData.video_url;
  };

  // Check if at least one field has content
  const hasValidContent = () => {
    return formData.title.trim() || 
           formData.description.trim() || 
           formData.video_url.trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVideoId) {
      setError('No video selected for editing');
      return;
    }

    // Check if there are any changes
    if (!hasChanges()) {
      setError('No changes detected');
      return;
    }

    // Check if at least one field has content
    if (!hasValidContent()) {
      setError('At least one field must have content');
      return;
    }      // Validate URL if provided
    if (formData.video_url.trim() && !validateVideoUrl(formData.video_url)) {
      setError('Please enter a valid URL from YouTube, Vimeo, Dailymotion, or a direct video file (.mp4, .webm, .ogg)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updateData: EditVideoRequest = {
        video_id: selectedVideoId,
      };
      
      // Only include fields that have values
      if (formData.title?.trim()) {
        updateData.title = formData.title.trim();
      }
      if (formData.description?.trim()) {
        updateData.description = formData.description.trim();
      }
      if (formData.video_url?.trim()) {
        updateData.video_url = formData.video_url.trim();
      }

      await dispatch(updateVideo(updateData)).unwrap();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update video. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !videoToEdit) {
    return (
      <ModalOverlay onClick={handleClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              <Edit size={24} />
              Edit Video
            </ModalTitle>
            <CloseButton onClick={handleClose}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>
          <LoadingMessage>Loading video details...</LoadingMessage>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (!videoToEdit) {
    return (
      <ModalOverlay onClick={handleClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              <Edit size={24} />
              Edit Video
            </ModalTitle>
            <CloseButton onClick={handleClose}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>
          <ErrorMessage>Video not found</ErrorMessage>
          <ButtonGroup>
            <Button type="button" $variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <Edit size={24} />
            Edit Video
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="edit-title">Video Title</Label>
            <Input
              id="edit-title"
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
            <Label htmlFor="edit-description">Description</Label>
            <TextArea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what this video is about, what learners will gain..."
              maxLength={500}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="edit-video_url">Video URL</Label>
            <Input
              id="edit-video_url"
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
              disabled={isSubmitting || !hasChanges() || !hasValidContent()}
            >
              {isSubmitting ? 'Updating...' : 'Update Video'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};