import { List, ActionPanel, Action, Icon, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { getPromptHistory, PromptHistoryItem } from "./utils/promptStorage";
import { CreateVideoForm } from "./views/CreateVideoForm";

export default function Command() {
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const items = await getPromptHistory();
        setHistory(items);
      } catch (error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Failed to Load History",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, []);

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search prompt history...">
      {history.length === 0 ? (
        <List.EmptyView
          title="No Prompt History"
          description="Your prompt history will appear here after you create videos"
          icon={Icon.Document}
        />
      ) : (
        history.map((item, index) => (
          <List.Item
            key={`${item.prompt}-${index}`}
            title={item.prompt}
            subtitle={`${item.model} • ${item.size} • ${item.seconds}s`}
            accessories={[
              { text: `Used ${item.useCount}x`, tooltip: `Used ${item.useCount} times` },
              { text: formatDate(item.lastUsed), tooltip: `Last used: ${new Date(item.lastUsed).toLocaleString()}` },
            ]}
            actions={
              <ActionPanel>
                <ActionPanel.Section title="Prompt Actions">
                  <Action.Push
                    title="Create Video with This Prompt"
                    icon={Icon.Video}
                    target={<CreateVideoFormWithPrompt item={item} />}
                  />
                  <Action.CopyToClipboard
                    title="Copy Prompt"
                    content={item.prompt}
                    shortcut={{ modifiers: ["cmd"], key: "c" }}
                  />
                </ActionPanel.Section>
                <ActionPanel.Section title="Details">
                  <Action.CopyToClipboard
                    title="Copy Settings"
                    content={`Model: ${item.model}\nSize: ${item.size}\nDuration: ${item.seconds}s`}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}

// Wrapper component to pre-fill the form with a prompt
function CreateVideoFormWithPrompt({ item }: { item: PromptHistoryItem }) {
  return (
    <CreateVideoForm
      initialPrompt={item.prompt}
      initialModel={item.model}
      initialSize={item.size}
      initialSeconds={item.seconds}
    />
  );
}
