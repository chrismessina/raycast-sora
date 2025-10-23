import { useState, useEffect } from "react";
import { getPromptForVideo, StoredPrompt } from "../utils/promptStorage";
import { Video } from "../types";

export function useStoredPrompt(video: Video) {
  const [storedPrompt, setStoredPrompt] = useState<StoredPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredPrompt() {
      if (video.prompt) {
        // If video already has a prompt, no need to check storage
        setIsLoading(false);
        return;
      }

      try {
        const stored = await getPromptForVideo(video.id);
        setStoredPrompt(stored);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredPrompt();
  }, [video.id, video.prompt]);

  const hasPrompt = !!(video.prompt || storedPrompt?.prompt);

  return {
    hasPrompt,
    prompt: video.prompt || storedPrompt?.prompt,
    storedPrompt,
    isLoading,
  };
}
