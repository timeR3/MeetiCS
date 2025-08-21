"use client";

import { useEffect, useState, useTransition, use, useMemo, useCallback } from "react";
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
import { useLanguage } from "@/context/language-context";

const mockTranscript = `Speaker 1: Okay team, let's kick off the Q3 planning for Project Phoenix. Speaker 2, can you start with the latest user feedback?
Speaker 2: Sure Speaker 1. We've seen a 20% increase in feature requests for a mobile app. Users are loving the web version but want portability.
Speaker 1: Interesting. That aligns with our long-term goals. What are the key themes from the requests?
Speaker 2: Mainly offline access and push notifications. Charlie, you were looking into the technical feasibility of this, right?
Charlie: Yes, I've done a preliminary analysis. A native app would be a significant undertaking, but a PWA could be a good first step. It would give us offline capabilities quickly.
Speaker 1: I like that idea. Let's create an action item for Charlie to scope out the PWA implementation plan. We'll need a full proposal by the end of the month. Speaker 2, please also put together a report on the most requested mobile features. We'll review both in two weeks.`;

const knownSpeakers: {id: string, name: string}[] = [];


export default function MeetingPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const { t } = useLanguage();

  // Raw AI results
  const [rawDiarization, setRawDiarization] = useState<DiarizeAudioOutput | null>(null);
  const [rawSummary, setRawSummary] = useState<SummarizeMeetingOutput | null>(null);
  const [rawActionItems, setRawActionItems] = useState<ExtractActionItemsOutput | null>(null);
  
  // State for participant name mapping
  const [participantNames, setParticipantNames] = useState<Record<string, string>>({});
  
  const [isPending, startTransition] = useTransition();
  
  // Memoized initial speakers from the first diarization
  const initialSpeakers = useMemo(() => {
    if (!rawDiarization?.diarizedTranscript) return [];
    const speakerSet = new Set<string>();
    rawDiarization.diarizedTranscript.split('\n').forEach(line => {
      const match = line.match(/^(.*?):/);
      if (match && match[1]) {
        speakerSet.add(match[1].trim());
      }
    });
    return Array.from(speakerSet);
  }, [rawDiarization?.diarizedTranscript]);

  // Update participantNames state when initialSpeakers are identified
  useEffect(() => {
    const initialMapping = initialSpeakers.reduce((acc, speaker) => {
        acc[speaker] = speaker; // Initially, the displayed name is the speaker ID
        return acc;
    }, {} as Record<string, string>);
    setParticipantNames(initialMapping);
  }, [initialSpeakers]);

  const handleNameChange = useCallback((oldName: string, newName: string) => {
    setParticipantNames(prev => ({
      ...prev,
      [oldName]: newName,
    }));
  }, []);
  
  // Function to replace speaker names in a given text
  const replaceSpeakerNames = useCallback((text: string | undefined) => {
      if (!text) return '';
      let updatedText = text;
      Object.entries(participantNames).forEach(([oldName, newName]) => {
          if (oldName !== newName && newName) { // only replace if newName is not empty
              const regex = new RegExp(`\\b${oldName}\\b`, 'g');
              updatedText = updatedText.replace(regex, newName);
          }
      });
      return updatedText;
  }, [participantNames]);

  // Memoized derived state for UI components
  const displayDiarization = useMemo(() => {
    if (!rawDiarization) return null;
    return {
      diarizedTranscript: replaceSpeakerNames(rawDiarization.diarizedTranscript)
    };
  }, [rawDiarization, replaceSpeakerNames]);

  const displaySummary = useMemo(() => {
    if (!rawSummary) return null;
    return {
      summary: replaceSpeakerNames(rawSummary.summary),
      keyDiscussionPoints: replaceSpeakerNames(rawSummary.keyDiscussionPoints),
      decisionsMade: replaceSpeakerNames(rawSummary.decisionsMade),
      actionItems: replaceSpeakerNames(rawSummary.actionItems)
    };
  }, [rawSummary, replaceSpeakerNames]);

  const displayActionItems = useMemo(() => {
    if (!rawActionItems) return null;
    return rawActionItems.map(item => ({
      ...item,
      speaker: replaceSpeakerNames(item.speaker)
    }));
  }, [rawActionItems, replaceSpeakerNames]);

  const displayParticipants = useMemo(() => Object.values(participantNames).filter(name => name.trim() !== '' && !initialSpeakers.includes(name)), [participantNames, initialSpeakers]);


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

      setRawDiarization(diarizationResult);
      setRawSummary(summaryResult);
      setRawActionItems(actionItemsResult);
    });
  }, [resolvedParams.id]);

  if (isPending && !rawDiarization) {
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
            {t('back_to_meetings')}
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold">{meetingTitle}</h1>
        <p className="text-muted-foreground mt-1">{meetingDate}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
          <TranscriptEditor 
            transcript={displayDiarization?.diarizedTranscript || ''} 
            audioUrl={audioUrl}
          />
          <SummaryView summary={displaySummary} />
        </div>
        <div className="md:col-span-1 space-y-6 sticky top-24">
          <ParticipantManager
            speakers={initialSpeakers}
            participantNames={participantNames}
            onNameChange={handleNameChange}
          />
          <ActionItems items={displayActionItems} participants={[...initialSpeakers, ...displayParticipants]} />
        </div>
      </div>
    </div>
  );
}
