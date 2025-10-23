import { showToast, Toast, confirmAlert, Alert, open, Clipboard } from "@raycast/api";
import { deleteVideo, downloadVideo, getVideo, getVideoUrl, createVideo } from "../utils/api";
import { getUserFriendlyError, logger } from "../utils/logger";
import { getPromptForVideo } from "../utils/promptStorage";
import { Video } from "../types";
import fs from "fs";
import path from "path";
import { homedir } from "os";

export async function handleDeleteVideo(video: Video, onSuccess: () => Promise<void>) {
  const confirmed = await confirmAlert({
    title: "Delete Video",
    message: `Are you sure you want to delete video ${video.id}?`,
    primaryAction: {
      title: "Delete",
      style: Alert.ActionStyle.Destructive,
    },
  });

  if (confirmed) {
    try {
      logger.log("Deleting video", { videoId: video.id });
      await deleteVideo(video.id);
      await onSuccess();
      logger.log("Video deleted successfully", { videoId: video.id });
      showToast({
        style: Toast.Style.Success,
        title: "Video Deleted",
      });
    } catch (error) {
      const friendlyMessage = getUserFriendlyError(error);
      // Error already logged in API layer
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to Delete Video",
        message: friendlyMessage,
      });
    }
  }
}

export async function handleDownloadVideo(video: Video) {
  if (video.status !== "completed") {
    showToast({
      style: Toast.Style.Failure,
      title: "Video Not Ready",
      message: "Video must be completed before downloading",
    });
    return;
  }

  try {
    logger.log("Downloading video", { videoId: video.id, status: video.status });
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Downloading Video...",
      message: "This may take a moment...",
    });

    // Verify video is still completed before downloading
    const currentVideo = await getVideo(video.id);
    if (currentVideo.status !== "completed") {
      toast.style = Toast.Style.Failure;
      toast.title = "Video Not Ready";
      toast.message = `Status changed to: ${currentVideo.status}`;
      return;
    }

    const arrayBuffer = await downloadVideo(video.id);
    const buffer = Buffer.from(arrayBuffer);

    // Save to Downloads folder
    const downloadsPath = path.join(homedir(), "Downloads");
    const filename = `sora-${video.id}-${Date.now()}.mp4`;
    const filePath = path.join(downloadsPath, filename);

    fs.writeFileSync(filePath, buffer);
    logger.log("Video downloaded successfully", { videoId: video.id, filePath });

    toast.style = Toast.Style.Success;
    toast.title = "Video Downloaded";
    toast.message = `Saved to ${filePath}`;
    toast.primaryAction = {
      title: "Show in Finder",
      onAction: () => {
        open(filePath);
      },
    };
  } catch (error) {
    const friendlyMessage = getUserFriendlyError(error);
    logger.error("Download video failed", { videoId: video.id, error: friendlyMessage });

    await showToast({
      style: Toast.Style.Failure,
      title: "Download Failed",
      message: friendlyMessage,
      primaryAction: {
        title: "Open in Browser",
        onAction: () => {
          open(getVideoUrl(video.id));
        },
      },
    });
  }
}

export async function handleCopyVideoUrl(video: Video) {
  if (video.status !== "completed") {
    showToast({
      style: Toast.Style.Failure,
      title: "Video Not Ready",
      message: "Video must be completed to get URL",
    });
    return;
  }

  const url = getVideoUrl(video.id);
  await Clipboard.copy(url);
  await showToast({
    style: Toast.Style.Success,
    title: "URL Copied",
    message: "Video URL copied to clipboard",
  });
}

export async function handleCheckVideoStatus(video: Video, onSuccess: () => Promise<void>) {
  try {
    const updatedVideo = await getVideo(video.id);
    showToast({
      style: Toast.Style.Animated,
      title: `Status: ${updatedVideo.status}`,
      message: `Progress: ${updatedVideo.progress || 0}%`,
    });
    await onSuccess();
  } catch (error) {
    showToast({
      style: Toast.Style.Failure,
      title: "Failed to Check Status",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function handleCopyPrompt(video: Video) {
  // Try to get prompt from video object or local storage
  let prompt = video.prompt;

  if (!prompt) {
    const storedPrompt = await getPromptForVideo(video.id);
    prompt = storedPrompt?.prompt;
  }

  if (!prompt) {
    showToast({
      style: Toast.Style.Failure,
      title: "No Prompt Available",
      message: "This video doesn't have an associated prompt",
    });
    return;
  }

  await Clipboard.copy(prompt);
  await showToast({
    style: Toast.Style.Success,
    title: "Prompt Copied",
    message: "Video prompt copied to clipboard",
  });
}

export async function handleRegenerateVideo(video: Video) {
  // Try to get prompt and settings from video object or local storage
  let prompt = video.prompt;
  let model = video.model;
  let size = video.size;
  let seconds = video.seconds;

  if (!prompt) {
    const storedPrompt = await getPromptForVideo(video.id);
    if (storedPrompt) {
      prompt = storedPrompt.prompt;
      model = storedPrompt.model as typeof video.model;
      size = storedPrompt.size;
      seconds = storedPrompt.seconds;
    }
  }

  if (!prompt) {
    showToast({
      style: Toast.Style.Failure,
      title: "Cannot Regenerate",
      message: "This video doesn't have an associated prompt to regenerate from",
    });
    return;
  }

  try {
    logger.log("Regenerating video", { originalVideoId: video.id });
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Regenerating Video...",
      message: "Starting new generation with same settings",
    });

    // Note: Casting to unknown then to CreateVideoRequest to work around OpenAI SDK type conflict
    // Our API expects seconds as a string ("4" | "8" | "12"), not a number
    const request = {
      prompt,
      model,
      size,
      seconds: seconds as "4" | "8" | "12",
    } as unknown as Parameters<typeof createVideo>[0];

    const newVideo = await createVideo(request);

    logger.log("Video regenerated successfully", {
      originalVideoId: video.id,
      newVideoId: newVideo.id,
    });

    toast.style = Toast.Style.Success;
    toast.title = "Video Regeneration Started";
    toast.message = `New video ID: ${newVideo.id}`;
    toast.primaryAction = {
      title: "Check Status",
      onAction: async () => {
        const updatedVideo = await getVideo(newVideo.id);
        showToast({
          style: Toast.Style.Animated,
          title: `Status: ${updatedVideo.status}`,
          message: `Progress: ${updatedVideo.progress || 0}%`,
        });
      },
    };
  } catch (error) {
    const friendlyMessage = getUserFriendlyError(error);
    logger.error("Regenerate video failed", { videoId: video.id, error: friendlyMessage });
    showToast({
      style: Toast.Style.Failure,
      title: "Regeneration Failed",
      message: friendlyMessage,
    });
  }
}
