"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ExtractActionItemsOutput } from "@/ai/flows/extract-action-items";
import { Bot, CheckSquare, Mail, User, Edit, Save, Trash2, PlusCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Input } from "@/components/ui/input";

interface ActionItemsProps {
    items: ExtractActionItemsOutput | null;
}

export default function ActionItems({ items: initialItems }: ActionItemsProps) {
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [editedItems, setEditedItems] = useState<ExtractActionItemsOutput>(initialItems || []);

    useEffect(() => {
        setEditedItems(initialItems || []);
    }, [initialItems]);

    const handleItemChange = (index: number, field: 'speaker' | 'actionItem', value: string) => {
        const newItems = [...editedItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setEditedItems(newItems);
    };
    
    const handleAddItem = () => {
        setEditedItems([...editedItems, { speaker: '', actionItem: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = editedItems.filter((_, i) => i !== index);
        setEditedItems(newItems);
    };

    const handleSave = () => {
        setIsEditing(false);
        // In a real app, you'd save this to a database
        console.log("Saving action items:", editedItems);
    };
    
    const handleCancel = () => {
        setIsEditing(false);
        setEditedItems(initialItems || []);
    };

    if (!initialItems || initialItems.length === 0) return null;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('action_items')}</CardTitle>
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
                        {editedItems.map((item, index) => (
                            <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2 relative">
                                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => handleRemoveItem(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                <div>
                                    <Label htmlFor={`action-item-${index}`} className="text-sm font-medium">{t('action_item')}</Label>
                                    <Input
                                        id={`action-item-${index}`}
                                        value={item.actionItem}
                                        onChange={(e) => handleItemChange(index, 'actionItem', e.target.value)}
                                        placeholder={t('enter_action_item')}
                                        className="mt-1 h-8"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`speaker-${index}`} className="text-sm font-medium">{t('assigned_to')}</Label>
                                    <Input
                                        id={`speaker-${index}`}
                                        value={item.speaker}
                                        onChange={(e) => handleItemChange(index, 'speaker', e.target.value)}
                                        placeholder={t('enter_speaker_name')}
                                        className="mt-1 h-8"
                                    />
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={handleAddItem}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t('add_action_item')}
                        </Button>
                        <div className="flex justify-end gap-2 mt-4">
                           <Button variant="ghost" onClick={handleCancel}>{t('cancel')}</Button>
                           <Button onClick={handleSave}>{t('save_action_items')}</Button>
                        </div>
                    </div>
                ) : (
                     <div className="space-y-4">
                        {editedItems.map((item, index) => (
                            <div key={index} className="p-3 bg-muted/50 rounded-lg">
                                <p className="font-medium mb-1 flex items-start">
                                    <CheckSquare className="h-4 w-4 mr-2 mt-1 text-primary shrink-0" />
                                    <span>{item.actionItem}</span>
                                </p>
                                <div className="flex items-center justify-between text-sm pl-6">
                                    <p className="text-muted-foreground flex items-center">
                                        <User className="h-4 w-4 mr-2" />
                                        {t('assigned_to')}: {item.speaker}
                                    </p>
                                    <Button variant="ghost" size="sm">
                                        <Mail className="h-4 w-4 mr-2" />
                                        {t('email')}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Bot className="h-4 w-4" />
                    <span>{t('ai_extracted_action_items')}</span>
                </div>
            </CardContent>
        </Card>
    );
}
