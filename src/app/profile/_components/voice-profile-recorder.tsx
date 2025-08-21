"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Play, Trash2, Save, Loader2 } from "lucide-react";

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function VoiceProfileRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        // Simular la carga de un perfil de voz existente
        const existingProfile = localStorage.getItem("voice_profile_url");
        if (existingProfile) {
            setAudioUrl(existingProfile);
        }
    }, []);

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
                setAudioUrl(URL.createObjectURL(blob));
                chunksRef.current = [];
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            setAudioBlob(null);
            setAudioUrl(null);
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
    };

    const handleSaveProfile = async () => {
        if (!audioBlob) return;
        setIsSaving(true);
        
        // --- Simulación de Carga y Guardado ---
        // En una aplicación real:
        // 1. Subirías el `audioBlob` a un servicio de almacenamiento (Firebase Storage, S3, etc.).
        // 2. Obtendrías la URL pública del archivo subido.
        // 3. Guardarías esa URL en la tabla `users` de tu base de datos MySQL.

        console.log("Simulating: Uploading blob of size", audioBlob.size);
        
        // Para este prototipo, convertiremos el blob a un Data URI y lo guardaremos en localStorage.
        const audioDataUri = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(audioBlob);
        });

        // Simular un pequeño retraso de red
        await new Promise(resolve => setTimeout(resolve, 1500));

        localStorage.setItem("voice_profile_url", audioDataUri);
        console.log("Saved voice profile to localStorage:", audioDataUri.substring(0, 50) + "...");
        
        setIsSaving(false);
        alert("Voice profile saved successfully! (Simulated)");
    };

    const handleDeleteProfile = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        localStorage.removeItem("voice_profile_url");
        alert("Voice profile deleted. (Simulated)");
    };

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Record a short sample of your voice. This will be used to automatically identify you in future meeting transcriptions. Please say the following sentence clearly: <br />
                <span className="font-semibold text-foreground mt-1 block">"Hi, my name is [Your Name], and I'm recording this sample to create my voice profile."</span>
            </p>

            <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                {!isRecording && !audioUrl && (
                    <Button onClick={startRecording}>
                        <Mic className="mr-2 h-4 w-4" />
                        Start Recording
                    </Button>
                )}

                {isRecording && (
                    <div className="flex items-center gap-4">
                        <Button onClick={stopRecording} variant="destructive">
                            <StopCircle className="mr-2 h-4 w-4" />
                            Stop Recording
                        </Button>
                        <p className="text-lg font-mono tabular-nums">{formatTime(recordingTime)}</p>
                    </div>
                )}
                
                {audioUrl && !isRecording && (
                    <div className="w-full flex items-center gap-4">
                        <audio controls src={audioUrl} className="flex-1" />
                        <Button variant="outline" size="icon" onClick={handleDeleteProfile}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
            
            {audioBlob && (
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Voice Profile
                </Button>
            )}
        </div>
    );
}
