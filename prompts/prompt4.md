Create a small server-side API project (we decided on: <Expo API routes /
separate Vercel API>) for backend routes. The Expo app must never touch the
database directly.

- Set up Prisma with Neon Postgres. DATABASE_URL from server env only.
- Schema: User (id, clerkId unique, createdAt) and ChatSession (id, userId,
  startedAt). Do NOT store message content or quiz answers.
- Create POST /api/users/sync: verify the Clerk session token, return 401 if
  invalid, then upsert the User from the verified clerkId.
- Call /api/users/sync from the app once after sign-in.
- Add .env.example with names only. Use Prisma migrations.