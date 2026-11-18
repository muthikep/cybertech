Read AGENTS.md first. Check the expo version in package.json and use the
matching docs.

Create 4 Expo Router screens in src/app/: sign-in, home, chat, result.
Placeholder content only. Home has a "Start" button that goes to chat; chat has
a temporary button that goes to result.

Create src/theme/ with colors (3 base + 1 accent), spacing, radius, font sizes.
Every screen must use the theme only, with no hardcoded values.

Install react-native-reanimated with `npx expo install`.
No auth, no API, no database yet.