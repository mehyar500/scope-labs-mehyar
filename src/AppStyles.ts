import styled from 'styled-components';

export const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

export const MainContent = styled.main<{ $hasPadding: boolean }>`
  padding: ${props => props.$hasPadding ? '2rem 0' : '0'};
`;

export const ContentWrapper = styled.div`
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
`;
