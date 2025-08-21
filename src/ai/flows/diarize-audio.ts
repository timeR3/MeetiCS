'use server';

/**
 * @fileOverview An AI agent for diarizing audio transcripts.
 *
 * - diarizeAudio - A function that handles the audio diarization process.
 * - DiarizeAudioInput - The input type for the diarizeAudio function.
 * - DiarizeAudioOutput - The return type for the diarizeAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiarizeAudioInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the meeting audio to diarize.'),
});
export type DiarizeAudioInput = z.infer<typeof DiarizeAudioInputSchema>;

const DiarizeAudioOutputSchema = z.object({
  diarizedTranscript: z
    .string()
    .describe('The diarized transcript with speaker tags.'),
});
export type DiarizeAudioOutput = z.infer<typeof DiarizeAudioOutputSchema>;

export async function diarizeAudio(input: DiarizeAudioInput): Promise<DiarizeAudioOutput> {
  return diarizeAudioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diarizeAudioPrompt',
  input: {schema: DiarizeAudioInputSchema},
  output: {schema: DiarizeAudioOutputSchema},
  prompt: `You are an AI expert in diarizing meeting transcripts.  Given the following transcript, analyze the text and attempt to automatically detect and tag different speakers in the transcript, using "Speaker 1:", "Speaker 2:", etc. Use as many speakers as needed to properly diarize the transcript.  If a speaker changes mid-sentence, create a new speaker tag on the new line.  Return the diarized transcript.

Transcript: {{{transcript}}}`,
});

const diarizeAudioFlow = ai.defineFlow(
  {
    name: 'diarizeAudioFlow',
    inputSchema: DiarizeAudioInputSchema,
    outputSchema: DiarizeAudioOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
