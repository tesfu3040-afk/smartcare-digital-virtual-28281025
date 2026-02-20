import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings } from "@/hooks/use-app-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Stethoscope,
  Calendar,
  CheckCircle,
  Shield,
  TrendingUp,
  Plus,
  DollarSign,
  Image,
  XCircle,
  Settings,
  MessageSquare,
  Upload,
  Trash2,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

const PRESET_SPECIALTIES = [
  "General Practice", "Cardiology", "Dermatology", "Neurology",
  "Orthopedics", "Pediatrics", "Psychiatry", "Gynecology",
  "Ophthalmology", "ENT", "Anesthesiology", "Midwifery",
  "Geriatrics", "Maternal & Fetal Medicine", "Neonatology",
  "Surgery", "Radiology", "Pathology",
];

export default function AdminDashboard() {
  const { role } = useAuth();
  const { settings, updateSetting } = useAppSettings();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);

  // Add doctor form state
  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    email: "", password: "", first_name: "", last_name: "",
    specialty: "", custom_specialty: "", experience_years: 0,
    consultation_fee: 0, bio: "",
  });
  const [useCustomSpecialty, setUseCustomSpecialty] = useState(false);
  const [addingDoctor, setAddingDoctor] = useState(false);

  // Doctor photo upload
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhotoFor, setUploadingPhotoFor] = useState<string | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    bank_account_number: "", bank_name: "", payment_instructions: "",
    emergency_phone: "", contact_phone: "", contact_email: "",
  });

  useEffect(() => {
    setSettingsForm({
      bank_account_number: settings.bank_account_number || "",
      bank_name: settings.bank_name || "",
      payment_instructions: settings.payment_instructions || "",
      emergency_phone: settings.emergency_phone || "",
      contact_phone: settings.contact_phone || "",
      contact_email: settings.contact_email || "",
    });
  }, [settings]);

  useEffect(() => {
    if (role !== "admin") return;
    const fetchData = async () => {
      const [docRes, profRes, apptRes, payRes, msgRes] = await Promise.all([
        supabase.from("doctors").select("*, profiles!doctors_user_id_fkey(first_name, last_name, email)"),
        supabase.from("profiles").select("*").limit(50),
        supabase.from("appointments").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("contact_messages" as any).select("*").order("created_at", { ascending: false }).limit(50),
      ]);
      setDoctors(docRes.data ?? []);
      setProfiles(profRes.data ?? []);
      setAppointments(apptRes.data ?? []);
      setPayments(payRes.data ?? []);
      setContactMessages((msgRes.data as any[]) ?? []);
    };
    fetchData();
  }, [role]);

  const approveDoctor = async (id: string) => {
    const { error } = await supabase
      .from("doctors")
      .update({ is_approved: true, approved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast.error("Failed to approve");
    else {
      toast.success("Doctor approved!");
      setDoctors((prev) =>
        prev.map((d) => d.id === id ? { ...d, is_approved: true, approved_at: new Date().toISOString() } : d)
      );
    }
  };

  const handleAddDoctor = async () => {
    const specialty = useCustomSpecialty ? newDoctor.custom_specialty : newDoctor.specialty;
    if (!newDoctor.email || !newDoctor.password || !newDoctor.first_name || !specialty) {
      toast.error("Please fill in all required fields");
      return;
    }
    setAddingDoctor(true);
    try {
      // Use the admin endpoint to create user without affecting current session
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: newDoctor.email,
        password: newDoctor.password,
        options: {
          data: {
            first_name: newDoctor.first_name,
            last_name: newDoctor.last_name,
            role: "doctor",
          },
        },
      });
      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("Failed to create user");

      // Insert doctor record
      const { error: docError } = await supabase.from("doctors").insert({
        user_id: signUpData.user.id,
        specialty,
        experience_years: newDoctor.experience_years,
        consultation_fee: newDoctor.consultation_fee,
        bio: newDoctor.bio,
        is_approved: true,
        approved_at: new Date().toISOString(),
      });
      if (docError) throw docError;

      toast.success("Doctor added successfully!");
      setAddDoctorOpen(false);
      setNewDoctor({ email: "", password: "", first_name: "", last_name: "", specialty: "", custom_specialty: "", experience_years: 0, consultation_fee: 0, bio: "" });
      setUseCustomSpecialty(false);

      const { data } = await supabase.from("doctors").select("*, profiles!doctors_user_id_fkey(first_name, last_name, email)");
      setDoctors(data ?? []);
    } catch (err: any) {
      toast.error(err.message || "Failed to add doctor");
    } finally {
      setAddingDoctor(false);
    }
  };

  const handleUploadDoctorPhoto = async (file: File, doctorId: string) => {
    setUploadingPhotoFor(doctorId);
    try {
      const filePath = `doctor-photos/${doctorId}_${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from("medical-documents")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("medical-documents")
        .getPublicUrl(filePath);

      const { error } = await supabase.from("doctors")
        .update({ photo_url: urlData.publicUrl } as any)
        .eq("id", doctorId);
      if (error) throw error;

      toast.success("Doctor photo uploaded!");
      setDoctors((prev) =>
        prev.map((d) => d.id === doctorId ? { ...d, photo_url: urlData.publicUrl } : d)
      );
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploadingPhotoFor(null);
    }
  };

  const verifyPayment = async (paymentId: string, verified: boolean) => {
    const { error } = await supabase
      .from("payments")
      .update({ admin_verified: verified, status: verified ? "verified" : "rejected" })
      .eq("id", paymentId);
    if (error) toast.error("Failed to update payment");
    else {
      toast.success(verified ? "Payment verified!" : "Payment rejected");
      setPayments((prev) =>
        prev.map((p) => p.id === paymentId ? { ...p, admin_verified: verified, status: verified ? "verified" : "rejected" } : p)
      );
    }
  };

  const saveSettings = async () => {
    const entries = Object.entries(settingsForm);
    let hasError = false;
    for (const [key, value] of entries) {
      const { error } = await updateSetting(key, value);
      if (error) hasError = true;
    }
    if (hasError) toast.error("Some settings failed to save");
    else toast.success("Settings saved!");
  };

  const markMessageRead = async (id: string) => {
    await supabase.from("contact_messages" as any).update({ is_read: true } as any).eq("id", id);
    setContactMessages((prev) => prev.map((m: any) => m.id === id ? { ...m, is_read: true } : m));
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("contact_messages" as any).delete().eq("id", id);
    setContactMessages((prev) => prev.filter((m: any) => m.id !== id));
    toast.success("Message deleted");
  };

  if (role !== "admin") {
    return (
      <div className="container py-20 text-center">
        <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground mt-2">You don't have admin permissions.</p>
      </div>
    );
  }

  const pendingDoctors = doctors.filter((d) => !d.is_approved);
  const completedAppts = appointments.filter((a) => a.status === "completed");
  const pendingPayments = payments.filter((p) => p.status === "submitted" || p.status === "doctor_confirmed");
  const unreadMessages = contactMessages.filter((m: any) => !m.is_read);

  return (
    <div className="container py-8">
      <input
        type="file"
        ref={photoInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && uploadingPhotoFor) {
            handleUploadDoctorPhoto(file, uploadingPhotoFor);
          }
          e.target.value = "";
        }}
      />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage SmartCare platform</p>
        </div>
        <Dialog open={addDoctorOpen} onOpenChange={setAddDoctorOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Doctor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">Add New Doctor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input value={newDoctor.first_name} onChange={(e) => setNewDoctor({ ...newDoctor, first_name: e.target.value })} />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input value={newDoctor.last_name} onChange={(e) => setNewDoctor({ ...newDoctor, last_name: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} />
              </div>
              <div>
                <Label>Password *</Label>
                <Input type="password" value={newDoctor.password} onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Specialty *</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setUseCustomSpecialty(!useCustomSpecialty)}>
                    {useCustomSpecialty ? "Choose from list" : "Custom specialty"}
                  </Button>
                </div>
                {useCustomSpecialty ? (
                  <Input
                    placeholder="e.g. Anesthesiology, Midwifery, etc."
                    value={newDoctor.custom_specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, custom_specialty: e.target.value })}
                  />
                ) : (
                  <Select value={newDoctor.specialty} onValueChange={(v) => setNewDoctor({ ...newDoctor, specialty: v })}>
                    <SelectTrigger><SelectValue placeholder="Select specialty" /></SelectTrigger>
                    <SelectContent>
                      {PRESET_SPECIALTIES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Experience (years)</Label>
                  <Input type="number" value={newDoctor.experience_years} onChange={(e) => setNewDoctor({ ...newDoctor, experience_years: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>Consultation Fee</Label>
                  <Input type="number" value={newDoctor.consultation_fee} onChange={(e) => setNewDoctor({ ...newDoctor, consultation_fee: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <Input value={newDoctor.bio} onChange={(e) => setNewDoctor({ ...newDoctor, bio: e.target.value })} />
              </div>
              <Button className="w-full" onClick={handleAddDoctor} disabled={addingDoctor}>
                {addingDoctor ? "Adding..." : "Add Doctor"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, label: "Total Users", value: profiles.length, color: "text-primary" },
          { icon: Stethoscope, label: "Doctors", value: doctors.length, color: "text-secondary" },
          { icon: Calendar, label: "Appointments", value: appointments.length, color: "text-accent" },
          { icon: TrendingUp, label: "Completed", value: completedAppts.length, color: "text-success" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="doctors">
        <TabsList className="flex-wrap">
          <TabsTrigger value="doctors">
            Doctors {pendingDoctors.length > 0 && <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive">{pendingDoctors.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="payments">
            Payments {pendingPayments.length > 0 && <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive">{pendingPayments.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="messages">
            Messages {unreadMessages.length > 0 && <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive">{unreadMessages.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-1" /> Settings
          </TabsTrigger>
        </TabsList>

        {/* Doctors Tab */}
        <TabsContent value="doctors" className="mt-6">
          <div className="space-y-3">
            {doctors.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No doctors registered yet</p>
            ) : (
              doctors.map((d) => (
                <Card key={d.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {d.photo_url ? (
                        <img src={d.photo_url} alt="Doctor" className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold">
                          {d.profiles?.first_name?.[0] ?? "D"}
                        </div>
                      )}
                      <div>
                        <p className="font-display font-semibold text-foreground">
                          Dr. {d.profiles?.first_name} {d.profiles?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{d.specialty || "Not specified"} • {d.profiles?.email}</p>
                        {d.consultation_fee > 0 && (
                          <p className="text-xs text-muted-foreground">Fee: ${d.consultation_fee}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={uploadingPhotoFor === d.id}
                        onClick={() => {
                          setUploadingPhotoFor(d.id);
                          photoInputRef.current?.click();
                        }}
                      >
                        <Upload className="h-3.5 w-3.5 mr-1" />
                        {uploadingPhotoFor === d.id ? "Uploading..." : "Photo"}
                      </Button>
                      {d.is_approved ? (
                        <Badge className="bg-success/10 text-success">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approved
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={() => approveDoctor(d.id)}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-6">
          <div className="space-y-3">
            {payments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No payments yet</p>
            ) : (
              payments.map((p) => {
                const patient = profiles.find((pr) => pr.user_id === p.patient_id);
                const doctor = doctors.find((d) => d.user_id === p.doctor_id);
                return (
                  <Card key={p.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {patient?.first_name} {patient?.last_name} → Dr. {doctor?.profiles?.first_name} {doctor?.profiles?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Amount: ${p.amount} • {new Date(p.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {p.doctor_confirmed && (
                            <Badge className="bg-primary/10 text-primary">
                              <CheckCircle className="h-3 w-3 mr-1" /> Doctor Confirmed
                            </Badge>
                          )}
                          <Badge className={
                            p.status === "verified" ? "bg-success/10 text-success" :
                            p.status === "rejected" ? "bg-destructive/10 text-destructive" :
                            "bg-warning/10 text-warning"
                          }>
                            {p.status}
                          </Badge>
                        </div>
                      </div>
                      {p.screenshot_url && (
                        <div className="mb-3">
                          <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Image className="h-4 w-4" /> View Payment Screenshot
                          </a>
                        </div>
                      )}
                      {(p.status === "submitted" || p.status === "doctor_confirmed") && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => verifyPayment(p.id, true)}>
                            <CheckCircle className="h-3.5 w-3.5 mr-1" /> Verify Payment
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => verifyPayment(p.id, false)}>
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="mt-6">
          <div className="space-y-3">
            {contactMessages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No messages yet</p>
            ) : (
              contactMessages.map((m: any) => (
                <Card key={m.id} className={m.is_read ? "opacity-70" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
                          {m.name}
                          {!m.is_read && <Badge className="bg-primary text-primary-foreground text-[10px]">New</Badge>}
                        </p>
                        <p className="text-xs text-muted-foreground">{m.email} • {new Date(m.created_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-1">
                        {!m.is_read && (
                          <Button size="sm" variant="ghost" onClick={() => markMessageRead(m.id)}>
                            <CheckCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => deleteMessage(m.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-foreground">{m.subject}</p>
                    <p className="text-sm text-muted-foreground mt-1">{m.message}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <div className="space-y-3">
            {profiles.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-display font-bold text-sm text-muted-foreground">
                    {p.first_name?.[0] ?? "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.first_name} {p.last_name}</p>
                    <p className="text-xs text-muted-foreground">{p.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="mt-6">
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No appointments yet</p>
            ) : (
              appointments.slice(0, 20).map((a) => (
                <Card key={a.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {a.appointment_date} at {a.appointment_time}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{a.consultation_type} consultation</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">{a.status}</Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" /> Bank & Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Bank Name</Label>
                  <Input value={settingsForm.bank_name} onChange={(e) => setSettingsForm({ ...settingsForm, bank_name: e.target.value })} placeholder="e.g. Commercial Bank of Ethiopia" />
                </div>
                <div>
                  <Label>Bank Account Number</Label>
                  <Input value={settingsForm.bank_account_number} onChange={(e) => setSettingsForm({ ...settingsForm, bank_account_number: e.target.value })} placeholder="e.g. 1000123456789" />
                </div>
                <div>
                  <Label>Payment Instructions</Label>
                  <Textarea value={settingsForm.payment_instructions} onChange={(e) => setSettingsForm({ ...settingsForm, payment_instructions: e.target.value })} rows={3} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-secondary" /> Contact & Emergency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Emergency Phone Number</Label>
                  <Input value={settingsForm.emergency_phone} onChange={(e) => setSettingsForm({ ...settingsForm, emergency_phone: e.target.value })} placeholder="e.g. 1-800-123-4567" />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input value={settingsForm.contact_phone} onChange={(e) => setSettingsForm({ ...settingsForm, contact_phone: e.target.value })} placeholder="e.g. 1-800-123-4567" />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input value={settingsForm.contact_email} onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })} placeholder="e.g. support@smartcare.com" />
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2">
              <Button onClick={saveSettings}>Save All Settings</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
