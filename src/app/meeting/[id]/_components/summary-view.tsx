import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { SummarizeMeetingOutput } from "@/ai/flows/summarize-meeting";
import { Bot } from "lucide-react";

interface SummaryViewProps {
    summary: SummarizeMeetingOutput | null;
}

const formatList = (text: string) => {
    return text.split('\n').filter(item => item.trim() && item.trim() !== '-').map((item, index) => (
        <li key={index}>{item.replace(/^-/, '').trim()}</li>
    ));
};

export default function SummaryView({ summary }: SummaryViewProps) {
    if (!summary) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">{summary.summary}</p>
                
                <Accordion type="single" collapsible className="w-full" defaultValue="discussion">
                    <AccordionItem value="discussion">
                        <AccordionTrigger>Key Discussion Points</AccordionTrigger>
                        <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                            <ul className="list-disc pl-5 space-y-1">
                                {formatList(summary.keyDiscussionPoints)}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="decisions">
                        <AccordionTrigger>Decisions Made</AccordionTrigger>
                        <AccordionContent className="prose prose-sm max-w-none text-muted-foreground">
                           <ul className="list-disc pl-5 space-y-1">
                                {formatList(summary.decisionsMade)}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Bot className="h-4 w-4" />
                    <span>AI-generated summary.</span>
                </div>
            </CardContent>
        </Card>
    );
}
