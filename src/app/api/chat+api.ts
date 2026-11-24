import Anthropic from '@anthropic-ai/sdk';
import { verifyToken } from '@clerk/backend';

type IncomingMessage = { role: 'user' | 'assistant'; text: string };

const SYSTEM_PROMPT = `You are a gentle, supportive guide for young learners who may be
experiencing bullying. Use simple, warm, age-appropriate language. Never blame,
judge, or minimize what the learner shares.

Guide them through a short self-check by asking these questions one at a time,
waiting for an answer before moving to the next:
1. Was it repeated, or did it happen just once?
2. Did it hurt you or make you feel unsafe?
3. Was it public, or did other people see it happen?

Once all three are answered, give a short, plain-language summary of what they
shared and suggest one clear next step, such as talking to a trusted adult,
teacher, parent, or school counselor. Never present this as a diagnosis, a
formal assessment, or a legal judgment - make clear it is only a supportive
check-in. Format that final reply exactly like this, with nothing before it:

<<SELF_CHECK_COMPLETE>>
Summary: <one or two warm, plain-language sentences summarizing what they shared>
Next step: <one clear suggested next step>

If at any point the learner mentions self-harm, suicide, abuse, or being in
immediate danger, stop the self-check right away. Respond with warmth,
strongly encourage them to talk to a trusted adult right now, and share this
resource: Childline Kenya, call 116 (free, 24/7). Do not continue the
self-check questions and do not use the <<SELF_CHECK_COMPLETE>> format in this
case.`;

const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(clerkId: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(clerkId);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(clerkId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

const FALLBACK_ERROR = { error: "I couldn't reply just now. Please try again." };

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

  if (isRateLimited(clerkId)) {
    return Response.json(
      { error: "You're sending messages too fast. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let incomingMessages: IncomingMessage[];
  try {
    const body = await request.json();
    if (!Array.isArray(body?.messages)) {
      throw new Error('Invalid body');
    }
    incomingMessages = body.messages;
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const messages = incomingMessages
    .filter(
      (message) =>
        message &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.text === 'string' &&
        message.text.trim().length > 0,
    )
    .map((message) => ({ role: message.role, content: message.text }));

  if (messages.length === 0 || !process.env.ANTHROPIC_API_KEY) {
    return Response.json(FALLBACK_ERROR, { status: 503 });
  }

  try {
    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 1024,
      output_config: { effort: 'low' },
      system: SYSTEM_PROMPT,
      messages,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return Response.json(FALLBACK_ERROR, { status: 503 });
    }

    return Response.json({ reply: textBlock.text });
  } catch {
    return Response.json(FALLBACK_ERROR, { status: 503 });
  }
}
