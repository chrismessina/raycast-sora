import { open } from "@raycast/api";
import { SORA_BASE_URL } from "./utils/constants";

export default async function Command() {
  await open(`${SORA_BASE_URL}/drafts`);
}
