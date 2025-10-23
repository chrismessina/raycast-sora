import { useState } from "react";
import { showToast, Toast } from "@raycast/api";
import { VideoList } from "./views/VideoList";
import { VideoFilter, Video } from "./types";
import { useVideos } from "./hooks/useVideos";
import {
  handleDeleteVideo,
  handleDownloadVideo,
  handleCopyVideoUrl,
  handleCheckVideoStatus,
  handleCopyPrompt,
  handleRegenerateVideo,
} from "./actions/videoActions";

export default function Command() {
  const { videos, isLoading, refresh } = useVideos();
  const [filter, setFilter] = useState<VideoFilter>("all");
  const [searchText, setSearchText] = useState("");

  async function handleRefresh() {
    await refresh();
    showToast({
      style: Toast.Style.Success,
      title: "Videos Refreshed",
    });
  }

  return (
    <VideoList
      videos={videos}
      isLoading={isLoading}
      filter={filter}
      searchText={searchText}
      onFilterChange={setFilter}
      onSearchTextChange={setSearchText}
      onRefresh={handleRefresh}
      onDelete={(video: Video) => handleDeleteVideo(video, refresh)}
      onDownload={handleDownloadVideo}
      onCopyUrl={handleCopyVideoUrl}
      onCheckStatus={(video: Video) => handleCheckVideoStatus(video, refresh)}
      onCopyPrompt={handleCopyPrompt}
      onRegenerateVideo={(video: Video) => handleRegenerateVideo(video, refresh)}
    />
  );
}
