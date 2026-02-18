import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import clinicalBg from "@/assets/clinical-bg.png";

export default function Contact() {
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setSending(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(211, 80%, 35%) 0%, hsl(211, 80%, 42%) 50%, hsl(199, 89%, 40%) 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${clinicalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container text-center max-w-3xl relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white">Contact Us</h1>
          <p className="mt-4 text-lg text-white/80">
            We're here to help. Reach out with any questions or concerns.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display font-bold text-xl text-foreground mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input placeholder="Your Name" required maxLength={100} />
                    <Input placeholder="Email Address" type="email" required maxLength={255} />
                  </div>
                  <Input placeholder="Subject" required maxLength={200} />
                  <Textarea placeholder="Your message..." rows={5} required maxLength={1000} />
                  <Button type="submit" disabled={sending}>
                    <Send className="h-4 w-4 mr-2" /> {sending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {[
              { icon: Phone, title: "Phone", detail: "1-800-123-4567", sub: "Mon–Fri 8am–8pm" },
              { icon: Mail, title: "Email", detail: "support@smartcare.com", sub: "Response within 24h" },
              { icon: MapPin, title: "Address", detail: "123 Healthcare Ave", sub: "Medical City, MC 10001" },
              { icon: Clock, title: "Hours", detail: "24/7 Consultations", sub: "Support: Mon–Fri 8am–8pm" },
            ].map((c) => (
              <Card key={c.title}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground">{c.title}</p>
                    <p className="text-sm text-foreground">{c.detail}</p>
                    <p className="text-xs text-muted-foreground">{c.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
