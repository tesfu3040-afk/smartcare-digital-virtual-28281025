import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, PhoneOff } from "lucide-react";

interface VideoCallProps {
  appointment: any;
  userName: string;
  onClose: () => void;
}

export default function VideoCall({ appointment, userName, onClose }: VideoCallProps) {
  const roomName = `smartcare-${appointment.id}`;
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${encodeURIComponent(userName)}"&config.prejoinConfig.enabled=false&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  return (
    <Card className="flex flex-col h-[80vh]">
      <CardHeader className="py-3 border-b flex flex-row items-center justify-between">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          Video Consultation
          <span className="text-xs text-muted-foreground font-normal ml-2">
            {appointment.appointment_date} at {appointment.appointment_time}
          </span>
        </CardTitle>
        <Button variant="destructive" size="sm" onClick={onClose}>
          <PhoneOff className="h-4 w-4 mr-1" /> End Call
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
          className="w-full h-full border-0 rounded-b-lg"
          title="Video Call"
        />
      </CardContent>
    </Card>
  );
}
