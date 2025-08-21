"use client";

import { useEffect, useState, useTransition, use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TranscriptEditor from "./_components/transcript-editor";
import SummaryView from "./_components/summary-view";
import ActionItems from "./_components/action-items";
import ParticipantManager from "./_components/participant-manager";
import type { DiarizeAudioOutput } from "@/ai/flows/diarize-audio";
import type { SummarizeMeetingOutput } from "@/ai/flows/summarize-meeting";
import type { ExtractActionItemsOutput } from "@/ai/flows/extract-action-items";
import { diarizeAudio } from "@/ai/flows/diarize-audio";
import { summarizeMeeting } from "@/ai/flows/summarize-meeting";
import { extractActionItems } from "@/ai/flows/extract-action-items";
import Loading from "./loading";

const mockTranscript = `Alice: Okay team, let's kick off the Q3 planning for Project Phoenix. Bob, can you start with the latest user feedback? Bob: Sure Alice. We've seen a 20% increase in feature requests for a mobile app. Users are loving the web version but want portability. Alice: Interesting. That aligns with our long-term goals. What are the key themes from the requests? Bob: Mainly offline access and push notifications. Charlie, you were looking into the technical feasibility of this, right? Charlie: Yes, I've done a preliminary analysis. A native app would be a significant undertaking, but a PWA could be a good first step. It would give us offline capabilities quickly. Alice: I like that idea. Let's create an action item for Charlie to scope out the PWA implementation plan. We'll need a full proposal by the end of the month. Bob, please also put together a report on the most requested mobile features. We'll review both in two weeks.`;

const knownSpeakers = [
    { id: '1', name: 'Alice', voice_profile_url: '' },
    { id: '2', name: 'Bob', voice_profile_url: '' },
];

export default function MeetingPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const [diarization, setDiarization] = useState<DiarizeAudioOutput | null>(null);
  const [summary, setSummary] = useState<SummarizeMeetingOutput | null>(null);
  const [actionItems, setActionItems] = useState<ExtractActionItemsOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const diarizationPromise = diarizeAudio({ transcript: mockTranscript, knownSpeakers });
      const summaryPromise = summarizeMeeting({ transcript: mockTranscript });
      const actionItemsPromise = extractActionItems({ transcript: mockTranscript });
      
      const [diarizationResult, summaryResult, actionItemsResult] = await Promise.all([
          diarizationPromise,
          summaryPromise,
          actionItemsPromise
      ]);

      setDiarization(diarizationResult);
      setSummary(summaryResult);
      setActionItems(actionItemsResult);
    });
  }, [resolvedParams.id]);

  if (isPending) {
    return <Loading />;
  }

  const meetingTitle = "Project Phoenix - Q3 Planning";
  const meetingDate = "August 15, 2023";
  const audioUrl = "https://storage.googleapis.com/genkit-public/sociology-lecture.mp3"; // Placeholder URL

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4 -ml-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Meetings
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">{meetingTitle}</h1>
        <p className="text-muted-foreground mt-1">{meetingDate}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
          <TranscriptEditor 
            initialTranscript={diarization?.diarizedTranscript || ''} 
            audioUrl={audioUrl}
          />
          <SummaryView summary={summary} />
        </div>
        <div className="md:col-span-1 space-y-6 sticky top-24">
          <ParticipantManager transcript={diarization?.diarizedTranscript || ''} />
          <ActionItems items={actionItems} />
        </div>
      </div>
    </div>
  );
}
