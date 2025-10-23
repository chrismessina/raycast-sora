# Sora API Features

This document outlines additional features available in the OpenAI Sora API that could be added to this Raycast extension.

## Currently Implemented Features

✅ **Create Video** - Start a new video generation from a text prompt
✅ **List Videos** - View all your videos with filtering and search
✅ **Get Video Status** - Check the progress of video generation
✅ **Delete Video** - Remove videos from storage
✅ **Download Video** - Download completed MP4 files
✅ **Open Video** - View videos in browser

## Additional Features Available in Sora API

### 1. Video Remixing

**Endpoint:** `POST /videos/{video_id}/remix`

Create variations of existing videos by modifying parameters or remixing with a new prompt.

**Potential Command:** `Remix Video`

- Select an existing video
- Provide new prompt or adjustments
- Generate a variation

### 2. Reference Inputs / Storyboards

**Feature:** Upload reference images or videos to guide generation

The API supports using reference inputs to control the look and feel of generated videos.

**Potential Command:** `Create Video with References`

- Upload reference images
- Provide prompt
- Generate guided video

### 3. Cameos (Featured People)

**Feature:** Include specific people in generated videos

Users can specify "cameos" to include particular individuals in their videos.

**Enhancement:** Add cameo support to the Create Video form

- Text field for cameo references
- Multiple cameo support

### 4. Polling with `createAndPoll`

**Feature:** Simplified status checking

The OpenAI SDK provides a `createAndPoll` method that automatically polls until completion.

**Enhancement:** Add automatic polling to Create Video command

- Show progress indicator
- Auto-refresh status
- Notify on completion

### 5. Variants (Thumbnails, Spritesheets)

**Endpoint:** `GET /videos/{video_id}/content?variant={type}`

Available variants:

- `video` - MP4 file (default)
- `thumbnail` - WEBP thumbnail image
- `spritesheet` - JPG spritesheet for preview

**Potential Command:** `Download Video Assets`

- Download video with all variants
- Preview thumbnails in list view
- Use spritesheet for hover previews

### 6. Extended Video Metadata

**Available Fields:**

- `prompt` - Original generation prompt
- `progress` - Current generation progress (0-100)
- `error` - Error details if generation failed
- `created_at` - Unix timestamp of creation

**Enhancement:** Add detail view for videos

- Show full prompt
- Display error details for failed videos
- Show generation timeline

### 7. Pagination Support

**Parameters:**

- `limit` - Number of results (1-100)
- `starting_after` - Cursor for next page
- `ending_before` - Cursor for previous page
- `has_more` - Boolean indicating more results

**Enhancement:** Add pagination to List Videos

- Load more button
- Infinite scroll
- Page navigation

### 8. Advanced Filtering

**Potential Filters:**

- By model (sora-2, sora-2-pro)
- By resolution
- By duration
- By date range
- By status

**Enhancement:** Add filter sidebar to List Videos

### 9. Batch Operations

**Feature:** Perform actions on multiple videos

**Potential Commands:**

- Batch delete
- Batch download
- Batch export metadata

### 10. Webhooks (if supported)

**Feature:** Get notified when videos complete

Instead of polling, receive notifications when video generation completes.

**Enhancement:** Add notification system

- macOS notifications
- Sound alerts
- Badge updates

## Model-Specific Features

### Sora 2

- Faster generation
- Lower cost
- Good for quick iterations and previews

### Sora 2 Pro

- Higher quality output
- Production-ready videos
- Better detail and coherence
- Longer generation time

## Resolution Options

| Resolution | Aspect Ratio | Use Case |
|------------|--------------|----------|
| 1280x720   | 16:9         | HD landscape |
| 1920x1080  | 16:9         | Full HD landscape |
| 1024x576   | 16:9         | Lower res landscape |
| 720x1280   | 9:16         | Portrait mobile |
| 1080x1920  | 9:16         | Full HD portrait |
| 576x1024   | 9:16         | Lower res portrait |

## Duration Options

- 5 seconds - Quick clips
- 8 seconds - Standard length
- 10 seconds - Extended clips

## Best Practices

1. **Prompt Engineering**
   - Be specific about subjects, camera movement, lighting
   - Include visual style details
   - Mention desired motion and action

2. **Cost Optimization**
   - Use Sora 2 for testing and iterations
   - Use Sora 2 Pro only for final outputs
   - Delete unused videos to manage storage

3. **Workflow**
   - Generate multiple variations with different prompts
   - Use lower resolutions for previews
   - Download only completed videos

4. **Error Handling**
   - Check video status before downloading
   - Handle API rate limits gracefully
   - Provide clear error messages to users

## Future Enhancement Ideas

1. **Video Gallery View** - Grid layout with thumbnails
2. **Prompt Templates** - Pre-made prompts for common use cases
3. **Video Collections** - Organize videos into projects
4. **Export Formats** - Convert to different formats/codecs
5. **Share to Social Media** - Direct sharing integrations
6. **Video Editor Integration** - Open in Final Cut Pro, iMovie, etc.
7. **Batch Generation** - Queue multiple video generations
8. **Prompt History** - Save and reuse successful prompts
9. **Cost Tracking** - Monitor API usage and costs
10. **Collaborative Features** - Share videos with team members

## API Rate Limits

Be aware of OpenAI's rate limits:

- Request per minute limits
- Token usage limits
- Concurrent generation limits

Implement proper error handling and retry logic for rate limit errors.

## Security Considerations

- Store API keys securely in Raycast preferences
- Never expose API keys in logs or error messages
- Validate user inputs before sending to API
- Handle sensitive video content appropriately
