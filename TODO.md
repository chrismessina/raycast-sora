# TODO

- [x] Add commands for:
  - [x] Explore (https://sora.chatgpt.com/explore)
  - [x] View Profile (https://sora.chatgpt.com/profile)
  - [x] Go to Profile (https://sora.chatgpt.com/profile/@username)
  - [x] Drafts (https://sora.chatgpt.com/drafts)
- [x] Add Preference for `Username` (necessary to access Profile command)
- [ ] Add Preference for `OpenAI Key`
- [ ] Add support for [Sora API](https://platform.openai.com/docs/guides/video-generation):
  - [ ] Add command for `Create Video`: Start a new render job from a prompt, with optional reference inputs or a remix ID.
  - [ ] Add command for `List Videos`: Enumerate your videos with pagination for history, dashboards, or housekeeping.
    - [ ] Add command for `Get Video Status`: Retrieve the current state of a render job and monitor its progress.
    - [ ] Add command for `Download Video`: Fetch the finished MP4 once the job is completed.
    - [ ] Add command for `Delete Video`: Remove an individual video ID from OpenAI’s storage