
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
import { Shield, Users } from "lucide-react";
import UserTable from "./_components/user-table";
import type { User } from "./_components/user-table";

// In a real app, this data would come from an API/database.
const loggedInUser: User = {
    id: "user-1",
    name: "Alex Doe",
    email: "alex.doe@example.com",
    avatarUrl: "https://placehold.co/100x100.png",
    voiceProfileUrl: "" 
};

const allUsers: User[] = [
    loggedInUser,
    {
        id: "user-2",
        name: "Samantha Green",
        email: "samantha.g@example.com",
        avatarUrl: "https://placehold.co/100x100.png",
        voiceProfileUrl: ""
    },
    {
        id: "user-3",
        name: "Peter Jones",
        email: "peter.j@example.com",
        avatarUrl: "https://placehold.co/100x100.png",
        voiceProfileUrl: "https://storage.googleapis.com/genkit-public/peter_jones_voice.mp3"
    },
];


export default function ProfilePage() {
    const [isAdminView, setIsAdminView] = useState(false);
    const [managedUsers, setManagedUsers] = useState(allUsers);
    
    const [selectedUser, setSelectedUser] = useState(loggedInUser);

    const handleProfileSave = (url: string) => {
        const updatedUsers = managedUsers.map(u => 
            u.id === selectedUser.id ? { ...u, voiceProfileUrl: url } : u
        );
        setManagedUsers(updatedUsers);
        
        if (selectedUser.id === selectedUser.id) {
             setSelectedUser(prev => ({...prev!, voiceProfileUrl: url}));
        }
    };
    
    const handleAdminViewChange = (isAdmin: boolean) => {
        setIsAdminView(isAdmin);
        if (!isAdmin) {
            setSelectedUser(loggedInUser);
        }
    };

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                            {isAdminView ? "Manage User Profiles" : "My Profile"}
                        </h1>
                        <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <Label htmlFor="admin-mode">Admin View</Label>
                            <Switch id="admin-mode" checked={isAdminView} onCheckedChange={handleAdminViewChange} />
                        </div>
                    </div>
                    
                    {isAdminView && (
                        <div className="mb-8">
                            <UserTable 
                                users={managedUsers} 
                                selectedUser={selectedUser} 
                                onSelectUser={handleUserSelect} 
                            />
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-2 space-y-8">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Voice Profile</CardTitle>
                                    <CardDescription>
                                        {isAdminView
                                            ? "Manage this user's voice profile for automatic speaker identification."
                                            : "Manage your voice profile for automatic speaker identification."
                                        }
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                   <VoiceProfileRecorder 
                                     key={selectedUser.id}
                                     onSave={handleProfileSave}
                                     initialAudioUrl={selectedUser.voiceProfileUrl}
                                   />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6 sticky top-24">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex flex-col items-center space-y-4">
                                            <Avatar className="h-24 w-24">
                                                <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                                                <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <Button variant="outline" size="sm">Change Photo</Button>
                                        </div>
                                        <Separator />
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" defaultValue={selectedUser.name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" defaultValue={selectedUser.email} disabled={isAdminView} />
                                        </div>
                                        <Button className="w-full">Save Changes</Button>
                                    </div>
                                    <Separator />
                                     <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Change Password</h3>
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input id="current-password" type="password" disabled={isAdminView} placeholder="••••••••" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" placeholder="••••••••" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input id="confirm-password" type="password" placeholder="••••••••" />
                                        </div>
                                        <Button className="w-full">Update Password</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
