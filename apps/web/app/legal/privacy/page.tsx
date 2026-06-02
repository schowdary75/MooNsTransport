export default function PrivacyPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <section className="prose prose-lg max-w-none space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>
            Moon collects information you provide directly to us, such as when you create an account, make a booking, or contact our support team. This may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, email address, and phone number</li>
            <li>Location data (when you use location-based features)</li>
            <li>Payment information processed securely through third parties</li>
            <li>Booking and travel history</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and improve our services</li>
            <li>Process your bookings and payments</li>
            <li>Send you booking confirmations and updates</li>
            <li>Provide customer support</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Analyze usage patterns to improve our service</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Protection</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All communications with Moon are encrypted.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. However, we may share information with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Transport operators to complete your bookings</li>
            <li>Payment processors to process transactions</li>
            <li>Service providers who assist us in operating the platform</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Retention</h2>
          <p>
            We retain your personal information as long as necessary to provide our services and for legal compliance purposes. You can request deletion of your account and associated data at any time.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Compliance with DPDP Act</h2>
          <p>
            Moon complies with the Digital Personal Data Protection Act, 2023 of India. You have rights regarding your personal data, including access, correction, and erasure.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
          <p>
            If you have concerns about our privacy practices, please contact us at: privacy@moonapp.in
          </p>
        </div>
      </section>
    </article>
  );
}
