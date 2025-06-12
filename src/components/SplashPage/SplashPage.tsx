import React from 'react';
import { 
  Play, 
  BookOpen, 
  Users, 
  Video, 
  MessageCircle, 
  ArrowRight, 
  Star,
  Zap,
  Globe,
  Heart
} from 'lucide-react';
import {
  SplashContainer,
  Header,
  HeaderContent,
  Logo,
  LogoIcon,
  GetStartedButton,
  MainContent,
  HeroSection,
  MainTitle,
  Subtitle,
  CTASection,
  PrimaryButton,
  SecondaryButton,
  FeaturesSection,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  StatsSection,
  StatItem,
  StatNumber,
  StatLabel,
  Footer,
  FooterContent,
  FooterText
} from './SplashPageStyles';

export const SplashPage: React.FC = () => {
  return (
    <SplashContainer>
      <Header>
        <HeaderContent>
          <Logo>
            <LogoIcon>
              <BookOpen size={28} color="white" />
            </LogoIcon>
            EduPlayer
          </Logo>
          <GetStartedButton to="/videos">
            Get Started
            <ArrowRight size={20} />
          </GetStartedButton>
        </HeaderContent>
      </Header>

      <MainContent>
        <HeroSection>
          <MainTitle>
            Learn with <span>Interactive</span> Educational Videos
          </MainTitle>
          <Subtitle>
            Discover, create, and share educational content with our modern video platform. 
            Engage with interactive features and build knowledge together.
          </Subtitle>
          
          <CTASection>
            <PrimaryButton to="/videos">
              <Play size={24} />
              Explore Videos
            </PrimaryButton>
            <SecondaryButton to="/videos">
              <Video size={24} />
              Create Content
            </SecondaryButton>
          </CTASection>
        </HeroSection>

        <FeaturesSection>
          <FeatureCard>
            <FeatureIcon>
              <Video size={32} color="white" />
            </FeatureIcon>
            <FeatureTitle>Smart Video Player</FeatureTitle>
            <FeatureDescription>
              Full-screen playback with speed controls, volume adjustment, and support for multiple video platforms including YouTube, Vimeo, and more.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <MessageCircle size={32} color="white" />
            </FeatureIcon>
            <FeatureTitle>Interactive Comments</FeatureTitle>
            <FeatureDescription>
              Engage with content through real-time commenting. Share insights, ask questions, and learn from the community.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Zap size={32} color="white" />
            </FeatureIcon>
            <FeatureTitle>Easy Creation</FeatureTitle>
            <FeatureDescription>
              Create and edit educational videos with our intuitive interface. Share your knowledge with learners worldwide.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Globe size={32} color="white" />
            </FeatureIcon>
            <FeatureTitle>Responsive Design</FeatureTitle>
            <FeatureDescription>
              Beautiful, modern interface that works seamlessly across all devices. Learn anywhere, anytime.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Users size={32} color="white" />
            </FeatureIcon>
            <FeatureTitle>Community Driven</FeatureTitle>
            <FeatureDescription>
              Join a community of educators and learners. Discover new perspectives and collaborative learning opportunities.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Star size={32} color="white" />
            </FeatureIcon>
            <FeatureTitle>Quality Content</FeatureTitle>
            <FeatureDescription>
              Curated educational content designed to enhance learning experiences and promote knowledge sharing.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesSection>

        <StatsSection>
          <StatItem>
            <StatNumber>100+</StatNumber>
            <StatLabel>Educational Videos</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>50+</StatNumber>
            <StatLabel>Active Learners</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>24/7</StatNumber>
            <StatLabel>Available Access</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>∞</StatNumber>
            <StatLabel>Learning Potential</StatLabel>
          </StatItem>
        </StatsSection>
      </MainContent>

      <Footer>
        <FooterContent>
          <FooterText>
            Built with <Heart size={16} color="#ff6b6b" /> for educational excellence
          </FooterText>
          <FooterText>
            © 2024 EduPlayer - Empowering learners worldwide
          </FooterText>
        </FooterContent>
      </Footer>
    </SplashContainer>
  );
};

export default SplashPage;
