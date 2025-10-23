import { Form, ActionPanel, Action, showToast, Toast, popToRoot } from "@raycast/api";
import { useState } from "react";
import { createVideo, getVideo } from "../utils/api";
import { getUserFriendlyError, logger } from "../utils/logger";
import { savePromptForVideo } from "../utils/promptStorage";
import type { VideoModel, VideoSize, VideoSeconds } from "../types";

interface FormValues {
  prompt: string;
  model: VideoModel;
  size: VideoSize;
  seconds: VideoSeconds;
}

interface CreateVideoFormProps {
  initialPrompt?: string;
  initialModel?: string;
  initialSize?: string;
  initialSeconds?: string;
}

export function CreateVideoForm({
  initialPrompt,
  initialModel,
  initialSize,
  initialSeconds,
}: CreateVideoFormProps = {}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(values: FormValues) {
    if (!values.prompt.trim()) {
      showToast({
        style: Toast.Style.Failure,
        title: "Prompt Required",
        message: "Please enter a video description",
      });
      return;
    }

    setIsLoading(true);
    logger.log("Creating video", {
      model: values.model,
      size: values.size,
      seconds: values.seconds,
    });

    try {
      const video = await createVideo({
        prompt: values.prompt,
        model: values.model,
        size: values.size,
        seconds: values.seconds,
      });

      logger.log("Video created successfully", { videoId: video.id, status: video.status });

      // Save prompt to local storage for later retrieval
      await savePromptForVideo(video.id, values.prompt, values.model, values.size, values.seconds);

      await showToast({
        style: Toast.Style.Success,
        title: "Video Generation Started",
        message: `Video ID: ${video.id}`,
        primaryAction: {
          title: "Check Status",
          onAction: async () => {
            const updatedVideo = await getVideo(video.id);
            showToast({
              style: Toast.Style.Animated,
              title: `Status: ${updatedVideo.status}`,
              message: `Progress: ${updatedVideo.progress || 0}%`,
            });
          },
        },
      });

      popToRoot();
    } catch (error) {
      const friendlyMessage = getUserFriendlyError(error);
      // Don't log here - already logged in API layer

      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Create Video",
        message: friendlyMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Generate Video" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="prompt"
        title="Video Description"
        placeholder="Describe the video you want to generate (up to 2,000 characters)"
        info="Describe the subjects, camera movement, lighting, and visual style you want in your video"
        defaultValue={initialPrompt}
      />

      <Form.Dropdown id="model" title="Model" defaultValue={initialModel || "sora-2"} storeValue>
        <Form.Dropdown.Item value="sora-2" title="Sora 2" icon="⚡️" />
        <Form.Dropdown.Item value="sora-2-pro" title="Sora 2 Pro" icon="✨" />
      </Form.Dropdown>

      <Form.Dropdown id="size" title="Aspect Ratio" defaultValue={initialSize || "1280x720"} storeValue>
        <Form.Dropdown.Item value="1280x720" title="1280x720 (16:9 Landscape)" />
        <Form.Dropdown.Item value="720x1280" title="720x1280 (9:16 Portrait)" />
        <Form.Dropdown.Item value="1792x1024" title="1792x1024 (7:4 Wide)" />
        <Form.Dropdown.Item value="1024x1792" title="1024x1792 (4:7 Tall)" />
      </Form.Dropdown>

      <Form.Dropdown id="seconds" title="Duration" defaultValue={initialSeconds || "8"} storeValue>
        <Form.Dropdown.Item value="4" title="4 seconds" />
        <Form.Dropdown.Item value="8" title="8 seconds" />
        <Form.Dropdown.Item value="12" title="12 seconds" />
      </Form.Dropdown>

      <Form.Description
        title="Note"
        text="Video generation is asynchronous. You'll be notified when it starts, and you can check its progress in the List Videos command. Downloads expire after 1 hour, so download your video promptly or view it in your browser."
      />
    </Form>
  );
}
