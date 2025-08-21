import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VoiceProfileRecorder from "./_components/voice-profile-recorder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    // En una aplicación real, los detalles del usuario vendrían de una sesión o API.
    const user = {
        name: "Alex Doe",
        email: "alex.doe@example.com",
        avatarUrl: "https://placehold.co/100x100.png"
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                        User Profile
                    </h1>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Voice Profile</CardTitle>
                                </CardHeader>
                                <CardContent>
                                   <VoiceProfileRecorder />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
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
