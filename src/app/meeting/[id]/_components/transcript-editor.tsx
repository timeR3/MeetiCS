"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bot, Edit, Save, Music4 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranscriptEditorProps {
    initialTranscript: string;
    audioUrl: string;
}

const getInitials = (name: string) => {
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


export default function TranscriptEditor({ initialTranscript, audioUrl }: TranscriptEditorProps) {
    const [transcript, setTranscript] = useState(initialTranscript);
    const [isEditing, setIsEditing] = useState(false);
    
    const parsedTranscript = parseTranscript(transcript);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center"><Music4 className="mr-2 h-5 w-5" /> Transcript</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? (
                        <>
                            <Save className="mr-2 h-4 w-4" /> Save
                        </>
                    ) : (
                        <>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </>
                    )}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="p-2 bg-muted/50 rounded-lg mb-4">
                    <audio controls src={audioUrl} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
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
                    <span>AI-generated transcript. You can edit it for accuracy.</span>
                </div>
            </CardContent>
        </Card>
    );
}
