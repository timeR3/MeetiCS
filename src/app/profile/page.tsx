
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// In a real app, this data would come from an API/database.
const loggedInUser = {
    id: "user-1",
    name: "Alex Doe",
    email: "alex.doe@example.com",
    avatarUrl: "https://placehold.co/100x100.png",
    voiceProfileUrl: "" 
};

const allUsers = [
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
    
    // The user currently being displayed/managed.
    // Defaults to the logged-in user. In admin mode, this can be changed.
    const [selectedUser, setSelectedUser] = useState(loggedInUser);

    const handleProfileSave = (url: string) => {
        // Update the profile for the selected user
        const updatedUsers = managedUsers.map(u => 
            u.id === selectedUser.id ? { ...u, voiceProfileUrl: url } : u
        );
        setManagedUsers(updatedUsers);
        
        // If the updated user is the currently selected one, update its state too
        if (selectedUser.id === selectedUser.id) {
             setSelectedUser(prev => ({...prev!, voiceProfileUrl: url}));
        }
    };
    
    const handleAdminViewChange = (isAdmin: boolean) => {
        setIsAdminView(isAdmin);
        // When switching back to user view, always reset to the logged-in user.
        if (!isAdmin) {
            setSelectedUser(loggedInUser);
        }
    };

    const handleUserSelect = (userId: string) => {
        const userToManage = managedUsers.find(u => u.id === userId);
        if (userToManage) {
            setSelectedUser(userToManage);
        }
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
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5"/> Select User</CardTitle>
                                <CardDescription>Choose a user to view and manage their profile.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Select onValueChange={handleUserSelect} defaultValue={selectedUser.id}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a user..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {managedUsers.map(user => (
                                            <SelectItem key={user.id} value={user.id}>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={user.avatarUrl} />
                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{user.name} ({user.email})</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
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
                                     key={selectedUser.id} // Re-mount component if user changes
                                     onSave={handleProfileSave}
                                     initialAudioUrl={selectedUser.voiceProfileUrl}
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
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
