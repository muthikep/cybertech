const COMPLETE_MARKER = '<<SELF_CHECK_COMPLETE>>';

export type SelfCheckResult = {
  summary: string;
  nextStep: string;
};

export function parseSelfCheckResult(reply: string): SelfCheckResult | null {
  if (!reply.includes(COMPLETE_MARKER)) {
    return null;
  }

  const summaryMatch = reply.match(/Summary:\s*(.+)/i);
  const nextStepMatch = reply.match(/Next step:\s*(.+)/i);

  return {
    summary: summaryMatch?.[1]?.trim() ?? reply.replace(COMPLETE_MARKER, '').trim(),
    nextStep:
      nextStepMatch?.[1]?.trim() ??
      'Talk to a trusted adult, teacher, parent, or school counselor.',
  };
}
