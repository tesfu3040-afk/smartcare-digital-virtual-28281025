import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings } from "@/hooks/use-app-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, MessageSquare, DollarSign, ArrowLeft, Landmark, Info } from "lucide-react";
import { toast } from "sonner";
import clinicalBg from "@/assets/clinical-bg.png";

export default function BookAppointment() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { settings } = useAppSettings();
  const [doctor, setDoctor] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("video");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId) return;
    const fetchDoctor = async () => {
      const { data: doctorData } = await supabase
        .from("doctors")
        .select("*")
        .eq("user_id", doctorId)
        .maybeSingle();
      if (doctorData) {
        setDoctor(doctorData);
        const { data: profileData } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("user_id", doctorId)
          .maybeSingle();
        setProfile(profileData);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !doctorId) {
      toast.error("Please sign in to book");
      navigate("/auth");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("appointments").insert({
      patient_id: user.id,
      doctor_id: doctorId,
      appointment_date: date,
      appointment_time: time,
      consultation_type: type,
      notes: notes.trim(),
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Appointment booked! Please transfer the fee and upload your receipt from your dashboard.");
      navigate("/patient-dashboard");
    }
    setLoading(false);
  };

  if (!doctor) {
    return (
      <div className="container py-20 text-center text-muted-foreground">Loading doctor information...</div>
    );
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const hasBankInfo = settings.bank_account_number && settings.bank_name;

  return (
    <div>
      <section className="relative py-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(211, 80%, 35%) 0%, hsl(211, 80%, 42%) 50%, hsl(199, 89%, 40%) 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${clinicalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container text-center max-w-3xl relative z-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Book Appointment</h1>
          <p className="mt-2 text-white/80">Schedule your consultation with a healthcare professional</p>
        </div>
      </section>
      <div className="container py-8 max-w-2xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">Book Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Doctor info */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 mb-6">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-lg">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">
                Dr. {profile?.first_name} {profile?.last_name}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant="secondary">{doctor.specialty || "General"}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />${doctor.consultation_fee}
                </span>
              </div>
            </div>
          </div>

          {/* Bank / Payment Info */}
          {hasBankInfo && (
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 mb-6 space-y-2">
              <div className="flex items-center gap-2 text-primary font-display font-semibold text-sm">
                <Landmark className="h-4 w-4" /> Payment Information
              </div>
              <p className="text-sm text-muted-foreground">
                {settings.payment_instructions}
              </p>
              <div className="text-sm text-foreground space-y-1">
                <p><span className="font-medium">Bank:</span> {settings.bank_name}</p>
                <p><span className="font-medium">Account:</span> {settings.bank_account_number}</p>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground mt-1">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>After booking, upload your payment receipt from your dashboard.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={minDate} required />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} min={doctor.available_start_time} max={doctor.available_end_time} required />
              </div>
            </div>
            <div>
              <Label>Consultation Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2"><Video className="h-4 w-4" /> Video Call</div>
                  </SelectItem>
                  <SelectItem value="chat">
                    <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Chat</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe your symptoms or reason for visit..." maxLength={500} rows={3} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
