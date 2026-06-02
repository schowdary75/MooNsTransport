export default function TermsPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

      <section className="prose prose-lg max-w-none space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Moon transit application ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, then you may not use the Service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Moon's web application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on the Service</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            If you create an account on Moon, you are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Bookings and Payments</h2>
          <p>
            All bookings made through the Service are subject to the terms and conditions of the respective transport operators. Moon is not responsible for cancellations, delays, or changes made by operators. Refunds will be processed according to operator policies and applicable laws.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL MOON, NOR ITS SUPPLIERS, BE LIABLE FOR ANY DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF DATA OR PROFIT, OR DUE TO BUSINESS INTERRUPTION) ARISING OUT OF THE USE OR INABILITY TO USE THE MATERIALS ON THE MOON SERVICE.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Modifications</h2>
          <p>
            Moon may revise these terms of service for the Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in India.
          </p>
        </div>
      </section>
    </article>
  );
}
