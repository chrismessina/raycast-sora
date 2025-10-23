import { List, ActionPanel, Action, Icon, open } from "@raycast/api";
import { Video } from "../types";
import { getVideoUrl } from "../utils/api";
import { getStatusIcon } from "../utils/videoHelpers";
import { useStoredPrompt } from "../hooks/useStoredPrompt";

interface VideoListItemProps {
  video: Video;
  onRefresh: () => Promise<void>;
  onDelete: (video: Video) => Promise<void>;
  onDownload: (video: Video) => Promise<void>;
  onCopyUrl: (video: Video) => Promise<void>;
  onCheckStatus: (video: Video) => Promise<void>;
  onCopyPrompt: (video: Video) => Promise<void>;
  onRegenerateVideo: (video: Video) => Promise<void>;
}

export function VideoListItem({
  video,
  onRefresh,
  onDelete,
  onDownload,
  onCopyUrl,
  onCheckStatus,
  onCopyPrompt,
  onRegenerateVideo,
}: VideoListItemProps) {
  const { hasPrompt } = useStoredPrompt(video);

  function isDownloadExpired(): boolean {
    // Downloads expire after 1 hour
    const oneHourInMs = 60 * 60 * 1000;
    const createdAt = video.created_at * 1000;
    const now = Date.now();
    return now - createdAt > oneHourInMs;
  }

  function getAccessories() {
    const accessories: List.Item.Accessory[] = [];

    if (video.progress !== undefined) {
      accessories.push({ text: `${video.progress}%` });
    }

    accessories.push({
      text: video.model,
      tooltip: `Model: ${video.model}`,
    });

    accessories.push({
      text: `${video.size} • ${video.seconds}s`,
      tooltip: `Resolution: ${video.size}, Duration: ${video.seconds}s`,
    });

    const date = new Date(video.created_at * 1000);
    const isExpired = video.status === "completed" && isDownloadExpired();
    accessories.push({
      date: date,
      tooltip: isExpired
        ? `Created: ${date.toLocaleString()} (Download expired - view in browser)`
        : `Created: ${date.toLocaleString()}`,
    });

    return accessories;
  }

  return (
    <List.Item
      title={video.prompt || video.id}
      subtitle={video.status}
      icon={getStatusIcon(video.status)}
      accessories={getAccessories()}
      actions={
        <ActionPanel>
          <ActionPanel.Section title="Video Actions">
            {video.status === "completed" && (
              <>
                <Action title="Open Video" icon={Icon.Globe} onAction={() => open(getVideoUrl(video.id))} />
                <Action
                  title="Copy Video URL"
                  icon={Icon.Link}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                  onAction={() => onCopyUrl(video)}
                />
                <Action
                  title={isDownloadExpired() ? "Download Video (Expired)" : "Download Video"}
                  icon={Icon.Download}
                  shortcut={{ modifiers: ["cmd"], key: "d" }}
                  onAction={() => onDownload(video)}
                />
              </>
            )}
            {(video.status === "queued" || video.status === "in_progress") && (
              <Action title="Check Status" icon={Icon.ArrowClockwise} onAction={() => onCheckStatus(video)} />
            )}
          </ActionPanel.Section>
          <ActionPanel.Section title="Prompt Actions">
            {hasPrompt && (
              <>
                <Action
                  title="Copy Prompt"
                  icon={Icon.Clipboard}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                  onAction={() => onCopyPrompt(video)}
                />
                <Action
                  title="Regenerate Video"
                  icon={Icon.Repeat}
                  shortcut={{ modifiers: ["cmd", "shift"], key: "r" }}
                  onAction={() => onRegenerateVideo(video)}
                />
              </>
            )}
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action
              title="Refresh List"
              icon={Icon.ArrowClockwise}
              shortcut={{ modifiers: ["cmd"], key: "r" }}
              onAction={onRefresh}
            />
            <Action
              title="Delete Video"
              icon={Icon.Trash}
              style={Action.Style.Destructive}
              shortcut={{ modifiers: ["cmd"], key: "backspace" }}
              onAction={() => onDelete(video)}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
