
"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NewMeetingDialog from "@/components/new-meeting-dialog";
import { Header } from "@/components/header";
import { MeetingCard } from "@/components/meeting-card";
import { useLanguage } from "@/context/language-context";

const initialMeetings = [
  {
    id: '1',
    title: 'Project Phoenix - Q3 Planning',
    date: '2023-08-15',
    participants: 5,
    duration: '45min',
  },
  {
    id: '2',
    title: 'Marketing Sync-up',
    date: '2023-08-14',
    participants: 8,
    duration: '30min',
  },
  {
    id: '3',
    title: 'User Interview Debrief',
    date: '2023-08-14',
    participants: 3,
    duration: '60min',
  },
  {
    id: '4',
    title: 'All-Hands Q&A',
    date: '2023-08-12',
    participants: 120,
    duration: '55min',
  },
];

export default function Dashboard() {
  const { t } = useLanguage();
  const [meetings, setMeetings] = useState(initialMeetings);

  const handleMeetingCreated = (newMeeting: any) => {
    // A more robust solution would involve proper state management (e.g., Context, Redux)
    // and persisting this to a backend. For now, we update local state.
    setMeetings(prevMeetings => [
        {
          id: newMeeting.id,
          title: newMeeting.title,
          date: newMeeting.date.split('T')[0], // Extract just the date part
          participants: 0, // We don't know participants yet
          duration: newMeeting.duration,
        },
        ...prevMeetings
    ]);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('your_meetings')}
            </h1>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder={t('search_meetings')} className="pl-10" />
              </div>
              <NewMeetingDialog onMeetingCreated={handleMeetingCreated}>
                <Button className="w-full md:w-auto" variant="default">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  {t('new_meeting')}
                </Button>
              </NewMeetingDialog>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {meetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
             <Card className="flex items-center justify-center border-dashed border-2 hover:border-primary transition-colors duration-200 group">
                <CardContent className="p-6 text-center">
                    <NewMeetingDialog onMeetingCreated={handleMeetingCreated}>
                        <Button variant="ghost" className="h-auto p-4 flex flex-col gap-2">
                            <PlusCircle className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium">{t('new_meeting')}</span>
                        </Button>
                    </NewMeetingDialog>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
