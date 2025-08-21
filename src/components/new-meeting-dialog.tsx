
"use client";

import { useState, type ReactNode, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HardDriveUpload, Mic, Loader2, StopCircle, PauseCircle, PlayCircle } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

export default function NewMeetingDialog({ children, onMeetingCreated }: { children: ReactNode, onMeetingCreated: (meeting: any) => void }) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState<Date | null>(null);


  useEffect(() => {
    if (open) {
      // Set the meeting date only when the dialog is opened
      setMeetingDate(new Date());
    } else {
      // Reset state when dialog closes
      setTitle("");
      setAudioFile(null);
      setAudioBlob(null);
      setFileName("");
      setRecordingTime(0);
      setIsRecording(false);
      setIsPaused(false);
      setIsProcessing(false);
    }

    // Clean up on component unmount
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setAudioFile(file);
      setAudioBlob(null); // Clear recorded blob if a file is selected
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        chunksRef.current = [];
        stream.getTracks().forEach(track => track.stop()); // Stop microphone access
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioBlob(null);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert(t('mic_error'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
    setIsPaused(false);
  };
  
  const togglePauseResume = () => {
      if (!mediaRecorderRef.current) return;

      if (isPaused) {
          mediaRecorderRef.current.resume();
          timerIntervalRef.current = setInterval(() => {
              setRecordingTime(prevTime => prevTime + 1);
          }, 1000);
      } else {
          mediaRecorderRef.current.pause();
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      }
      setIsPaused(!isPaused);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let audioDataUri: string | null = null;
    
    if (audioBlob) {
        audioDataUri = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(audioBlob);
        });
    } else if (audioFile) {
        audioDataUri = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(audioFile);
        });
    }

    if (!audioDataUri) {
      alert(t('no_audio_error'));
      return;
    }
    
    setIsProcessing(true);

    try {
      const newMeetingId = Date.now().toString();
      const meetingTitle = title || `Meeting ${newMeetingId}`;

      const newMeeting = {
        id: newMeetingId,
        title: meetingTitle,
        date: meetingDate?.toISOString(),
        audioDataUri: audioDataUri,
        duration: formatTime(recordingTime)
      };

      sessionStorage.setItem(`meeting_details_${newMeetingId}`, JSON.stringify(newMeeting));
      
      onMeetingCreated(newMeeting);
      
      router.push(`/meeting/${newMeetingId}`);
      setOpen(false); // This will trigger the useEffect cleanup and state reset

    } catch(error) {
      console.error("Processing error:", error);
      alert(t('transcription_error'));
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t('start_new_meeting')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
           <div className="space-y-2 mb-4">
              <Label htmlFor="meeting-title">Meeting Title</Label>
              <Input 
                id="meeting-title" 
                placeholder="E.g., Q3 Project Kick-off" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">{t('upload')}</TabsTrigger>
              <TabsTrigger value="record">{t('record')}</TabsTrigger>
              <TabsTrigger value="connect">{t('connect')}</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="py-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="audio-file" className="sr-only">Audio File</Label>
                <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-primary transition-colors">
                    <HardDriveUpload className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('drag_and_drop') }} />
                    <Input id="audio-file" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="audio/*" />
                </div>
                {fileName && <p className="text-sm text-muted-foreground mt-2">{t('selected_file')}: {fileName}</p>}
              </div>
            </TabsContent>
            <TabsContent value="record" className="py-4 text-center">
              <div className="flex flex-col items-center justify-center h-40">
                  {!isRecording && !audioBlob && (
                      <Button type="button" size="lg" variant="destructive" className="rounded-full h-20 w-20" onClick={startRecording}>
                          <Mic className="h-10 w-10" />
                      </Button>
                  )}

                  {isRecording && (
                      <div className="flex flex-col items-center gap-4">
                          <p className="text-3xl font-mono tabular-nums">{formatTime(recordingTime)}</p>
                          <div className="flex gap-4">
                              <Button type="button" size="icon" variant="secondary" onClick={togglePauseResume}>
                                  {isPaused ? <PlayCircle className="h-6 w-6"/> : <PauseCircle className="h-6 w-6" />}
                              </Button>
                              <Button type="button" size="icon" variant="destructive" onClick={stopRecording}>
                                  <StopCircle className="h-6 w-6" />
                              </Button>
                          </div>
                      </div>
                  )}

                  {audioBlob && !isRecording && (
                    <div className="flex flex-col items-center gap-2">
                      <p>{t('recording_finished')}</p>
                      <p className="font-semibold">{formatTime(recordingTime)}</p>
                      <Button type="button" variant="link" onClick={startRecording}>{t('record_again')}</Button>
                    </div>
                  )}
                  
                  <p className="mt-4 text-lg font-semibold">
                    {isRecording ? (isPaused ? t('recording_paused') : t('recording')) : t('click_to_record')}
                  </p>
              </div>
            </TabsContent>
            <TabsContent value="connect" className="py-4">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">{t('connect_coming_soon')}</p>
                    <Button type="button" className="w-full justify-start" variant="outline" disabled>
                        <Image src="https://placehold.co/24x24.png" alt="Zoom" width={24} height={24} className="mr-2" data-ai-hint="zoom logo" />
                        {t('connect_zoom')}
                    </Button>
                    <Button type="button" className="w-full justify-start" variant="outline" disabled>
                        <Image src="https://placehold.co/24x24.png" alt="Google Meet" width={24} height={24} className="mr-2" data-ai-hint="google meet logo"/>
                        {t('connect_gmeet')}
                    </Button>
                    <Button type="button" className="w-full justify-start" variant="outline" disabled>
                        <Image src="https://placehold.co/24x24.png" alt="Microsoft Teams" width={24} height={24} className="mr-2" data-ai-hint="microsoft teams logo"/>
                        {t('connect_teams')}
                    </Button>
                </div>
            </TabsContent>
          </Tabs>
          <Button type="submit" className="w-full mt-4" disabled={isProcessing || (!audioFile && !audioBlob)}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('processing')}...
              </>
            ) : (
              t('transcribe_meeting')
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
