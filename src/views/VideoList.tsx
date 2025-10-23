import { List, Icon } from "@raycast/api";
import type { Video, VideoFilter } from "../types";
import { VideoListItem } from "./VideoListItem";

interface VideoListProps {
  videos: Video[];
  isLoading: boolean;
  filter: VideoFilter;
  searchText: string;
  onFilterChange: (filter: VideoFilter) => void;
  onSearchTextChange: (text: string) => void;
  onRefresh: () => Promise<void>;
  onDelete: (video: Video) => Promise<void>;
  onDownload: (video: Video) => Promise<void>;
  onCopyUrl: (video: Video) => Promise<void>;
  onCheckStatus: (video: Video) => Promise<void>;
  onCopyPrompt: (video: Video) => Promise<void>;
  onRegenerateVideo: (video: Video) => Promise<void>;
}

export function VideoList({
  videos,
  isLoading,
  filter,
  searchText,
  onFilterChange,
  onSearchTextChange,
  onRefresh,
  onDelete,
  onDownload,
  onCopyUrl,
  onCheckStatus,
  onCopyPrompt,
  onRegenerateVideo,
}: VideoListProps) {
  const filteredVideos = videos.filter((video) => {
    // Filter by status
    if (filter === "drafts" && video.status !== "queued" && video.status !== "in_progress") {
      return false;
    }
    if (filter === "completed" && video.status !== "completed") {
      return false;
    }
    if (filter === "failed" && video.status !== "failed") {
      return false;
    }

    // Filter by search text
    if (searchText && video.prompt) {
      return video.prompt.toLowerCase().includes(searchText.toLowerCase());
    }

    return true;
  });

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search videos by prompt..."
      onSearchTextChange={onSearchTextChange}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Filter Videos"
          value={filter}
          onChange={(newValue) => onFilterChange(newValue as VideoFilter)}
        >
          <List.Dropdown.Item title="All Videos" value="all" icon={Icon.List} />
          <List.Dropdown.Item title="Drafts (In Progress)" value="drafts" icon={Icon.CircleProgress} />
          <List.Dropdown.Item title="Completed" value="completed" icon={Icon.CheckCircle} />
          <List.Dropdown.Item title="Failed" value="failed" icon={Icon.XMarkCircle} />
        </List.Dropdown>
      }
    >
      {filteredVideos.length === 0 ? (
        <List.EmptyView
          title={searchText ? "No videos found" : "No videos yet"}
          description={
            searchText ? "Try a different search term" : "Create your first video using the Create Video command"
          }
          icon={Icon.Video}
        />
      ) : (
        filteredVideos.map((video) => (
          <VideoListItem
            key={video.id}
            video={video}
            onRefresh={onRefresh}
            onDelete={onDelete}
            onDownload={onDownload}
            onCopyUrl={onCopyUrl}
            onCheckStatus={onCheckStatus}
            onCopyPrompt={onCopyPrompt}
            onRegenerateVideo={onRegenerateVideo}
          />
        ))
      )}
    </List>
  );
}
