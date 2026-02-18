import clinicalBg from "@/assets/clinical-bg.png";

export default function Privacy() {
  return (
    <div>
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(211, 80%, 35%) 0%, hsl(211, 80%, 42%) 50%, hsl(199, 89%, 40%) 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${clinicalBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container text-center max-w-3xl relative z-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-2 text-white/80">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>
      <div className="container py-16 max-w-3xl prose prose-sm">
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">1. Information We Collect</h2>
      <p className="text-muted-foreground">We collect personal information including name, email, phone number, date of birth, medical history, and consultation records necessary to provide healthcare services.</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">2. How We Use Your Information</h2>
      <p className="text-muted-foreground">Your information is used to provide medical consultations, manage appointments, process prescriptions, and improve our services. We never sell your data to third parties.</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">3. Data Security</h2>
      <p className="text-muted-foreground">We employ industry-standard encryption, secure data centers, and strict access controls to protect your health information.</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">4. Your Rights</h2>
      <p className="text-muted-foreground">You have the right to access, update, or delete your personal data at any time through your account settings or by contacting our support team.</p>

      <h2 className="font-display text-xl font-semibold text-foreground mt-8">5. Contact Us</h2>
      <p className="text-muted-foreground">For privacy-related questions, contact us at privacy@smartcare.com or 1-800-123-4567.</p>
      </div>
    </div>
  );
}
