import { GlassCard } from "@/components/ui/glass-card"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <GlassCard className="p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you:</p>
          <ul>
            <li>Create an account</li>
            <li>Use our services</li>
            <li>Communicate with us</li>
          </ul>
          <p>This information may include your name, email address, and any other information you choose to provide.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Develop new products and services</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We do not share your personal information with third parties except in the following circumstances:</p>
          <ul>
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and the rights of others</li>
            <li>In connection with a sale or transfer of our business</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We take reasonable measures to help protect your personal information from loss, theft, misuse, and
            unauthorized access.
          </p>

          <h2>5. Your Choices</h2>
          <p>
            You can access and update certain information about your account by logging into your account settings. You
            can also request that we delete your account and associated data.
          </p>

          <h2>6. Cookies</h2>
          <p>
            We use cookies and similar technologies to collect information about your activity, browser, and device. You
            can manage your cookie preferences through your browser settings.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            Our services are not directed to children under the age of 13, and we do not knowingly collect personal
            information from children under 13.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new
            policy on this page.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at privacy@tradingjournalapp.com.
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
