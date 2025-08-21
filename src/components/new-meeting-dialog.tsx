"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HardDriveUpload, Mic, Loader2 } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

export default function NewMeetingDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("");
  const router = useRouter();
  const { t } = useLanguage();


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate processing delay then navigate to meeting page
    setTimeout(() => {
      const newMeetingId = Date.now().toString(); // Use timestamp as a unique ID for demo
      router.push(`/meeting/${newMeetingId}`);
      setIsProcessing(false);
      setOpen(false);
    }, 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{t('start_new_meeting')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">{t('upload')}</TabsTrigger>
              <TabsTrigger value="record">{t('record')}</TabsTrigger>
              <TabsTrigger value="connect">{t('connect')}</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="py-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="audio-file" className="sr-only">Audio File</Label>
                <div className="relative border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-primary transition-colors">
                    <HardDriveUpload className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('drag_and_drop') }} />
                    <Input id="audio-file" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                </div>
                {fileName && <p className="text-sm text-muted-foreground mt-2">{t('selected_file')}: {fileName}</p>}
              </div>
            </TabsContent>
            <TabsContent value="record" className="py-4 text-center">
              <div className="flex flex-col items-center justify-center h-40">
                <Button type="button" size="lg" variant="destructive" className="rounded-full h-20 w-20">
                    <Mic className="h-10 w-10" />
                </Button>
                <p className="mt-4 text-lg font-semibold">{t('click_to_record')}</p>
                <p className="text-sm text-muted-foreground">{t('record_coming_soon')}</p>
              </div>
            </TabsContent>
            <TabsContent value="connect" className="py-4">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">{t('connect_coming_soon')}</p>
                    <Button type="button" className="w-full justify-start" variant="outline" disabled>
                        <Image src="https://placehold.co/24x24.png" alt="Zoom" width={24} height={24} className="mr-2" data-ai-hint="zoom logo" />
                        {t('connect_zoom')}
                    </Button>
                    <Button type="button" className="w-full justify-start" variant="outline" disabled>
                        <Image src="https://placehold.co/24x24.png" alt="Google Meet" width={24} height={24} className="mr-2" data-ai-hint="google meet logo"/>
                        {t('connect_gmeet')}
                    </Button>
                    <Button type="button" className="w-full justify-start" variant="outline" disabled>
                        <Image src="https://placehold.co/24x24.png" alt="Microsoft Teams" width={24} height={24} className="mr-2" data-ai-hint="microsoft teams logo"/>
                        {t('connect_teams')}
                    </Button>
                </div>
            </TabsContent>
          </Tabs>
          <Button type="submit" className="w-full mt-4" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('processing')}...
              </>
            ) : (
              t('transcribe_meeting')
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
