In the server API project, create POST /api/chat.

- Verify the Clerk session token first; return 401 if invalid
- Call the Claude API using ANTHROPIC_API_KEY from server env
- Accept the conversation messages and return the assistant reply
- System prompt: supportive, simple language suitable for young learners; ask
  the self-check questions one at a time (was it repeated? did it hurt or make
  you feel unsafe? was it public or witnessed?); after the answers, give a clear
  summary and a suggested next step (trusted adult, teacher, parent, or school
  counselor); never claim a diagnosis or a legal judgment
- Send only the messages needed
- Do not log message content or the API key
- On any failure return a friendly generic error, never the raw provider error
- Add basic rate limiting per user