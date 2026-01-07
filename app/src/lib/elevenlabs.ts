import * as FileSystem from 'expo-file-system';
import { instrumentFetch } from './perf';
import SHA256 from 'crypto-js/sha256';
import { ENV } from './env';

export type VoiceSettings = { stability: number; similarity_boost: number; style?: number };

const API_KEY = ENV.ELEVENLABS_API_KEY;
const DEFAULT_VOICE = ENV.ELEVENLABS_VOICE_ID_MARCIE || '21m00Tcm4TlvDq8ikWAM';

function toBase64(buf: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    const seg = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode.apply(null, seg as any);
  }
  return (globalThis as any).btoa(binary);
}

export async function synthesize(text: string, voiceId = DEFAULT_VOICE, settings: VoiceSettings = { stability: 0.75, similarity_boost: 0.75, style: 0.35 }) {
  if (!API_KEY) throw new Error('elevenlabs_missing_key');

  const cacheKey = SHA256(`${text}-${voiceId}-${JSON.stringify(settings)}`).toString();
  const base = ((FileSystem as any).documentDirectory || (FileSystem as any).cacheDirectory || '') as string;
  const file = base + `marcie_${cacheKey}.mp3`;

  // Check cache
  const info = await FileSystem.getInfoAsync(file);
  if (info.exists) {
    return file;
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
  
  // Retry loop
  let res: any;
  for (let i = 0; i < 3; i++) {
    try {
      res = await instrumentFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
        body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: settings }),
      }, 'tts_elevenlabs');
      if (res.ok) break;
      if (res.status >= 400 && res.status < 500) break; // Don't retry client errors
    } catch (e) {
      if (i === 2) throw e;
      await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }

  if (!res || !res.ok) {
    throw new Error(`elevenlabs_error: ${res?.status || 'network_fail'}`);
  }

  const buf = await (res as any).arrayBuffer();
  const b64 = toBase64(buf);
  await FileSystem.writeAsStringAsync(file, b64, { encoding: 'base64' as any });
  return file;
}
