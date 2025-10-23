import { useState, useEffect, useCallback } from "react";
import { showToast, Toast } from "@raycast/api";
import { listVideos } from "../utils/api";
import { Video } from "../types";

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await listVideos({ limit: 100 });
      setVideos(response.data);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Load Videos",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  return {
    videos,
    isLoading,
    refresh: loadVideos,
  };
}
