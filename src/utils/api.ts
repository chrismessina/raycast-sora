import { getPreferenceValues } from "@raycast/api";
import { Preferences, Video, VideoListResponse, CreateVideoRequest } from "../types";
import { logger } from "./logger";
import { OPENAI_API_BASE_URL, SORA_BASE_URL } from "./constants";

export function getApiKey(): string {
  const preferences = getPreferenceValues<Preferences>();
  return preferences.apiKey;
}

async function makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const apiKey = getApiKey();
  const url = `${OPENAI_API_BASE_URL}${endpoint}`;

  logger.log(`Making request to ${endpoint}`, { method: options.method || "GET" });

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: unknown = await response.json().catch(() => ({
      error: { message: response.statusText },
    }));

    const errorData = error as { error?: { message?: string; type?: string } };
    const errorMessage = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;

    logger.error(`API request failed: ${endpoint}`, {
      status: response.status,
      message: errorMessage,
      type: errorData?.error?.type,
    });

    throw new Error(errorMessage);
  }

  const data = await response.json();
  logger.log(`Request successful: ${endpoint}`, { hasData: !!data });
  return data as T;
}

export async function createVideo(request: CreateVideoRequest): Promise<Video> {
  return makeRequest<Video>("/videos", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function listVideos(params?: {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
}): Promise<VideoListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.starting_after) queryParams.append("starting_after", params.starting_after);
  if (params?.ending_before) queryParams.append("ending_before", params.ending_before);

  const query = queryParams.toString();
  return makeRequest<VideoListResponse>(`/videos${query ? `?${query}` : ""}`);
}

export async function getVideo(videoId: string): Promise<Video> {
  return makeRequest<Video>(`/videos/${videoId}`);
}

export async function deleteVideo(videoId: string): Promise<void> {
  await makeRequest(`/videos/${videoId}`, { method: "DELETE" });
}

export async function downloadVideo(videoId: string): Promise<ArrayBuffer> {
  const apiKey = getApiKey();
  const url = `${OPENAI_API_BASE_URL}/videos/${videoId}/content`;

  logger.log(`Downloading video from ${url}`, { videoId });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    logger.error(`Failed to download video: ${url}`, {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    });
    throw new Error(`Failed to download video (${response.status}): ${errorText || response.statusText}`);
  }

  logger.log(`Video download successful`, { videoId, contentType: response.headers.get("content-type") });
  return response.arrayBuffer();
}

export function getVideoContentUrl(videoId: string): string {
  return `${OPENAI_API_BASE_URL}/videos/${videoId}/content`;
}

export function getVideoUrl(videoId: string): string {
  return `${SORA_BASE_URL}/video/${videoId}`;
}
