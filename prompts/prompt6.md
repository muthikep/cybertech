Connect the chat screen to POST /api/chat using the Clerk session token.
Replace the fake data.

- Show the typing indicator while waiting
- On failure show a friendly assistant-style message ("I couldn't reply just
  now") and a Retry button; never show raw errors
- When the assistant finishes the self-check, navigate to the result screen
  with the summary and suggested next step
- Result screen: plain-language summary, the suggested next step, a note that
  this is not a diagnosis, and a "Start over" button