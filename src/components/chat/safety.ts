const SAFETY_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'want to die',
  "don't want to live",
  'self-harm',
  'self harm',
  'hurt myself',
  'abused',
  'abuse',
  'unsafe at home',
  'in danger',
];

export function containsSafetyKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return SAFETY_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export const SAFETY_RESPONSE =
  "Thank you for telling me - that sounds really serious, and I want you to be " +
  'safe. Please talk to a trusted adult right now, like a parent, teacher, or ' +
  "school counselor. If you'd like to talk to someone right now, you can call " +
  'Childline Kenya at 116 - it is free and available any time.';
