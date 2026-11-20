import { verifyToken } from '@clerk/backend';

import { prisma } from '@/server/prisma';

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;

  if (!token || !process.env.CLERK_SECRET_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let clerkId: string;
  try {
    const payload = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    clerkId = payload.sub;
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  });

  return Response.json({ ok: true });
}
