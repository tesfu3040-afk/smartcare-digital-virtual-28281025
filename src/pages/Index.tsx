import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  MessageSquare,
  FlaskConical,
  Pill,
  Brain,
  ShieldCheck,
  Clock,
  Users,
  Star,
  ArrowRight,
  Calendar,
  HeartPulse,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const services = [
  { icon: Video, title: "Video Consultation", desc: "Face-to-face with doctors from home" },
  { icon: MessageSquare, title: "Chat Consultation", desc: "Quick text-based medical advice" },
  { icon: FlaskConical, title: "Lab Test Requests", desc: "Order lab tests online easily" },
  { icon: Pill, title: "Virtual Pharmacy", desc: "E-prescriptions & delivery" },
  { icon: Brain, title: "Mental Health", desc: "Therapy & counseling sessions" },
  { icon: HeartPulse, title: "Health Monitoring", desc: "Track and manage your health" },
];

const stats = [
  { value: "50K+", label: "Patients Served" },
  { value: "200+", label: "Verified Doctors" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Available" },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" /> Trusted Virtual Healthcare
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
                Quality Healthcare,{" "}
                <span className="text-gradient">Anytime, Anywhere</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Connect with certified doctors through video or chat consultations. Get prescriptions, lab results, and pharmacy services — all from the comfort of your home.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/auth?tab=register">
                    Book Consultation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/doctors">Browse Doctors</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden md:block"
            >
              <div className="relative rounded-2xl bg-gradient-to-br from-primary to-secondary p-1">
                <div className="bg-card rounded-xl p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-display font-semibold text-foreground">Next Appointment</p>
                      <p className="text-sm text-muted-foreground">Today at 2:30 PM</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Video, label: "Video Call", color: "bg-primary/10 text-primary" },
                      { icon: MessageSquare, label: "Chat", color: "bg-secondary/10 text-secondary" },
                      { icon: FlaskConical, label: "Lab Results", color: "bg-accent/10 text-accent" },
                      { icon: Pill, label: "Prescriptions", color: "bg-warning/10 text-warning" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-lg border p-3 hover:shadow-md transition-shadow"
                      >
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${item.color}`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-display font-extrabold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our Services</h2>
          <p className="mt-3 text-muted-foreground">
            Comprehensive virtual healthcare services designed for your convenience
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <s.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild>
            <Link to="/services">
              View All Services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
            <p className="mt-3 text-muted-foreground">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: Users, title: "Create Account", desc: "Sign up as a patient or doctor in minutes" },
              { step: "2", icon: Calendar, title: "Book Appointment", desc: "Choose your doctor, date, and consultation type" },
              { step: "3", icon: Video, title: "Start Consultation", desc: "Connect via video or chat with your doctor" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative text-center"
              >
                <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto text-2xl font-display font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">What Patients Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Sarah M.", text: "SmartCare made it so easy to see a doctor. The video consultation was seamless!", rating: 5 },
            { name: "James K.", text: "I got my prescription delivered the same day. Amazing service!", rating: 5 },
            { name: "Maria L.", text: "The mental health support was exactly what I needed. Highly recommend!", rating: 5 },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
                  <p className="mt-4 font-display font-semibold text-sm text-foreground">{t.name}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container text-center text-primary-foreground space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto">
            Join thousands of patients who trust SmartCare for their healthcare needs.
          </p>
          <div className="flex justify-center gap-3">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth?tab=register">Create Free Account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
