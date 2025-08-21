import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ExtractActionItemsOutput } from "@/ai/flows/extract-action-items";
import { Bot, CheckSquare, Mail, User } from "lucide-react";

interface ActionItemsProps {
    items: ExtractActionItemsOutput | null;
}

export default function ActionItems({ items }: ActionItemsProps) {
    if (!items || items.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg">
                            <p className="font-medium mb-1 flex items-start">
                                <CheckSquare className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                                <span>{item.actionItem}</span>
                            </p>
                            <div className="flex items-center justify-between text-sm pl-6">
                                <p className="text-muted-foreground flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    Assigned to: {item.speaker}
                                </p>
                                <Button variant="ghost" size="sm">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Bot className="h-4 w-4" />
                    <span>AI-extracted action items.</span>
                </div>
            </CardContent>
        </Card>
    );
}
