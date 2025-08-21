"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Save, Users, Bot } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface ParticipantManagerProps {
    transcript: string;
}

const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[1]) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

export default function ParticipantManager({ transcript }: ParticipantManagerProps) {
    const { t } = useLanguage();
    const speakers = useMemo(() => {
        const speakerSet = new Set<string>();
        transcript.split('\n').forEach(line => {
            const match = line.match(/^(.*?):/);
            if (match && match[1]) {
                speakerSet.add(match[1].trim());
            }
        });
        return Array.from(speakerSet);
    }, [transcript]);

    const [participantNames, setParticipantNames] = useState<Record<string, string>>(
        speakers.reduce((acc, speaker) => ({ ...acc, [speaker]: "" }), {})
    );

    const handleNameChange = (speaker: string, name: string) => {
        setParticipantNames(prev => ({ ...prev, [speaker]: name }));
    };

    const handleSave = () => {
        // In a real app, you'd save this to a database
        console.log("Saving participant names:", participantNames);
        alert(t('participant_names_saved'));
    };

    if (speakers.length === 0) return null;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" /> {t('participants')}</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    {t('save_names')}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {speakers.map(speaker => (
                        <div key={speaker} className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback>{getInitials(participantNames[speaker] || speaker)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-primary">{speaker}</p>
                                <Input
                                    type="text"
                                    placeholder={t('enter_participant_name')}
                                    value={participantNames[speaker] || ""}
                                    onChange={(e) => handleNameChange(speaker, e.target.value)}
                                    className="h-8 mt-1"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Bot className="h-4 w-4" />
                    <span>{t('assign_names_to_speakers')}</span>
                </div>
            </CardContent>
        </Card>
    );
}
