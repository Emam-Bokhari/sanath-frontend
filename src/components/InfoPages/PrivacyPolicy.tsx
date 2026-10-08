"use client";

const initialContent = `
<p><strong>Last updated:</strong> December 30, 2025</p>

<h2>1. Acceptance of Terms</h2>
<p>
By accessing and using Gift Moment, you accept and agree to be bound by the terms and provision of this agreement. 
If you do not agree to abide by the above, please do not use this service.
</p>

<h2>2. Use License</h2>
<p>
Permission is granted to temporarily download one copy of Gift Moment for personal, non-commercial transitory viewing only. 
This is the grant of a license, not a transfer of title.
</p>

<h2>3. Subscription & Payments</h2>
<p>
VIP subscriptions are billed monthly at €4.99. Premium cards and VIP videos are one-time purchases. 
All payments are processed securely. Subscriptions auto-renew unless cancelled 24 hours before the renewal date.
</p>

<h2>4. User Accounts</h2>
<p>
You are responsible for maintaining the confidentiality of your account and password. 
You agree to accept responsibility for all activities that occur under your account or password.
</p>

<h2>5. Content Guidelines</h2>
<p>
Users must not send cards containing offensive, abusive, or illegal content. 
Gift Moment reserves the right to remove any content that violates these terms and suspend or terminate accounts.
</p>

<h2>6. Intellectual Property</h2>
<p>
All cards, designs, animations, music, and other content provided by Gift Moment are protected by copyright and intellectual property laws. 
Users may not reproduce, distribute, or create derivative works.
</p>

<h2>7. Refund Policy</h2>
<p>
Refunds for digital card purchases are available within 24 hours of purchase if the card has not been sent. 
VIP subscriptions can be cancelled anytime, but refunds are not provided for partial months.
</p>

<h2>8. Service Modifications</h2>
<p>
Gift Moment reserves the right to modify or discontinue the service at any time, with or without notice. 
We shall not be liable to you or any third party for any modification or discontinuance.
</p>

<h2>9. Privacy</h2>
<p>
Your use of Gift Moment is also governed by our Privacy Policy. 
Please review our Privacy Policy to understand our practices regarding your personal data.
</p>

<h2>10. Limitation of Liability</h2>
<p>
Gift Moment shall not be liable for any indirect, incidental, special, consequential or punitive damages 
resulting from your use or inability to use the service.
</p>

<h2>11. Governing Law</h2>
<p>
These terms shall be governed by and construed in accordance with the laws of the European Union, 
without regard to its conflict of law provisions.
</p>

<h2>12. Contact Information</h2>
<p>
For questions about these Terms & Conditions, please contact us at legal@myhome.com
</p>
`;

export default function PrivacyPolicy({ terms }: { terms?: any }) {
    const displayContent = typeof terms === 'string' ? terms : terms?.content || initialContent;

    return (
        <section className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                {/* Sections */}
                <div className="max-w-4xl mx-auto space-y-4 text-black" dangerouslySetInnerHTML={{ __html: displayContent || "No content yet." }} />

            </div>
        </section>
    );
}