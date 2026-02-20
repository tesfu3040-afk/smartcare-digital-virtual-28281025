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
  Stethoscope,
  Activity,
  Heart,
  Syringe,
} from "lucide-react";
import { motion } from "framer-motion";
import clinicalBg from "@/assets/clinical-bg.png";
import doctorHero1 from "@/assets/doctor-hero-1.png";
import doctorHero2 from "@/assets/doctor-hero-2.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const floatAnimation = {
  y: [0, -15, 0],
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
};

const floatAnimationSlow = {
  y: [0, -10, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay: 1 },
};

const pulseFloat = {
  scale: [1, 1.1, 1],
  opacity: [0.7, 1, 0.7],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
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
      <section className="relative overflow-hidden min-h-[85vh] flex items-center" style={{ background: "linear-gradient(135deg, hsl(211 80% 25%) 0%, hsl(211 80% 42%) 40%, hsl(199 89% 48%) 100%)" }}>
        {/* Background clinical image with overlay */}
        <div className="absolute inset-0">
          <img src={clinicalBg} alt="" className="w-full h-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/80" />
        </div>

        {/* Floating clinical icons */}
        <motion.div animate={pulseFloat} className="absolute top-20 right-[15%] hidden lg:block">
          <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Heart className="h-7 w-7 text-white/70" />
          </div>
        </motion.div>
        <motion.div animate={{ ...pulseFloat, transition: { ...pulseFloat.transition, delay: 0.5 } }} className="absolute top-40 left-[8%] hidden lg:block">
          <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Activity className="h-6 w-6 text-white/60" />
          </div>
        </motion.div>
        <motion.div animate={{ ...pulseFloat, transition: { ...pulseFloat.transition, delay: 1.5 } }} className="absolute bottom-32 left-[12%] hidden lg:block">
          <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Stethoscope className="h-8 w-8 text-white/60" />
          </div>
        </motion.div>
        <motion.div animate={{ ...pulseFloat, transition: { ...pulseFloat.transition, delay: 2 } }} className="absolute bottom-20 right-[8%] hidden lg:block">
          <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Syringe className="h-5 w-5 text-white/50" />
          </div>
        </motion.div>

        {/* Animated pulse line */}
        <svg className="absolute bottom-0 left-0 w-full h-24 opacity-10" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <motion.path
            d="M0,50 L200,50 L230,20 L250,80 L270,30 L290,70 L310,50 L500,50 L530,15 L550,85 L570,25 L590,75 L610,50 L800,50 L830,20 L850,80 L870,30 L890,70 L910,50 L1200,50"
            fill="none"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        <div className="container relative z-10 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white rounded-full px-4 py-1.5 text-sm font-medium border border-white/20">
                <ShieldCheck className="h-4 w-4" /> Trusted Virtual Healthcare
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Quality Healthcare,{" "}
                <span className="text-secondary">Anytime, Anywhere</span>
              </h1>
              <p className="text-lg text-white/80 max-w-lg">
                Connect with certified doctors through video or chat consultations. Get prescriptions, lab results, and pharmacy services — all from the comfort of your home.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold" asChild>
                  <Link to="/auth?tab=register">
                    Book Consultation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/doctors">Browse Doctors</Link>
                </Button>
              </div>
            </motion.div>

            <div className="relative hidden md:flex items-center justify-center">
              {/* Doctor images with floating animation */}
              <motion.div
                animate={floatAnimation}
                className="relative z-20"
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-3xl bg-white/10 blur-xl" />
                  <img
                    src={doctorHero1}
                    alt="Doctor"
                    className="relative rounded-2xl w-64 h-80 object-cover shadow-2xl border-2 border-white/20"
                  />
                </div>
              </motion.div>

              <motion.div
                animate={floatAnimationSlow}
                className="absolute -right-4 top-10 z-10"
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-3xl bg-white/10 blur-xl" />
                  <img
                    src={doctorHero2}
                    alt="Doctor"
                    className="relative rounded-2xl w-52 h-64 object-cover shadow-2xl border-2 border-white/20 opacity-90"
                  />
                </div>
              </motion.div>

              {/* Floating stats card */}
              <motion.div
                animate={{ y: [0, -8, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 } }}
                className="absolute -left-6 bottom-4 z-30"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-display font-bold text-foreground">50K+</p>
                      <p className="text-xs text-muted-foreground">Happy Patients</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating appointment card */}
              <motion.div
                animate={{ y: [0, -12, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const, delay: 1.5 } }}
                className="absolute -right-8 -top-4 z-30"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Next Appointment</p>
                      <p className="text-[10px] text-muted-foreground">Today, 2:30 PM</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
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
            { name: "Mekdelawit Dejen", text: "I got my prescription delivered the same day. Amazing service!", rating: 5 },
            { name: "Mariamawit Eyasu", text: "The mental health support was exactly what I needed. Highly recommend!", rating: 5 },
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
