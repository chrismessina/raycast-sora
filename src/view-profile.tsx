import { Detail, ActionPanel, Action, open, getPreferenceValues, openExtensionPreferences } from "@raycast/api";
import { SORA_BASE_URL } from "./constants";

interface Preferences {
  username?: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();

  // If username is set, open profile directly
  if (preferences.username) {
    const cleanUsername = preferences.username.trim().replace(/^@/, "");
    open(`${SORA_BASE_URL}/profile/${cleanUsername}`);
    return null;
  }

  // Show message prompting user to set username in preferences
  const markdown = `
# 👤 Username Not Set

To view your Sora profile, please set your username in extension preferences.

---

**How to set your username:**

1. Click "Open Extension Preferences" or hit enter ⏎
2. Enter your Sora username (no @ symbol)
3. Run this command again

Your username will be saved and used for all future profile views.
`;

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action title="Open Extension Preferences" onAction={openExtensionPreferences} />
        </ActionPanel>
      }
    />
  );
}
