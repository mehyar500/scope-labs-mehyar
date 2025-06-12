import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { VideoList } from './components/VideoList/VideoList';
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
import { CreateVideoModal } from './components/CreateVideoModal/CreateVideoModal';
import { EditVideoModal } from './components/EditVideoModal/EditVideoModal';
import { SplashPage } from './components/SplashPage/SplashPage';
import { useAppSelector } from './hooks/redux';
import { AppContainer, MainContent, ContentWrapper } from './AppStyles';

function App() {
  const { showCreateModal, showEditModal } = useAppSelector((state) => state.ui);
  const location = useLocation();
  const isOnSplashPage = location.pathname === '/';

  return (
    <AppContainer>
      {!isOnSplashPage && <Header />}
      <MainContent $hasPadding={!isOnSplashPage}>
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/videos" element={
              <div className="container">
                <VideoList />
              </div>
            } />
            <Route path="/video/:id" element={
              <div className="container">
                <VideoPlayer />
              </div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ContentWrapper>
      </MainContent>
      
      {/* Modals */}
      {showCreateModal && <CreateVideoModal />}
      {showEditModal && <EditVideoModal />}
    </AppContainer>
  );
}

export default App;
