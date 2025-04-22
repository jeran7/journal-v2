import { GlassCard } from "@/components/ui/glass-card"

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <GlassCard className="p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Trading Journal service, you agree to be bound by these Terms of Service. If you
            do not agree to these terms, please do not use the service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Trading Journal provides tools for traders to track, analyze, and improve their trading performance. The
            service includes trade tracking, journaling, analytics, and strategy development features.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To use certain features of the service, you must register for an account. You are responsible for
            maintaining the confidentiality of your account information and for all activities that occur under your
            account.
          </p>

          <h2>4. User Content</h2>
          <p>
            You retain ownership of any content you submit to the service. By submitting content, you grant Trading
            Journal a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content
            for the purpose of providing the service.
          </p>

          <h2>5. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the service for any illegal purpose</li>
            <li>Violate any laws or regulations</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with the operation of the service</li>
            <li>Attempt to gain unauthorized access to the service</li>
          </ul>

          <h2>6. Disclaimer of Warranties</h2>
          <p>
            The service is provided "as is" without warranties of any kind, either express or implied. Trading Journal
            does not warrant that the service will be uninterrupted or error-free.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            Trading Journal shall not be liable for any indirect, incidental, special, consequential, or punitive
            damages resulting from your use of or inability to use the service.
          </p>

          <h2>8. Modifications to Terms</h2>
          <p>
            Trading Journal reserves the right to modify these Terms of Service at any time. Your continued use of the
            service after such modifications constitutes your acceptance of the modified terms.
          </p>

          <h2>9. Termination</h2>
          <p>
            Trading Journal may terminate or suspend your account at any time for any reason without notice or
            liability.
          </p>

          <h2>10. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in
            which Trading Journal operates.
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
