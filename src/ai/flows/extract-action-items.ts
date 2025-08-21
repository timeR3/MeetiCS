'use server';

/**
 * @fileOverview A flow to extract action items from meeting transcripts and assign them to speakers.
 *
 * - extractActionItems - A function that handles the action item extraction process.
 * - ExtractActionItemsInput - The input type for the extractActionItems function.
 * - ExtractActionItemsOutput - The return type for the extractActionItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractActionItemsInputSchema = z.object({
  transcript: z.string().describe('The transcript of the meeting.'),
});
export type ExtractActionItemsInput = z.infer<typeof ExtractActionItemsInputSchema>;

const ExtractActionItemsOutputSchema = z.array(z.object({
  speaker: z.string().describe('The speaker who is assigned the action item.'),
  actionItem: z.string().describe('The action item identified from the transcript.'),
}));
export type ExtractActionItemsOutput = z.infer<typeof ExtractActionItemsOutputSchema>;

export async function extractActionItems(input: ExtractActionItemsInput): Promise<ExtractActionItemsOutput> {
  return extractActionItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractActionItemsPrompt',
  input: {schema: ExtractActionItemsInputSchema},
  output: {schema: ExtractActionItemsOutputSchema},
  prompt: `You are an AI assistant tasked with extracting action items from meeting transcripts and assigning them to speakers.\n\nGiven the following meeting transcript, identify the action items and the speaker responsible for each item. The output should be a JSON array of objects, where each object has a 'speaker' field and an 'actionItem' field.\n\nTranscript: {{{transcript}}}`,
});

const extractActionItemsFlow = ai.defineFlow(
  {
    name: 'extractActionItemsFlow',
    inputSchema: ExtractActionItemsInputSchema,
    outputSchema: ExtractActionItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
