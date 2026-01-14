type AnalysisInput = {
  origin_story: string;
  first_red_flag: string;
  partner_a_input: string;
  partner_b_input: string;
  personality: string;
  sarcasm_level: number;
};

type Verdict = {
  right: string[];
  callout: string[];
  repairs_a: string[];
  repairs_b: string[];
};

const SYSTEM_PROMPT = `You are Dr. Marcie, a 1950s noir meets modern glam relationship coach.
Analyze partners' fight context using origin story, past flags, current inputs, and inferred personality.
Detect cognitive distortions (mind reading, catastrophizing, overgeneralization, personalization, should-statements).
Output JSON strictly with keys: right, callout, repairs_a, repairs_b.
right: 3 validations acknowledging empathy or healthy behaviors.
callout: 3 specific roast lines adjusted to sarcasm level.
repairs_a: 3 actionable repair attempts Partner A should do.
repairs_b: 3 actionable repair attempts Partner B should do.`;

const FALLBACK_VERDICT: Verdict = {
  right: [
    'You both communicated concrete needs.',
    'You referenced prior agreements constructively.',
    'You showed effort toward repair.',
  ],
  callout: [
    'Mind reading doesn’t help—ask, don’t assume.',
    'Catastrophizing amplifies fear—stick to present facts.',
    'Overgeneralization erases nuance—describe this incident only.',
  ],
  repairs_a: [
    'Name your top need in one sentence.',
    'Offer one actionable compromise.',
    'Schedule a short, specific follow-up.',
  ],
  repairs_b: [
    'Reflect their need back before responding.',
    'Replace one “always” with a concrete example.',
    'Propose a micro-repair you can deliver today.',
  ],
};

async function tryOpenAI(apiKey: string, input: AnalysisInput): Promise<Verdict> {
  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: JSON.stringify(input) },
    ],
    response_format: { type: 'json_object' },
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const json = await res.json();
  const txt = json.choices?.[0]?.message?.content || '{}';
  return JSON.parse(txt);
}

async function tryAnthropic(apiKey: string, input: AnalysisInput): Promise<Verdict> {
  const prompt = SYSTEM_PROMPT + '\n' + JSON.stringify(input);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: JSON.stringify(input) }]
    }),
  });

  if (!res.ok) throw new Error(`Anthropic error: ${res.status}`);
  const json = await res.json();
  const txt = json.content?.[0]?.text || '{}';
  // Anthropic doesn't force JSON object as strictly as OpenAI, so we might need to find the JSON block if it includes text.
  // But with the system prompt it should be fine.
  return JSON.parse(txt);
}

import { ENV } from './env';

export async function analyzeFight(input: AnalysisInput): Promise<Verdict> {
  const openaiKey = ENV.OPENAI_API_KEY;
  const anthropicKey = ENV.ANTHROPIC_API_KEY;

  // 1. Try OpenAI
  if (openaiKey) {
    try {
      return await tryOpenAI(openaiKey, input);
    } catch (e) {
      console.warn('OpenAI failed, trying fallback...', e);
    }
  }

  // 2. Try Anthropic
  if (anthropicKey) {
    try {
      return await tryAnthropic(anthropicKey, input);
    } catch (e) {
      console.warn('Anthropic failed, using hardcoded...', e);
    }
  }

  // 3. Fallback
  const calloutBase = input.sarcasm_level >= 3 ? 'Radical truth:' : 'Reality check:';
  return {
    ...FALLBACK_VERDICT,
    callout: FALLBACK_VERDICT.callout.map(c => `${calloutBase} ${c}`),
  };
}

const QUESTION_PROMPT = `You are an expert relationship investigator. 
Given a user's description of a conflict or behavior, generate 3 specific "Yes/No" clarifying questions to understand the context, intent, or hidden triggers.
Output JSON strictly with key: questions (array of 3 strings).`;

export async function generateQuestions(description: string): Promise<string[]> {
  const openaiKey = ENV.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: QUESTION_PROMPT }, { role: 'user', content: description }],
          response_format: { type: 'json_object' }
        })
      });
      const json = await res.json();
      const parsed = JSON.parse(json.choices?.[0]?.message?.content || '{}');
      if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions.slice(0, 3);
    } catch (e) { console.warn('AI Q-Gen failed', e); }
  }

  // Fallback keyword logic
  const base = ['Is this a recurring pattern?', 'Did you explicitly state your expectation?', 'Are you feeling unappreciated?'];
  const t = description.toLowerCase();
  if (t.includes('money') || t.includes('cost')) base[0] = 'Was a budget agreed upon beforehand?';
  if (t.includes('text') || t.includes('phone')) base[1] = 'Do you have different digital communication styles?';
  if (t.includes('clean') || t.includes('chore')) base[2] = 'Is the standard of cleanliness shared?';
  return base;
}
