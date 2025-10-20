import { open, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { SORA_BASE_URL } from "./constants";

interface Preferences {
  username?: string;
}

export default async function Command() {
  const preferences = getPreferenceValues<Preferences>();

  if (!preferences.username) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Username not set",
      message: "Please set your username in extension preferences",
    });
    return;
  }

  await open(`${SORA_BASE_URL}/profile/@${preferences.username}`);
}
