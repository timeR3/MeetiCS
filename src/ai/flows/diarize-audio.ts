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
  knownSpeakers: z.array(z.object({
    id: z.string().describe("A unique identifier for the speaker."),
    name: z.string().describe("The name of the speaker."),
    voice_profile_url: z.string().optional().describe("A URL to a voice sample for the speaker.")
  })).optional().describe("An optional list of known speakers to help with identification.")
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
  prompt: `You are an AI expert in diarizing meeting transcripts. Your task is to analyze the text and accurately tag different speakers. Be conservative in identifying new speakers; only create a new speaker if you are confident it's a different person.

{{#if knownSpeakers}}
You have been provided with a list of known speakers. Where possible, use these names instead of generic labels like "Speaker 1".
Known Speakers:
{{#each knownSpeakers}}
- {{this.name}}
{{/each}}
{{else}}
Use generic labels like "Speaker 1:", "Speaker 2:", etc. Use as few speakers as necessary to properly diarize the transcript. If the speaker is unclear or seems to be the same person, use the most likely existing speaker tag.
{{/if}}

If a speaker changes mid-sentence, create a new speaker tag on the new line. Return the diarized transcript.

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
