Implement the Safety rules section of AGENTS.md.

- Add the danger rule to the server system prompt
- Add a client-side keyword check on the learner's message (self-harm, suicide,
  abuse, "kill myself", etc). If matched, skip the AI, stop the quiz flow, and
  show a warm message with "talk to a trusted adult right now" and the help
  resources from AGENTS.md
- Add loading, empty, and offline states
- Final pass: run lint and tsc, fix everything, remove unused code and
  dependencies