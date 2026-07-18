export default function Landing() {
  const tiers = [
    {
      name: "Basic",
      price: "£9.99",
      guests: "Up to 75 guests",
      shots: "30 shots per guest",
    },
    {
      name: "Standard",
      price: "£19.99",
      guests: "Up to 100 guests",
      shots: "40 shots per guest",
      featured: true,
    },
    {
      name: "Premium",
      price: "£29.99",
      guests: "Unlimited guests",
      shots: "50 shots per guest",
    },
  ]

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1410",
      color: "#f5efe6",
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* Grain overlay */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.055,
        pointerEvents: "none",
        zIndex: 100
      }} />

      {/* Warm light leak top */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "60%",
        height: "40%",
        background: "radial-gradient(ellipse at top left, rgba(255,180,80,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Nav */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "28px 48px",
        position: "relative",
        zIndex: 10
      }}>
        <h1 style={{
          margin: 0,
          letterSpacing: 6,
          fontSize: 16,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          color: "#f5efe6"
        }}>shoto</h1>
        <a href="/create" style={{
          border: "1px solid rgba(245,239,230,0.25)",
          color: "#f5efe6",
          padding: "9px 22px",
          borderRadius: 3,
          textDecoration: "none",
          fontWeight: 300,
          fontSize: 12,
          letterSpacing: 2,
          textTransform: "uppercase"
        }}>Get Started</a>
      </nav>

      {/* Hero */}
      <div style={{
        textAlign: "center",
        padding: "100px 24px 120px",
        maxWidth: 680,
        margin: "0 auto",
        position: "relative",
        zIndex: 10
      }}>
        <p style={{
          color: "#c4a882",
          letterSpacing: 6,
          fontSize: 10,
          marginBottom: 48,
          textTransform: "uppercase",
          fontWeight: 300
        }}>The disposable camera experience, reimagined</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(42px, 7vw, 76px)",
          fontWeight: 400,
          lineHeight: 1.15,
          marginBottom: 40,
          color: "#f5efe6",
          fontStyle: "italic",
          textShadow: "0 0 80px rgba(255,180,80,0.15)"
        }}>The photos you<br />never knew<br />were being taken.</h2>
        <p style={{
          color: "#a89070",
          fontSize: 16,
          lineHeight: 2,
          marginBottom: 64,
          maxWidth: 440,
          margin: "0 auto 64px",
          fontWeight: 300
        }}>
          Guests scan a QR code and get a disposable camera on their phone.
          No app. No gallery. Candid moments, revealed when you're ready.
        </p>
        <a href="/create" style={{
          background: "#f5efe6",
          color: "#1a1410",
          padding: "16px 48px",
          borderRadius: 3,
          textDecoration: "none",
          fontWeight: 400,
          fontSize: 13,
          display: "inline-block",
          letterSpacing: 3,
          textTransform: "uppercase"
        }}>Create your event</a>
        <p style={{
          color: "#4a3f35",
          fontSize: 12,
          marginTop: 20,
          letterSpacing: 1
        }}>From £9.99 per event — no subscription</p>
      </div>

      {/* Divider */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 48px",
        opacity: 0.2,
        position: "relative",
        zIndex: 10
      }}>
        <div style={{ flex: 1, height: 1, background: "#f5efe6" }} />
        <span style={{ color: "#f5efe6", fontSize: 10 }}>✦</span>
        <div style={{ flex: 1, height: 1, background: "#f5efe6" }} />
      </div>

      {/* How it works */}
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "100px 48px",
        position: "relative",
        zIndex: 10
      }}>
        <p style={{
          textAlign: "center",
          color: "#c4a882",
          letterSpacing: 6,
          fontSize: 10,
          textTransform: "uppercase",
          marginBottom: 80,
          fontWeight: 300
        }}>How it works</p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 64,
        }}>
          {[
            { step: "I", title: "Create your event", desc: "Enter your event name. Get a QR code and your private dashboard link instantly." },
            { step: "II", title: "Guests scan and shoot", desc: "No download, no account. They get a limited number of shots and nothing else. No gallery, no previews." },
            { step: "III", title: "The reveal", desc: "Open your dashboard, see every candid moment your guests captured. Download them all." },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                color: "#4a3f35",
                fontSize: 18,
                marginBottom: 24,
                fontStyle: "italic"
              }}>{step}</p>
              <h4 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20,
                marginBottom: 16,
                fontWeight: 400,
                color: "#f5efe6"
              }}>{title}</h4>
              <p style={{ color: "#a89070", lineHeight: 1.9, fontSize: 14, fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 48px",
        opacity: 0.2,
        position: "relative",
        zIndex: 10
      }}>
        <div style={{ flex: 1, height: 1, background: "#f5efe6" }} />
        <span style={{ color: "#f5efe6", fontSize: 10 }}>✦</span>
        <div style={{ flex: 1, height: 1, background: "#f5efe6" }} />
      </div>

      {/* Pricing */}
      <div style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "100px 24px 120px",
        position: "relative",
        zIndex: 10
      }}>
        <p style={{
          textAlign: "center",
          color: "#c4a882",
          letterSpacing: 6,
          fontSize: 10,
          textTransform: "uppercase",
          marginBottom: 16,
          fontWeight: 300
        }}>Pricing</p>
        <p style={{
          textAlign: "center",
          color: "#4a3f35",
          fontSize: 13,
          marginBottom: 64,
          letterSpacing: 1
        }}>Pay once per event. No subscription.</p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16
        }}>
          {tiers.map(({ name, price, guests, shots, featured }) => (
            <div key={name} style={{
              background: featured ? "rgba(245,239,230,0.05)" : "rgba(255,255,255,0.02)",
              borderRadius: 6,
              padding: "44px 36px",
              border: featured ? "1px solid rgba(245,239,230,0.15)" : "1px solid rgba(245,239,230,0.06)",
              textAlign: "center",
              position: "relative"
            }}>
              {featured && (
                <p style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#f5efe6",
                  color: "#1a1410",
                  fontSize: 10,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  padding: "4px 16px",
                  borderRadius: 2,
                  fontWeight: 500,
                  whiteSpace: "nowrap"
                }}>Most Popular</p>
              )}
              <p style={{ color: "#c4a882", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 20, fontWeight: 300 }}>{name}</p>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 52,
                fontWeight: 400,
                margin: "0 0 32px",
                color: "#f5efe6",
                fontStyle: "italic"
              }}>{price}</p>
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 40px",
                color: "#a89070",
                fontSize: 13,
                fontWeight: 300,
                lineHeight: 1.6
              }}>
                {[
                  guests,
                  shots,
                  "Film filter on every photo",
                  "Private dashboard",
                  "Download all as ZIP",
                  "Printable QR code",
                ].map((item) => (
                  <li key={item} style={{ marginBottom: 12, display: "flex", gap: 12, alignItems: "flex-start", textAlign: "left" }}>
                    <span style={{ color: "#c4a882", marginTop: 1 }}>✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="/create" style={{
                background: featured ? "#f5efe6" : "transparent",
                color: featured ? "#1a1410" : "#f5efe6",
                padding: "13px 32px",
                borderRadius: 3,
                textDecoration: "none",
                fontWeight: featured ? 500 : 300,
                fontSize: 11,
                display: "block",
                letterSpacing: 3,
                textTransform: "uppercase",
                border: featured ? "none" : "1px solid rgba(245,239,230,0.2)"
              }}>Get started</a>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(245,239,230,0.05)",
        padding: "36px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#4a3f35",
        fontSize: 11,
        letterSpacing: 2,
        position: "relative",
        zIndex: 10
      }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>shoto</span>
        <span>© 2025</span>
      </div>

    </div>
  )
}