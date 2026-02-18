import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Video, MessageSquare, FlaskConical, Pill, Brain, HeartPulse, Truck, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import clinicalBg from "@/assets/clinical-bg.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const services = [
  {
    icon: Video,
    title: "Telemedicine",
    desc: "Connect with certified doctors via high-quality video calls. Get diagnosed, treated, and prescribed without leaving home.",
    features: ["HD Video Calls", "Screen Sharing", "Recording Available"],
  },
  {
    icon: MessageSquare,
    title: "Chat Consultation",
    desc: "Quick text-based consultations for non-urgent medical questions. Share images and documents instantly.",
    features: ["Real-time Messaging", "File Sharing", "Message History"],
  },
  {
    icon: FlaskConical,
    title: "Lab Test Requests",
    desc: "Order lab tests online. Visit partner labs or request home sample collection.",
    features: ["100+ Test Types", "Home Collection", "Digital Results"],
  },
  {
    icon: Pill,
    title: "Virtual Pharmacy",
    desc: "Get your prescriptions filled and delivered to your doorstep with our pharmacy partners.",
    features: ["Same-day Delivery", "Auto Refills", "Price Comparison"],
  },
  {
    icon: Brain,
    title: "Mental Health",
    desc: "Access licensed therapists and counselors for therapy sessions, stress management, and mental wellness.",
    features: ["Licensed Therapists", "CBT & DBT", "Group Sessions"],
  },
  {
    icon: FileText,
    title: "E-Prescriptions",
    desc: "Receive digital prescriptions directly from your doctor, shareable with any pharmacy.",
    features: ["Digital Format", "Pharmacy Integration", "Refill Requests"],
  },
  {
    icon: HeartPulse,
    title: "Health Monitoring",
    desc: "Track vital signs, manage chronic conditions, and get personalized health insights.",
    features: ["Vitals Tracking", "Alerts & Reminders", "Reports"],
  },
  {
    icon: Truck,
    title: "Medicine Delivery",
    desc: "Order medicines online and get them delivered fast through our trusted logistics partners.",
    features: ["Express Delivery", "Order Tracking", "Secure Packaging"],
  },
];

export default function Services() {
  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(211, 80%, 35%) 0%, hsl(211, 80%, 42%) 50%, hsl(199, 89%, 40%) 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${clinicalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container text-center max-w-3xl relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white">Our Services</h1>
          <p className="mt-4 text-lg text-white/80">
            Comprehensive virtual healthcare services to meet all your medical needs.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <motion.div key={s.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Card className="h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                    <s.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground flex-1">{s.desc}</p>
                  <ul className="mt-4 space-y-1">
                    {s.features.map((f) => (
                      <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container text-center space-y-6">
          <h2 className="font-display text-3xl font-bold text-foreground">Need a Consultation?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Book an appointment with a specialist today and get the care you deserve.
          </p>
          <Button size="lg" asChild>
            <Link to="/doctors">Find a Doctor <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
