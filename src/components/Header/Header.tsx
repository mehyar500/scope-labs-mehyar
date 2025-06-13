import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { useAppDispatch } from '../../hooks/redux';
import { setShowCreateModal } from '../../store/slices/uiSlice';
import {
  HeaderContainer,
  HeaderContent,
  Logo,
  LogoIcon,
  Navigation,
  CreateButton
} from './HeaderStyles';

export function Header() {
  const dispatch = useAppDispatch();

  const handleCreateClick = () => {
    dispatch(setShowCreateModal(true));
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">          <LogoIcon>
            <BookOpen size={24} />
          </LogoIcon>
          EduPlayer
        </Logo>
        
        <Navigation>
          <CreateButton onClick={handleCreateClick}>
            <Plus size={20} />
            Create Video
          </CreateButton>
        </Navigation>
      </HeaderContent>
    </HeaderContainer>
  );
};
