Build the chat screen in src/app/chat using hardcoded fake messages only.
Components go in src/components/chat/.

Requirements:
- Message bubbles that fade and slide in (Reanimated)
- Different styling for user vs assistant bubbles
- Typing-indicator animation (three bouncing dots)
- Auto-scroll to the newest message
- Keyboard-safe input bar with a send button
- Sending a message adds it, then after 1.5s a fake assistant reply appears
- Respect reduce-motion
- Accessibility labels on every touchable

Keep every file small. Use the theme for all styling.