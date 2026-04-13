import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | LiU AI Society",
  description: "How LiU AI Society collects, uses, and protects your personal data in accordance with GDPR.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <div className="about-content about-page">
        <section className="about-intro">
          <h1 className="section-heading">Privacy Policy</h1>
          <p className="about-description">Last updated: April 2026</p>
        </section>

        <section className="about-section">
          <h2 className="section-heading">Who we are</h2>
          <p className="about-description">
            LiU AI Society is a student association at Linköping University devoted to artificial intelligence.
            You can reach us at <a href="mailto:contact@liuais.com">contact@liuais.com</a>.
          </p>
        </section>

        <section className="about-section">
          <h2 className="section-heading">What data we collect</h2>
          <p className="about-description">We only collect data you actively provide:</p>
          <ul className="about-description" style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Newsletter signup</strong> — your email address, used solely to send event updates.
              We never share it with third parties.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>Partner contact form</strong> — your name, company, email, and message,
              used solely to respond to your enquiry.
            </li>
          </ul>
        </section>

        <section className="about-section">
          <h2 className="section-heading">Legal basis (GDPR)</h2>
          <p className="about-description">
            We process your data on the basis of consent (newsletter) and legitimate interest
            (partner enquiries). You can withdraw consent at any time by emailing{" "}
            <a href="mailto:contact@liuais.com">contact@liuais.com</a>.
          </p>
        </section>

        <section className="about-section">
          <h2 className="section-heading">Data storage</h2>
          <p className="about-description">
            Form submissions are processed via our own API. We do not use third-party
            marketing platforms or sell your data.
          </p>
        </section>

        <section className="about-section">
          <h2 className="section-heading">Analytics</h2>
          <p className="about-description">
            We use Vercel Analytics to collect anonymous usage statistics. No personally
            identifiable data is collected or stored by our analytics.
          </p>
        </section>

        <section className="about-section" style={{ paddingBottom: "80px" }}>
          <h2 className="section-heading">Your rights</h2>
          <p className="about-description">
            Under GDPR you have the right to access, correct, or delete your personal data.
            To exercise any of these rights, email{" "}
            <a href="mailto:contact@liuais.com">contact@liuais.com</a>.
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
