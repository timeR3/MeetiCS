"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Trash2, Save, Loader2, HardDriveUpload, PlayCircle, PauseCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface VoiceProfileRecorderProps {
    onSave?: (audioDataUri: string) => void;
    initialAudioUrl?: string | null;
}

export default function VoiceProfileRecorder({ onSave, initialAudioUrl }: VoiceProfileRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(initialAudioUrl || null);
    
    const [isSaving, setIsSaving] = useState(false);
    const [fileName, setFileName] = useState("");

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        setAudioUrl(initialAudioUrl || null);
    }, [initialAudioUrl]);

    useEffect(() => {
        // Clean up on component unmount
        return () => {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        };
      }, []);

    const resetState = () => {
        setIsRecording(false);
        setIsPaused(false);
        setRecordingTime(0);
        setAudioBlob(null);
        setAudioFile(null);
        setAudioUrl(null);
        setFileName("");
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    const startRecording = async () => {
        resetState();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                chunksRef.current.push(event.data);
            };
            
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                chunksRef.current = [];
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime(prevTime => prevTime + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access was denied. Please allow microphone access in your browser settings.");
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          resetState();
          setFileName(file.name);
          setAudioFile(file);
          setAudioUrl(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async () => {
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
            alert("No audio source to save.");
            return;
        }

        setIsSaving(true);
        
        // Simulating save operation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (onSave) {
            onSave(audioDataUri);
        } else {
            // Default behavior if no onSave prop is provided (e.g., save to localStorage)
            localStorage.setItem("voice_profile_url", audioDataUri);
            console.log("Saved voice profile to localStorage:", audioDataUri.substring(0, 50) + "...");
        }

        setIsSaving(false);
        alert("Voice profile saved successfully! (Simulated)");
    };

    const handleDeleteProfile = () => {
        resetState();
        if (onSave) {
            onSave(""); // Notify parent to clear the profile
        } else {
            localStorage.removeItem("voice_profile_url");
        }
        alert("Voice profile deleted. (Simulated)");
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Record a short sample of your voice or upload an audio file. This will be used to automatically identify you in future meeting transcriptions. When recording, please say the following sentence clearly: <br />
                <span className="font-semibold text-foreground mt-1 block">"Hi, my name is [Your Name], and I'm recording this sample to create my voice profile."</span>
            </p>

             <Tabs defaultValue="record" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="record">Record Voice</TabsTrigger>
                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>
                <TabsContent value="record" className="py-4 text-center">
                    <div className="flex flex-col items-center justify-center min-h-[120px] bg-muted/50 rounded-lg p-4">
                        {!isRecording && !audioBlob && (
                            <Button type="button" variant="ghost" className="h-auto p-4 flex flex-col gap-2" onClick={startRecording}>
                                <Mic className="h-10 w-10 text-destructive" />
                                <span className="text-sm font-medium">Start Recording</span>
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
                    </div>
                </TabsContent>
                <TabsContent value="upload" className="py-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="audio-file" className="sr-only">Audio File</Label>
                        <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary transition-colors">
                            <HardDriveUpload className="h-10 w-10 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Drag & drop or browse</p>
                            <Input id="audio-file" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept="audio/*" />
                        </div>
                        {fileName && <p className="text-sm text-muted-foreground mt-2">Selected file: {fileName}</p>}
                    </div>
                </TabsContent>
             </Tabs>

            {audioUrl && (
                 <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                    <div className="w-full flex items-center gap-4">
                        <audio controls src={audioUrl} className="flex-1" />
                        <Button variant="outline" size="icon" onClick={handleDeleteProfile}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
            
            {(audioBlob || audioFile) && (
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Voice Profile
                </Button>
            )}
        </div>
    );
}
