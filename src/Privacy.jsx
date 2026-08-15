export default function Privacy() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1410",
      color: "#f5efe6",
      fontFamily: "'Inter', sans-serif",
      padding: "64px 24px",
      maxWidth: 2000,
      margin: "0 auto"
    }}>
      <h1 style={{ letterSpacing: 4, fontSize: 18, fontWeight: 300, marginBottom: 8 }}>shoto</h1>
      <p style={{ color: "#c4a882", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 48, fontWeight: 300 }}>Privacy Policy</p>

      <p style={{ color: "#a89070", fontSize: 12, marginBottom: 48 }}>Last updated: August 2026</p>

      {[
        {
          title: "Who we are",
          body: "Shoto is a digital disposable camera service for events, operated as a sole trader business based in Sheffield, United Kingdom. You can contact us at kylewilliamsmedia@gmail.com."
        },
        {
          title: "What data we collect",
          body: "When you purchase a package: your name, email address, and payment information (processed by Stripe — we never see or store your card details), along with your event name, occasion type, event date and reveal time.\n\nWhen you use the guest camera: photos you take are uploaded to our secure storage. A random device identifier is stored on your device to track your shot count. No personal information is collected from guests.\n\nWhen you submit a bespoke enquiry: your name, email address, and the details you provide in the form."
        },
        {
          title: "Why we collect it",
          body: "We collect your email address and event details to create and manage your event and send your QR code and gallery reveal email. Payment data is collected to process your purchase. Photos are stored to provide the gallery service. Device identifiers track shot count per guest. Enquiry data is used to respond to your message."
        },
        {
          title: "How long we keep it",
          body: "Event data and photos are retained for 90 days after your reveal date then permanently deleted. Email addresses are retained for 12 months for customer service purposes then deleted. Payment records are retained for 7 years as required by HMRC. Enquiry data is deleted after 6 months if no contract is entered into.\n\nYou can request earlier deletion at any time by emailing kylewilliamsmedia@gmail.com."
        },
        {
          title: "Who we share it with",
          body: "We use the following third party services to operate Shoto, each acting as a data processor under our instruction:\n\nStripe — payment processing (stripe.com/gb/privacy)\nSupabase — database and file storage, EU servers (supabase.com/privacy)\nResend — email delivery (resend.com/privacy)\nVercel — website hosting (vercel.com/legal/privacy-policy)\n\nWe do not sell your data to any third party. We do not use your data for marketing without your consent."
        },
        {
          title: "Your rights under UK GDPR",
          body: "You have the right to access, correct, delete, restrict, or port your personal data, and to object to our use of it. To exercise any of these rights email kylewilliamsmedia@gmail.com. We will respond within 30 days.\n\nIf you are unhappy with how we handle your data you have the right to complain to the Information Commissioner's Office at ico.org.uk."
        },
        {
          title: "Cookies and local storage",
          body: "Shoto uses local storage on your device to store your shot count and device identifier on the guest camera. This does not contain personal information and is stored only on your device.\n\nStripe sets cookies during the payment process to prevent fraud and enable checkout functionality.\n\nGoogle Fonts loads typography from Google's servers. Google may collect limited data when fonts load. See Google's privacy policy at policies.google.com/privacy.\n\nWe do not use advertising cookies or tracking cookies."
        },
        {
          title: "Data security",
          body: "We take reasonable technical measures to protect your data including encrypted connections (HTTPS), access controls on our database, and using reputable third party processors. If you have concerns about data security please contact us at kylewilliamsmedia@gmail.com."
        },
        {
          title: "Changes to this policy",
          body: "We may update this policy from time to time. We will notify you of significant changes by updating the date at the top of this page."
        },
        {
          title: "Contact",
          body: "For any privacy related questions or to exercise your rights:\n\nEmail: kylewilliamsmedia@gmail.com\nWebsite: shoto.co.uk"
        }
      ].map(({ title, body }) => (
        <div key={title} style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            fontWeight: 400,
            color: "#f5efe6",
            marginBottom: 12
          }}>{title}</h2>
          {body.split("\n\n").map((para, i) => (
            <p key={i} style={{ color: "#a89070", fontSize: 14, lineHeight: 1.8, marginBottom: 8, fontWeight: 300 }}>{para}</p>
          ))}
        </div>
      ))}

      <div style={{ borderTop: "1px solid rgba(245,239,230,0.08)", paddingTop: 32, marginTop: 24 }}>
        <a href="/" style={{ color: "#c4a882", fontSize: 12, textDecoration: "none", letterSpacing: 2 }}>← Back to shoto.co.uk</a>
      </div>
    </div>
  )
}