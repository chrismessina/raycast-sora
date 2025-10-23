// Sora API Video Types

export type VideoStatus = "queued" | "in_progress" | "completed" | "failed";

export type VideoModel = "sora-2" | "sora-2-pro";

export type VideoSize = "720x1280" | "1280x720" | "1024x1792" | "1792x1024";

export interface Video {
  id: string;
  object: "video";
  created_at: number;
  status: VideoStatus;
  model: VideoModel;
  progress?: number;
  seconds: string;
  size: string;
  prompt?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface VideoListResponse {
  data: Video[];
  object: "list";
  has_more: boolean;
}

export type VideoSeconds = "4" | "8" | "12";

export interface CreateVideoRequest {
  prompt: string;
  model: VideoModel;
  size?: string;
  seconds?: VideoSeconds;
}

export type VideoFilter = "all" | "drafts" | "completed" | "failed";
