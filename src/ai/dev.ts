import { config } from 'dotenv';
config();

import '@/ai/flows/transcribe-audio.ts';
import '@/ai/flows/extract-action-items.ts';
import '@/ai/flows/diarize-audio.ts';
import '@/ai/flows/summarize-meeting.ts';