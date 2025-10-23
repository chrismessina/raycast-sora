import { LaunchProps, open } from "@raycast/api";
import { SORA_BASE_URL } from "./utils/constants";

interface Arguments {
  username: string;
}

export default async function Command(props: LaunchProps<{ arguments: Arguments }>) {
  const username = props.arguments.username.trim();

  // Remove @ if user included it
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

  await open(`${SORA_BASE_URL}/profile/@${cleanUsername}`);
}
