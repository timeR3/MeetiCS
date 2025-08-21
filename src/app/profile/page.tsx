"use client"

import { useState } from "react";
import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VoiceProfileRecorder from "./_components/voice-profile-recorder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";


export default function ProfilePage() {
    // In a real app, user details would come from a session or API.
    const [user, setUser] = useState({
        name: "Alex Doe",
        email: "alex.doe@example.com",
        avatarUrl: "https://placehold.co/100x100.png",
        voiceProfileUrl: "" // This would be fetched from DB
    });

    const [isAdminView, setIsAdminView] = useState(false);

    const handleProfileSave = (url: string) => {
        setUser(prev => ({...prev, voiceProfileUrl: url}));
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                            {isAdminView ? "Manage User Profile" : "My Profile"}
                        </h1>
                        <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <Label htmlFor="admin-mode">Admin View</Label>
                            <Switch id="admin-mode" checked={isAdminView} onCheckedChange={setIsAdminView} />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-2 space-y-8">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Voice Profile</CardTitle>
                                    <CardDescription>
                                        {isAdminView
                                            ? "Upload a voice sample for this user."
                                            : "Manage your voice profile for automatic speaker identification."
                                        }
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                   <VoiceProfileRecorder 
                                     key={user.email} // Re-mount component if user changes
                                     onSave={handleProfileSave}
                                     initialAudioUrl={user.voiceProfileUrl}
                                   />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Change Password</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <Input id="current-password" type="password" disabled={isAdminView} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input id="new-password" type="password" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <Input id="confirm-password" type="password" />
                                    </div>
                                    <Button className="w-full">Update Password</Button>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6 sticky top-24">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col items-center space-y-4">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <Button variant="outline" size="sm">Change Photo</Button>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" defaultValue={user.name} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue={user.email} />
                                    </div>
                                    <Button className="w-full">Save Changes</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
