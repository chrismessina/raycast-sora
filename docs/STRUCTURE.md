# Project Structure

This document outlines the organized structure of the Sora Raycast extension.

## Directory Organization

```
src/
├── actions/              # Reusable action handlers
│   └── videoActions.ts   # Video-related actions (delete, download, copy URL, check status)
│
├── hooks/                # Custom React hooks
│   └── useVideos.ts      # Hook for fetching and managing video list
│
├── types/                # TypeScript type definitions
│   ├── index.ts          # Type exports
│   ├── preferences.ts    # Extension preferences types
│   └── video.ts          # Video-related types
│
├── utils/                # Utility functions and API clients
│   ├── api.ts            # OpenAI Sora API client
│   └── constants.ts      # App constants (URLs, etc.)
│
├── views/                # React view components
│   ├── CreateVideoForm.tsx   # Form component for video creation
│   ├── VideoList.tsx         # List view component
│   └── VideoListItem.tsx     # Individual video list item
│
└── [commands]            # Command entry points
    ├── create-video.tsx  # Create Video command
    ├── list-videos.tsx   # List Videos command
    ├── home.ts           # Home command
    ├── explore.ts        # Explore command
    ├── view-profile.tsx  # View Profile command
    ├── go-to-profile.tsx # Go to Profile command
    └── drafts.ts         # Drafts command
```

## File Purposes

### Actions (`src/actions/`)
Reusable action handlers that encapsulate business logic and side effects.

- **videoActions.ts**: Handles video operations like delete, download, copy URL, and status checks
  - `handleDeleteVideo()` - Confirms and deletes a video
  - `handleDownloadVideo()` - Downloads video MP4 to Downloads folder
  - `handleCopyVideoUrl()` - Copies video URL to clipboard
  - `handleCheckVideoStatus()` - Polls video generation status

### Hooks (`src/hooks/`)
Custom React hooks for state management and data fetching.

- **useVideos.ts**: Manages video list state
  - Fetches videos on mount
  - Provides refresh functionality
  - Handles loading states

### Types (`src/types/`)
TypeScript type definitions for type safety.

- **video.ts**: Video-related types
  - `Video` - Video object interface
  - `VideoStatus` - Status enum
  - `VideoModel` - Model enum
  - `VideoSize` - Size type
  - `VideoListResponse` - API response type
  - `CreateVideoRequest` - Creation request type
  - `VideoFilter` - Filter enum

- **preferences.ts**: Extension preferences
  - `Preferences` - User preferences interface

### Utils (`src/utils/`)
Utility functions and API clients.

- **api.ts**: OpenAI Sora API client
  - `createVideo()` - Start video generation
  - `listVideos()` - Fetch video list
  - `getVideo()` - Get single video
  - `deleteVideo()` - Delete video
  - `downloadVideo()` - Download video content
  - `getVideoUrl()` - Get video web URL
  - `getVideoContentUrl()` - Get video download URL

- **constants.ts**: Application constants
  - `SORA_BASE_URL` - Base URL for Sora web interface

### Views (`src/views/`)
React components for UI rendering.

- **CreateVideoForm.tsx**: Form for creating new videos
  - Prompt input (2000 char limit)
  - Model selection (Sora 2 / Sora 2 Pro)
  - Resolution picker
  - Duration selector

- **VideoList.tsx**: List view with filtering
  - Search by prompt
  - Filter by status
  - Empty state handling

- **VideoListItem.tsx**: Individual video item
  - Status icon
  - Progress indicator
  - Metadata display
  - Action menu

### Commands
Entry point files that compose views, hooks, and actions.

- **create-video.tsx**: Renders `CreateVideoForm`
- **list-videos.tsx**: Composes `VideoList` with `useVideos` hook and action handlers
- **home.ts**: Opens Sora home page
- **explore.ts**: Opens Sora explore page
- **view-profile.tsx**: Opens user's profile
- **go-to-profile.tsx**: Opens specific user profile
- **drafts.ts**: Opens Sora drafts page

## Benefits of This Structure

1. **Separation of Concerns**: Each directory has a clear, single responsibility
2. **Reusability**: Actions and hooks can be used across multiple commands
3. **Testability**: Isolated functions are easier to unit test
4. **Maintainability**: Easy to locate and update specific functionality
5. **Scalability**: Clear patterns for adding new features
6. **Type Safety**: Centralized type definitions prevent inconsistencies

## Adding New Features

### Adding a New Command
1. Create command file in `src/`
2. Import necessary views, hooks, and actions
3. Compose the command using existing components
4. Add to `package.json` commands array

### Adding a New Action
1. Create function in `src/actions/`
2. Export from the actions file
3. Import and use in command files

### Adding a New View Component
1. Create component in `src/views/`
2. Define props interface
3. Import types from `src/types/`
4. Use in command files

### Adding a New Hook
1. Create hook in `src/hooks/`
2. Follow `use*` naming convention
3. Return state and methods
4. Use in command files

## Import Patterns

```typescript
// Types
import { Video, VideoFilter } from "./types";

// Utils
import { createVideo, listVideos } from "./utils/api";
import { SORA_BASE_URL } from "./utils/constants";

// Hooks
import { useVideos } from "./hooks/useVideos";

// Actions
import { handleDeleteVideo, handleDownloadVideo } from "./actions/videoActions";

// Views
import { VideoList } from "./views/VideoList";
import { CreateVideoForm } from "./views/CreateVideoForm";
```

## Old Files to Remove

After verifying everything works, you can safely delete:
- `src/types.ts` (replaced by `src/types/`)
- `src/api.ts` (replaced by `src/utils/api.ts`)
- `src/constants.ts` (replaced by `src/utils/constants.ts`)
