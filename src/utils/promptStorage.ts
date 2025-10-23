import { LocalStorage } from "@raycast/api";
import { logger } from "./logger";

const PROMPT_STORAGE_KEY = "sora-video-prompts";
const PROMPT_HISTORY_KEY = "sora-prompt-history";
const MAX_HISTORY_ITEMS = 100;

export interface StoredPrompt {
  videoId: string;
  prompt: string;
  model: string;
  size: string;
  seconds: string;
  createdAt: number;
}

export interface PromptHistoryItem {
  prompt: string;
  model: string;
  size: string;
  seconds: string;
  lastUsed: number;
  useCount: number;
}

/**
 * Save a prompt associated with a video ID
 */
export async function savePromptForVideo(
  videoId: string,
  prompt: string,
  model: string,
  size: string,
  seconds: string,
): Promise<void> {
  try {
    const storedPrompt: StoredPrompt = {
      videoId,
      prompt,
      model,
      size,
      seconds,
      createdAt: Date.now(),
    };

    // Save to video-specific storage
    const existingData = await LocalStorage.getItem<string>(PROMPT_STORAGE_KEY);
    const prompts: Record<string, StoredPrompt> = existingData ? JSON.parse(existingData) : {};
    prompts[videoId] = storedPrompt;
    await LocalStorage.setItem(PROMPT_STORAGE_KEY, JSON.stringify(prompts));

    // Also add to prompt history
    await addToPromptHistory(prompt, model, size, seconds);

    logger.log("Prompt saved for video", { videoId, promptLength: prompt.length });
  } catch (error) {
    logger.error("Failed to save prompt", { videoId, error });
  }
}

/**
 * Get a prompt for a specific video ID
 */
export async function getPromptForVideo(videoId: string): Promise<StoredPrompt | null> {
  try {
    const existingData = await LocalStorage.getItem<string>(PROMPT_STORAGE_KEY);
    if (!existingData) return null;

    const prompts: Record<string, StoredPrompt> = JSON.parse(existingData);
    return prompts[videoId] || null;
  } catch (error) {
    logger.error("Failed to get prompt", { videoId, error });
    return null;
  }
}

/**
 * Add a prompt to the history (for reuse)
 */
async function addToPromptHistory(prompt: string, model: string, size: string, seconds: string): Promise<void> {
  try {
    const existingData = await LocalStorage.getItem<string>(PROMPT_HISTORY_KEY);
    const history: PromptHistoryItem[] = existingData ? JSON.parse(existingData) : [];

    // Check if this prompt already exists
    const existingIndex = history.findIndex((item) => item.prompt === prompt);

    if (existingIndex >= 0) {
      // Update existing entry
      history[existingIndex].lastUsed = Date.now();
      history[existingIndex].useCount++;
      history[existingIndex].model = model;
      history[existingIndex].size = size;
      history[existingIndex].seconds = seconds;
    } else {
      // Add new entry
      history.unshift({
        prompt,
        model,
        size,
        seconds,
        lastUsed: Date.now(),
        useCount: 1,
      });
    }

    // Keep only the most recent items
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    await LocalStorage.setItem(PROMPT_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    logger.error("Failed to add to prompt history", { error });
  }
}

/**
 * Get all prompt history items, sorted by most recently used
 */
export async function getPromptHistory(): Promise<PromptHistoryItem[]> {
  try {
    const existingData = await LocalStorage.getItem<string>(PROMPT_HISTORY_KEY);
    if (!existingData) return [];

    const history: PromptHistoryItem[] = JSON.parse(existingData);
    return history.sort((a, b) => b.lastUsed - a.lastUsed);
  } catch (error) {
    logger.error("Failed to get prompt history", { error });
    return [];
  }
}

/**
 * Clear all stored prompts (for cleanup)
 */
export async function clearPromptStorage(): Promise<void> {
  try {
    await LocalStorage.removeItem(PROMPT_STORAGE_KEY);
    await LocalStorage.removeItem(PROMPT_HISTORY_KEY);
    logger.log("Prompt storage cleared");
  } catch (error) {
    logger.error("Failed to clear prompt storage", { error });
  }
}
