# Sora for Raycast

Generate and manage AI videos with OpenAI's Sora directly from Raycast.

## Features

### 🎬 Create Video
Generate stunning AI videos from text descriptions using Sora's powerful models.

- **Text-to-Video Generation**: Describe your video in up to 2,000 characters
- **Model Selection**: Choose between Sora 2 (fast) or Sora 2 Pro (high quality)
- **Aspect Ratio Options**: 16:9 landscape, 9:16 portrait, 7:4 wide, or 4:7 tall
- **Duration Control**: Generate videos of 4, 8, or 12 seconds

### 📋 List Videos
View and manage all your generated videos in one place.

- **Smart Filtering**: Filter by status (All, Drafts, Completed, Failed)
- **Search**: Find videos by searching through prompts
- **Status Tracking**: See real-time generation progress
- **Quick Actions**: Download, delete, open, and copy video URLs

## Commands

- **Create Video** - Generate a new video with a form interface
- **List Videos** - Browse and manage your video library
- **Prompt History** - View and reuse your previous video prompts
- **Home** - Go to Sora's home feed
- **Explore** - Browse Sora's explore page
- **View Profile** - Visit your Sora profile
- **Go to Profile** - Visit a specific user's profile
- **Drafts** - View your Sora drafts

## Setup

1. Install the extension from Raycast Store
2. Get your OpenAI API key from [platform.openai.com](https://platform.openai.com)
3. Add your API key in the extension preferences
4. Start generating videos!

## Video Actions

### Create Video
- Enter a detailed description of your desired video
- Select quality model (Sora 2 or Sora 2 Pro)
- Choose resolution and duration
- Submit to start generation

### List Videos
- **View**: Search and filter through all your videos
- **Open**: View completed videos in browser
- **Download**: Save MP4 files to your Downloads folder (⚠️ expires after 1 hour)
- **Copy URL**: Copy video URL to clipboard
- **Copy Prompt**: Copy the video's prompt to clipboard (works even if API doesn't return it)
- **Regenerate Video**: Create a new video with the same settings
- **Delete**: Remove videos from storage
- **Check Status**: Poll for generation progress updates

> **Important**: Video downloads expire 1 hour after generation. Download your videos promptly or view them in your browser where they remain accessible.

### Prompt History
- **Browse**: View all your previously used prompts
- **Reuse**: Create new videos with past prompts
- **Search**: Find specific prompts quickly
- **Usage Stats**: See how many times you've used each prompt

> **Note**: Prompts are automatically saved to local storage when you create videos, even if the API doesn't return them later.

## Additional Features

See [SORA_API_FEATURES.md](./SORA_API_FEATURES.md) for information about:
- Video remixing
- Reference inputs and storyboards
- Cameo support
- Thumbnail and spritesheet variants
- Batch operations
- And more!

## Requirements

- OpenAI API key with Sora access
- Active internet connection
- macOS or Windows

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Support

For issues or feature requests, please visit the [GitHub repository](https://github.com/chrismessina/raycast-sora).

## License

MIT