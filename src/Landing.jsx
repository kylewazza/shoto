export default function Landing() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#111",
      color: "#fff",
      fontFamily: "sans-serif",
    }}>

      {/* Nav */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: "1px solid #222"
      }}>
        <h1 style={{ margin: 0, letterSpacing: 3, fontSize: 20 }}>shoto</h1>
        <a href="/create" style={{
          background: "#fff",
          color: "#111",
          padding: "8px 20px",
          borderRadius: 6,
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: 14
        }}>Get Started</a>
      </nav>

      {/* Hero */}
      <div style={{
        textAlign: "center",
        padding: "100px 20px 80px",
        maxWidth: 700,
        margin: "0 auto"
      }}>
        <p style={{
          color: "#888",
          letterSpacing: 4,
          fontSize: 12,
          marginBottom: 24,
          textTransform: "uppercase"
        }}>Disposable cameras for the digital age</p>
        <h2 style={{
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: 24
        }}>Your guests shoot.<br />You see it all<br />the morning after.</h2>
        <p style={{
          color: "#aaa",
          fontSize: 18,
          lineHeight: 1.6,
          marginBottom: 48,
          maxWidth: 500,
          margin: "0 auto 48px"
        }}>
          Shoto gives every guest a disposable camera on their phone.
          No app download. No gallery. Just scan, shoot, and wait for the reveal.
        </p>
        <a href="/create" style={{
          background: "#fff",
          color: "#111",
          padding: "16px 40px",
          borderRadius: 50,
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: 18,
          display: "inline-block"
        }}>Create your event</a>
      </div>

      {/* How it works */}
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "80px 40px",
        borderTop: "1px solid #222"
      }}>
        <h3 style={{
          textAlign: "center",
          color: "#888",
          letterSpacing: 4,
          fontSize: 12,
          textTransform: "uppercase",
          marginBottom: 60
        }}>How it works</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 48,
          textAlign: "center"
        }}>
          {[
            { step: "01", title: "Create your event", desc: "Enter your event name and get a unique QR code instantly." },
            { step: "02", title: "Guests scan and shoot", desc: "No app download needed. They scan, get a limited number of shots, and that's it." },
            { step: "03", title: "The morning after reveal", desc: "Open your private dashboard link and see every photo. Download them all as a ZIP." },
          ].map(({ step, title, desc }) => (
            <div key={step}>
              <p style={{ color: "#555", fontSize: 12, letterSpacing: 3, marginBottom: 12 }}>{step}</p>
              <h4 style={{ fontSize: 18, marginBottom: 12 }}>{title}</h4>
              <p style={{ color: "#aaa", lineHeight: 1.6, fontSize: 15 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{
        maxWidth: 500,
        margin: "0 auto",
        padding: "80px 40px",
        borderTop: "1px solid #222",
        textAlign: "center"
      }}>
        <h3 style={{
          color: "#888",
          letterSpacing: 4,
          fontSize: 12,
          textTransform: "uppercase",
          marginBottom: 40
        }}>Simple pricing</h3>
        <div style={{
          background: "#1a1a1a",
          borderRadius: 16,
          padding: 40,
          border: "1px solid #333"
        }}>
          <p style={{ color: "#aaa", marginBottom: 8 }}>One event</p>
          <p style={{ fontSize: 56, fontWeight: 700, margin: "0 0 8px" }}>£10</p>
          <p style={{ color: "#555", marginBottom: 32, fontSize: 14 }}>No subscription. Pay once per event.</p>
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 40px",
            textAlign: "left",
            color: "#aaa",
            fontSize: 15
          }}>
            {[
              "50 shots per guest",
              "Unlimited guests",
              "Film filter applied to every photo",
              "Private organiser dashboard",
              "Download all photos as ZIP",
              "QR code to share or print",
            ].map((item) => (
              <li key={item} style={{ marginBottom: 12 }}>✓ {item}</li>
            ))}
          </ul>
          <a href="/create" style={{
            background: "#fff",
            color: "#111",
            padding: "14px 40px",
            borderRadius: 50,
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: 16,
            display: "block"
          }}>Get started for £10</a>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #222",
        padding: "40px",
        textAlign: "center",
        color: "#555",
        fontSize: 13
      }}>
        <p>© 2025 Shoto. Made for weddings, parties, and every moment worth remembering.</p>
      </div>

    </div>
  )
}