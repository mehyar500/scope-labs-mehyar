# Educational Video Player 

A modern, feature-rich educational video platform built with React, TypeScript, Redux Toolkit, and styled-components. This application provides a comprehensive solution for creating, managing, and viewing educational videos with an interactive commenting system.

## Solution Overview

This educational video platform is a complete React-based application that enables users to:

- **Browse & Filter Videos**: Display videos with valid URLs and show YouTube thumbnails
- **Create New Content**: Add educational videos with title, description, and video URL
- **Interactive Playback**: Full-screen video player with advanced controls (speed, volume)
- **Real-time Engagement**: Comment system for interactive learning discussions
- **Modern UI/UX**: Glass-morphism design with smooth animations and responsive layout
- **Platform Support**: YouTube, Vimeo, Dailymotion, and direct video file compatibility

### Key Technical Features

- **State Management**: Redux Toolkit for predictable state updates
- **Type Safety**: Full TypeScript implementation with strict typing
- **API Integration**: RESTful API communication with error handling
- **Responsive Design**: Mobile-first approach with modern CSS techniques
- **Performance**: Optimized builds with code splitting and lazy loading

## Platform Features

### Complete Feature Set
- **Splash Page**: Attractive landing page with feature highlights and call-to-actions
- **Video List View**: Browse videos with thumbnail previews and filtering
- **Video Creation**: Add new educational videos with validation
- **Video Player**: Full-screen playback with speed (0.5x-2x) and volume controls
- **Comments System**: Interactive commenting with real-time updates
- **Video Editing**: Modify video details with smart form validation
- **URL Filtering**: Automatically filters videos without valid URLs
- **YouTube Integration**: Shows video thumbnails for supported platforms

### echnology Stack
- **Frontend**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Styled Components
- **Video Player**: React Player
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React

## How to Build and Run

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/scope-labs-mehyar.git
   cd scope-labs-mehyar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure User ID** (Required)
   Update the `USER_ID` constant in:
   - `src/components/VideoList/VideoList.tsx` (line 153)
   - `src/components/CreateVideoModal/CreateVideoModal.tsx` (line 295)
   
   Replace `'mehyar_alkhouri'` with your name in `first_last` format (e.g., `'john_smith'`)

4. **Start the development server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

### Production Build

```bash
npm run build
```
Creates an optimized production build in the `build/` folder ready for deployment.

### Testing the Build
```bash
npm test
```
Runs the test suite to verify functionality.

## Screenshots

### 1. Splash Page - Landing Experience
![Splash Page](screenshots/splash-page.png)
*Modern landing page with feature highlights, hero section, and clear call-to-action buttons*

### 2. Video List - Browse Content
![Video List](screenshots/video-list.png)
*Grid layout showing videos with YouTube thumbnails, titles, descriptions, and metadata*

### 3. Video Player - Full Experience
![Video Player](screenshots/video-player.png)
*Complete video player with controls, comments section, and video information*

### 4. Create Video Modal - Content Creation
![Create Video Modal](screenshots/create-video.png)
*Clean form interface for adding new educational videos with validation*

### 5. Full-Screen Mode - Immersive Viewing
![Full Screen Mode](screenshots/fullscreen.png)
*Distraction-free full-screen video playback with overlay controls*

## 🔧 API Integration & Testing

### Backend Requirements
The application expects a FastAPI backend with the following endpoints:

- `POST /api/videos` - Create new video
- `GET /api/videos?user_id={userId}` - Fetch user videos  
- `GET /api/videos/single?video_id={videoId}` - Get single video
- `PUT /api/videos` - Update video
- `POST /api/videos/comments` - Create comment
- `GET /api/videos/comments?video_id={videoId}` - Get comments

### Testing Instructions

1. **Setup Backend**: Ensure your FastAPI server is running on the same domain
2. **User Configuration**: Update USER_ID constants as mentioned above
3. **Test Video URLs**: Use valid YouTube, Vimeo, or direct video URLs
4. **Feature Testing**:
   - Create videos with different URL formats
   - Test full-screen mode and playback controls
   - Add comments and verify real-time updates
   - Edit video details and check validation

### Supported Video Platforms
- YouTube (youtube.com, youtu.be)
- Vimeo (vimeo.com)
- Dailymotion (dailymotion.com)
- Direct video files (.mp4, .webm, .ogg)

## 📱 Application Architecture

```
src/
├── components/           # React UI components
│   ├── Header/          # Navigation header
│   ├── SplashPage/      # Landing page
│   ├── VideoList/       # Video browsing
│   ├── VideoPlayer/     # Video playback
│   ├── CreateVideoModal/# Video creation
│   └── EditVideoModal/  # Video editing
├── store/               # Redux state management
│   └── slices/         # Feature-based state slices
├── services/            # API communication layer
├── types/               # TypeScript definitions
└── hooks/               # Custom React hooks
```

## 🎨 Design Features

- **Glass-morphism UI**: Modern frosted glass effects with backdrop blur (not apple liquid glass haha)
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: Hover effects and seamless transitions
- **Gradient Themes**: Beautiful color gradients throughout the interface
- **Accessibility**: Semantic HTML and keyboard navigation support

## ✅ Requirements Verification

**All requirements have been successfully implemented:**

- ✅ React + TypeScript platform
- ✅ Splash page with features and CTAs
- ✅ Video list with selection capability
- ✅ Create new videos functionality
- ✅ Interactive commenting system
- ✅ Full-screen video playback
- ✅ Speed and volume controls
- ✅ Modern, intuitive UI design
- ✅ API integration with backend
- ✅ Video filtering (URLs only)
- ✅ YouTube thumbnail display

## 🚦 Quick Start Guide

1. **First Visit**: Start at the splash page to understand platform features
2. **Browse Videos**: Click "Get Started" to view the video library
3. **Create Content**: Use "Create Video" button to add new educational videos
4. **Watch & Engage**: Select videos to watch and participate in discussions
5. **Full Experience**: Use full-screen mode for immersive learning

## 📋 Additional Information

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Performance Features
- Code splitting for optimal loading
- Lazy loading of video components
- Optimized bundle size
- Responsive image loading

### Security & Validation
- Input sanitization and validation
- URL format verification
- Error boundary implementation
- Safe API error handling

---

**Built with ❤️ for educational excellence**

*This project demonstrates modern React development practices with TypeScript, Redux, and responsive design.*
