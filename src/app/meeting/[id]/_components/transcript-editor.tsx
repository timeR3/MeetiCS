"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bot, Edit, Save, Music4, RefreshCw, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/context/language-context";

interface TranscriptEditorProps {
    transcript: string;
    audioUrl: string;
    onRetranscribe: () => void;
    isProcessing: boolean;
}

const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[1]) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

const parseTranscript = (transcript: string) => {
    const lines = transcript.split('\n').filter(line => line.trim() !== '');
    return lines.map((line) => {
        const parts = line.split(':');
        const speaker = parts.length > 1 ? parts[0].trim() : `Speaker`;
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : line;
        return { speaker, text };
    });
};

export default function TranscriptEditor({ transcript: initialTranscript, audioUrl, onRetranscribe, isProcessing }: TranscriptEditorProps) {
    const [transcript, setTranscript] = useState(initialTranscript);
    const [isEditing, setIsEditing] = useState(false);
    const { t } = useLanguage();
    
    // Update internal state if the prop changes (e.g., from parent)
    useState(() => {
        setTranscript(initialTranscript);
    });

    const parsedTranscript = parseTranscript(transcript);

    const handleSave = () => {
        setIsEditing(false);
        // In a real app, you would probably want to notify the parent
        // that the transcript has been manually edited.
        console.log("Saving manual transcript edits:", transcript);
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        setTranscript(initialTranscript); // Revert to original prop
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center"><Music4 className="mr-2 h-5 w-5" /> {t('transcript')}</CardTitle>
                <div>
                    {isEditing ? (
                        <div className="flex gap-2">
                             <Button variant="ghost" size="sm" onClick={handleCancel}>
                                {t('cancel')}
                             </Button>
                             <Button variant="default" size="sm" onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" /> {t('save')}
                             </Button>
                        </div>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" /> {t('edit')}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="p-2 bg-muted/50 rounded-lg mb-4 flex items-center gap-2">
                    <audio controls src={audioUrl} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                    <Button variant="outline" size="icon" onClick={onRetranscribe} disabled={isProcessing} aria-label={t('retranscribe')}>
                        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    </Button>
                </div>
                
                <Separator className="my-4" />

                {isEditing ? (
                    <Textarea 
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        className="min-h-[400px] text-base font-mono"
                    />
                ) : (
                    <ScrollArea className="h-[45vh] pr-4">
                      <div className="space-y-6">
                          {parsedTranscript.map((line, index) => (
                              <div key={index} className="flex items-start gap-4">
                                  <Avatar className="mt-1">
                                      <AvatarFallback>{getInitials(line.speaker)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                      <p className="font-semibold text-primary">{line.speaker}</p>
                                      <p className="text-foreground/80 leading-relaxed">{line.text}</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                    </ScrollArea>
                )}
                 <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Bot className="h-4 w-4" />
                    <span>{t('ai_generated_transcript')}</span>
                </div>
            </CardContent>
        </Card>
    );
}
