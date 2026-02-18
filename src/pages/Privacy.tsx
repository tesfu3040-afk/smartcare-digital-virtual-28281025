export default function Privacy() {
  return (
    <div className="container py-16 max-w-3xl prose prose-sm">
      <h1 className="font-display text-3xl font-bold text-foreground">Privacy Policy</h1>
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
  );
}
