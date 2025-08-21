"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { SummarizeMeetingOutput } from "@/ai/flows/summarize-meeting";
import { Bot, Edit, Save } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SummaryViewProps {
    summary: SummarizeMeetingOutput | null;
}

const formatList = (text: string) => {
    return text.split('\n').filter(item => item.trim() && item.trim() !== '-').map((item, index) => (
        <li key={index}>{item.replace(/^-/, '').trim()}</li>
    ));
};

export default function SummaryView({ summary: initialSummary }: SummaryViewProps) {
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [editedSummary, setEditedSummary] = useState<SummarizeMeetingOutput | null>(initialSummary);

    useEffect(() => {
        setEditedSummary(initialSummary);
    }, [initialSummary]);

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save the editedSummary state to your backend
        console.log("Saved Summary:", editedSummary);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedSummary(initialSummary);
    };

    if (!editedSummary) return null;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('ai_summary')}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? (
                        <>
                            <Save className="mr-2 h-4 w-4" /> {t('save')}
                        </>
                    ) : (
                        <>
                            <Edit className="mr-2 h-4 w-4" /> {t('edit')}
                        </>
                    )}
                </Button>
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="summary-text" className="text-sm font-medium">{t('summary')}</Label>
                            <Textarea
                                id="summary-text"
                                value={editedSummary.summary}
                                onChange={(e) => setEditedSummary({ ...editedSummary, summary: e.target.value })}
                                className="mt-1"
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="discussion-points" className="text-sm font-medium">{t('key_discussion_points')}</Label>
                            <Textarea
                                id="discussion-points"
                                value={editedSummary.keyDiscussionPoints}
                                onChange={(e) => setEditedSummary({ ...editedSummary, keyDiscussionPoints: e.target.value })}
                                className="mt-1"
                                rows={6}
                            />
                        </div>
                        <div>
                            <Label htmlFor="decisions-made" className="text-sm font-medium">{t('decisions_made')}</Label>
                            <Textarea
                                id="decisions-made"
                                value={editedSummary.decisionsMade}
                                onChange={(e) => setEditedSummary({ ...editedSummary, decisionsMade: e.target.value })}
                                className="mt-1"
                                rows={4}
                            />
                        </div>
                         {isEditing && (
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={handleCancel}>{t('cancel')}</Button>
                                <Button onClick={handleSave}>{t('save_summary')}</Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <p className="text-muted-foreground mb-4">{editedSummary.summary}</p>
                        
                        <Accordion type="single" collapsible className="w-full" defaultValue="discussion">
                            <AccordionItem value="discussion">
                                <AccordionTrigger>{t('key_discussion_points')}</AccordionTrigger>
                                <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                                    <ul className="list-disc pl-5 space-y-1">
                                        {formatList(editedSummary.keyDiscussionPoints)}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="decisions">
                                <AccordionTrigger>{t('decisions_made')}</AccordionTrigger>
                                <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                                <ul className="list-disc pl-5 space-y-1">
                                        {formatList(editedSummary.decisionsMade)}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </>
                )}
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Bot className="h-4 w-4" />
                    <span>{t('ai_generated_summary')}</span>
                </div>
            </CardContent>
        </Card>
    );
}
