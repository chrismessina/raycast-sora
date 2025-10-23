import { Logger } from "@chrismessina/raycast-logger";

// Initialize logger for the Sora extension
export const logger = new Logger();

// Helper to extract user-friendly error messages
export function getUserFriendlyError(error: unknown): string {
  if (error instanceof Error) {
    // Parse API error messages to be more user-friendly
    const message = error.message;

    // Handle specific API error patterns
    if (message.includes("organization must be verified")) {
      return "Your OpenAI organization needs to be verified to use Sora. Visit platform.openai.com/settings/organization/general to verify your organization. Access may take up to 15 minutes after verification.";
    }

    if (message.includes("Invalid type for 'seconds'")) {
      return "Invalid duration selected. Please choose 4, 8, or 12 seconds.";
    }

    if (message.includes("Invalid value") && message.includes("Supported values are")) {
      // Extract the field name and supported values
      const match = message.match(/Invalid value: '([^']+)'\. Supported values are: (.+)/);
      if (match) {
        const [, value, supported] = match;
        return `Invalid selection: "${value}". Please choose from: ${supported}`;
      }
    }

    if (message.includes("API Error")) {
      return message.replace("API Error: ", "");
    }

    if (message.includes("401") || message.includes("Unauthorized")) {
      return "Invalid API key. Please check your OpenAI API key in preferences.";
    }

    if (message.includes("403") || message.includes("Forbidden")) {
      return "Access denied. Your API key may not have permission to use this feature.";
    }

    if (message.includes("429") || message.includes("Rate limit")) {
      return "Rate limit exceeded. Please wait a moment and try again.";
    }

    if (message.includes("500") || message.includes("502") || message.includes("503")) {
      return "OpenAI service is temporarily unavailable. Please try again later.";
    }

    if (message.includes("no longer available") || message.includes("Downloads expire")) {
      return "Video download has expired (downloads expire after 1 hour). Please view the video in your browser instead.";
    }

    if (message.includes("Network") || message.includes("fetch")) {
      return "Network error. Please check your internet connection.";
    }

    return message;
  }

  return "An unexpected error occurred. Please try again.";
}
