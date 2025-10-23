import { Icon, Color } from "@raycast/api";
import type { VideoStatus } from "../types";

export function getStatusIcon(status: VideoStatus): { source: Icon; tintColor: Color } {
  switch (status) {
    case "completed":
      return { source: Icon.CheckCircle, tintColor: Color.Green };
    case "in_progress":
      return { source: Icon.CircleProgress, tintColor: Color.Blue };
    case "queued":
      return { source: Icon.Clock, tintColor: Color.Yellow };
    case "failed":
      return { source: Icon.XMarkCircle, tintColor: Color.Red };
    default:
      return { source: Icon.Circle, tintColor: Color.SecondaryText };
  }
}
