// Public env vars the app needs at runtime. Keep in sync with .env.example.
const REQUIRED_PUBLIC_ENV_VARS = [
  'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'EXPO_PUBLIC_API_BASE_URL',
] as const;

export function getMissingEnvVars(): string[] {
  return REQUIRED_PUBLIC_ENV_VARS.filter((name) => !process.env[name]);
}
