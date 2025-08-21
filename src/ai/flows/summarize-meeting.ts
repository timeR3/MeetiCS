'use server';

/**
 * @fileOverview Summarizes meeting transcripts, extracting key discussion points, decisions, and action items.
 *
 * - summarizeMeeting - A function that handles the meeting summarization process.
 * - SummarizeMeetingInput - The input type for the summarizeMeeting function.
 * - SummarizeMeetingOutput - The return type for the summarizeMeeting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMeetingInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the meeting to be summarized.'),
});
export type SummarizeMeetingInput = z.infer<typeof SummarizeMeetingInputSchema>;

const SummarizeMeetingOutputSchema = z.object({
  summary: z.string().describe('The summary of the meeting.'),
  keyDiscussionPoints: z.string().describe('The key discussion points of the meeting.'),
  decisionsMade: z.string().describe('The decisions made during the meeting.'),
  actionItems: z.string().describe('The action items identified in the meeting.'),
});
export type SummarizeMeetingOutput = z.infer<typeof SummarizeMeetingOutputSchema>;

export async function summarizeMeeting(input: SummarizeMeetingInput): Promise<SummarizeMeetingOutput> {
  return summarizeMeetingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMeetingPrompt',
  input: {schema: SummarizeMeetingInputSchema},
  output: {schema: SummarizeMeetingOutputSchema},
  prompt: `You are an AI assistant that summarizes meeting transcripts.

  Your goal is to extract the key information from the transcript provided.

  Transcript:
  {{transcript}}

  Instructions:
  1. Create a concise summary of the meeting.
  2. Identify and list the key discussion points.
  3. Identify and list the decisions made during the meeting.
  4. Identify and list the action items, including who is responsible for each item.

  Output the summary, key discussion points, decisions made, and action items in a structured format.
  `,
});

const summarizeMeetingFlow = ai.defineFlow(
  {
    name: 'summarizeMeetingFlow',
    inputSchema: SummarizeMeetingInputSchema,
    outputSchema: SummarizeMeetingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
