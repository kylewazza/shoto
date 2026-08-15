import { useRef, useState, useEffect } from "react"

function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("shoto_cookies_accepted")) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem("shoto_cookies_accepted", "true")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#111008",
      borderTop: "1px solid rgba(245,239,230,0.08)",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      zIndex: 999,
      flexWrap: "wrap"
    }}>
      <p style={{ color: "#a89070", fontSize: 12, margin: 0, fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
        We use cookies and local storage to provide our service. See our <a href="/privacy" style={{ color: "#c4a882" }}>Privacy Policy</a> for details.
      </p>
      <button
        onClick={accept}
        style={{
          background: "#f5efe6",
          color: "#1a1410",
          border: "none",
          borderRadius: 3,
          padding: "8px 20px",
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          whiteSpace: "nowrap"
        }}
      >
        Got it
      </button>
    </div>
  )
}

export default function Landing() {
  const pricingRef = useRef(null)

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
      guests: "Up to 150 guests",
      shots: "50 shots per guest",
    },
  ]

  function scrollToPricing() {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1410",
      color: "#f5efe6",
      fontFamily: "'Inter', sans-serif",
      margin: 0,
      padding: 0,
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
        justifyContent: "center",
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
          fontSize: 13,
          marginBottom: 32,
          textTransform: "uppercase",
          fontWeight: 300
        }}>The disposable camera experience, reimagined</p>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(36px, 5.5vw, 62px)",
          fontWeight: 400,
          lineHeight: 1.15,
          marginBottom: 40,
          color: "#f5efe6",
          fontStyle: "italic",
          textShadow: "0 0 80px rgba(255,180,80,0.15)"
        }}>Candid moments,<br />captured by everyone,<br />in the room.</h2>

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
        <button
          onClick={scrollToPricing}
          style={{
            background: "#f5efe6",
            color: "#1a1410",
            padding: "16px 48px",
            borderRadius: 3,
            border: "none",
            fontWeight: 400,
            fontSize: 13,
            display: "inline-block",
            letterSpacing: 3,
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif"
          }}>Create your event</button>
        <p style={{
          color: "#a89070",
          fontSize: 12,
          marginTop: 20,
          letterSpacing: 1
        }}>From £9.99 per event. No subscription.</p>
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
          fontSize: 13,
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
                color: "#a89070",
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
      <div ref={pricingRef} style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "100px 24px 60px",
        position: "relative",
        zIndex: 10
      }}>
        <p style={{
          textAlign: "center",
          color: "#c4a882",
          letterSpacing: 6,
          fontSize: 13,
          textTransform: "uppercase",
          marginBottom: 16,
          fontWeight: 300
        }}>Pricing</p>
        <p style={{
          textAlign: "center",
          color: "#a89070",
          fontSize: 13,
          marginBottom: 64,
          letterSpacing: 1
        }}>Pay once per event. No subscription.</p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 24
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

        {/* Bespoke */}
        <div style={{
          textAlign: "center",
          padding: "40px 24px",
          border: "1px solid rgba(245,239,230,0.06)",
          borderRadius: 6,
          marginBottom: 24
        }}>
          <p style={{ color: "#c4a882", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 12, fontWeight: 300 }}>Bespoke</p>
          <p style={{ color: "#a89070", fontSize: 14, marginBottom: 24, fontWeight: 300 }}>150+ guests or something more tailored? Get in touch and we'll put together a custom package.</p>
          <button
            onClick={() => document.getElementById("bespoke-form").scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "transparent",
              color: "#f5efe6",
              border: "1px solid rgba(245,239,230,0.2)",
              borderRadius: 3,
              padding: "13px 32px",
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif"
            }}>Enquire about bespoke</button>
        </div>
      </div>

      {/* Bespoke form */}
      <div id="bespoke-form" style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "0 24px 120px",
        position: "relative",
        zIndex: 10
      }}>
        <p style={{
          textAlign: "center",
          color: "#c4a882",
          letterSpacing: 6,
          fontSize: 13,
          textTransform: "uppercase",
          marginBottom: 16,
          fontWeight: 300
        }}>Bespoke enquiry</p>
        <p style={{ textAlign: "center", color: "#a89070", fontSize: 13, marginBottom: 40, fontWeight: 300 }}>Tell us about your event and we'll get back to you within 24 hours.</p>

        <BespokeForm />
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(245,239,230,0.05)",
        padding: "36px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#a89070",
        fontSize: 11,
        letterSpacing: 2,
        position: "relative",
        zIndex: 10,
        flexWrap: "wrap",
        gap: 12
      }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>shoto</span>
        <a href="https://www.instagram.com/useshoto" target="_blank" rel="noopener noreferrer" style={{ color: "#a89070", textDecoration: "none", letterSpacing: 2 }}>useshoto</a>
        <a href="/privacy" style={{ color: "#a89070", textDecoration: "none", letterSpacing: 2 }}>Privacy Policy</a>
        <span>© 2026 est.</span>
      </div>

      <CookieNotice />

    </div>
  )
}

function BespokeForm() {
  const [form, setForm] = useState({ name: "", email: "", occasion: "", guests: "", message: "" })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return
    setSending(true)

    try {
      await fetch("/api/bespoke-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      setSent(true)
    } catch (e) {
      alert("Something went wrong. Please email us directly at kylewilliamsmedia@gmail.com")
    }
    setSending(false)
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 6,
    border: "1px solid rgba(245,239,230,0.15)",
    background: "rgba(255,255,255,0.03)",
    color: "#f5efe6",
    fontSize: 14,
    marginBottom: 16,
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif"
  }

  const labelStyle = {
    color: "#a89070",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    display: "block",
    marginBottom: 8,
    fontWeight: 300
  }

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <p style={{ color: "#c4a882", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Message sent</p>
        <p style={{ color: "#a89070", fontSize: 14, fontWeight: 300 }}>We will be in touch within 24 hours.</p>
      </div>
    )
  }

  return (
    <div>
      <label style={labelStyle}>Your name</label>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" style={inputStyle} />

      <label style={labelStyle}>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} />

      <label style={labelStyle}>Occasion</label>
      <input name="occasion" value={form.occasion} onChange={handleChange} placeholder="e.g. Corporate event, festival" style={inputStyle} />

      <label style={labelStyle}>Expected guest count</label>
      <input name="guests" value={form.guests} onChange={handleChange} placeholder="e.g. 300" style={inputStyle} />

      <label style={labelStyle}>Tell us about your event</label>
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Any details that would help us put together the right package"
        rows={4}
        style={{ ...inputStyle, resize: "vertical" }}
      />

      <button
        onClick={handleSubmit}
        disabled={sending || !form.name || !form.email || !form.message}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 4,
          border: "none",
          background: form.name && form.email && form.message ? "#f5efe6" : "#2a2420",
          color: form.name && form.email && form.message ? "#1a1410" : "#4a3f35",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: 3,
          textTransform: "uppercase",
          cursor: form.name && form.email && form.message ? "pointer" : "not-allowed",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {sending ? "Sending..." : "Send enquiry"}
      </button>
    </div>
  )
}