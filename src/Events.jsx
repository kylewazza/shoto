import { useState, useEffect } from "react"

const PAGE_TITLE = "Shoto Events | Digital disposable camera for festivals, corporate events and venues"
const PAGE_DESCRIPTION = "Shoto Events turns every attendee into your content team. One QR code, no app, thousands of candid photos from festivals, corporate events, venues and brand activations. Sponsor branding available."

const eyebrow = { color: "#c4a882", letterSpacing: 6, fontSize: 13, textTransform: "uppercase", fontWeight: 300 }
const section = { maxWidth: 960, margin: "0 auto", padding: "100px 24px", position: "relative", zIndex: 10 }

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 24px", opacity: 0.2, position: "relative", zIndex: 10 }}>
      <div style={{ flex: 1, height: 1, background: "#f5efe6" }} />
      <span style={{ color: "#f5efe6", fontSize: 10 }}>✦</span>
      <div style={{ flex: 1, height: 1, background: "#f5efe6" }} />
    </div>
  )
}

function scrollToForm() {
  document.getElementById("events-form")?.scrollIntoView({ behavior: "smooth" })
}

export default function Events() {
  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute("content")
    document.title = PAGE_TITLE
    meta?.setAttribute("content", PAGE_DESCRIPTION)
    return () => {
      document.title = previousTitle
      if (meta && previousDescription) meta.setAttribute("content", previousDescription)
    }
  }, [])

  const audiences = [
    { title: "Festivals and live events", desc: "Capture the crowd's view of every stage and every moment. Content for next year's line up announcement, straight from the people who were there." },
    { title: "Corporate events and conferences", desc: "Awards nights, summer parties, Christmas dos and conferences. A shared camera gets people talking and gives your comms team a gallery the next morning." },
    { title: "Venues and stadiums", desc: "Offer Shoto to every event you host. A simple add on for your clients, and a steady stream of real photos of your venue in use." },
    { title: "Brands and sponsors", desc: "Put your name on the camera every guest is using. Every photo taken is a moment people chose to capture with your brand on it." },
  ]

  const features = [
    "Scales from a hundred guests to thousands",
    "Set the number of shots per guest",
    "Live gallery for your team during the event",
    "Our signature film look, plus clean originals for your own use",
    "Optional guest usernames and marketing consent, so you can share photos with permission",
    "Short video clips if you want them",
    "Download everything in one go",
  ]

  const faqs = [
    { q: "How many people can use it?", a: "As many as are at your event. We set it up around your numbers." },
    { q: "Do guests need to download anything?", a: "No. They scan the QR code and the camera opens in their phone's browser." },
    { q: "Can we see photos during the event?", a: "Yes. Your team can watch the gallery fill up live." },
    { q: "Can we use the photos in our marketing?", a: "Yes. We can ask guests for their username and permission before they start shooting." },
    { q: "How much does it cost?", a: "It depends on attendance, the number of shots and whether a sponsor is involved. Tell us about your event and we'll send a quote." },
  ]

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

      {/* Warm light leak */}
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
        padding: "28px 24px",
        position: "relative",
        zIndex: 10
      }}>
        <a href="/" style={{ color: "#a89070", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", fontWeight: 300, flex: 1 }}>Home</a>
        <a href="/" style={{
          margin: 0,
          letterSpacing: 6,
          fontSize: 16,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          color: "#f5efe6",
          textDecoration: "none"
        }}>shoto</a>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <a href="/contact" style={{ color: "#a89070", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", textDecoration: "none", fontWeight: 300 }}>Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        textAlign: "center",
        padding: "80px 24px 120px",
        maxWidth: 720,
        margin: "0 auto",
        position: "relative",
        zIndex: 10
      }}>
        <p style={{ ...eyebrow, marginBottom: 32 }}>Shoto Events</p>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(36px, 5.5vw, 62px)",
          fontWeight: 400,
          lineHeight: 1.15,
          marginBottom: 40,
          color: "#f5efe6",
          fontStyle: "italic",
          textShadow: "0 0 80px rgba(255,180,80,0.15)"
        }}>Every guest becomes your content team.</h2>

        <p style={{
          color: "#a89070",
          fontSize: 16,
          lineHeight: 2,
          maxWidth: 520,
          margin: "0 auto 64px",
          fontWeight: 300
        }}>
          A digital disposable camera for festivals, corporate events and venues. One QR code, no app, every attendee shooting from their own phone. You get thousands of candid moments your photographers could never catch.
        </p>
        <button
          onClick={scrollToForm}
          style={{
            background: "#f5efe6",
            color: "#1a1410",
            padding: "16px 40px",
            borderRadius: 3,
            border: "none",
            fontWeight: 400,
            fontSize: 13,
            display: "inline-block",
            letterSpacing: 3,
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif"
          }}>Talk to us about your event</button>
      </div>

      <Divider />

      {/* How it works */}
      <div style={section}>
        <p style={{ ...eyebrow, textAlign: "center", marginBottom: 80 }}>How it works</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 64 }}>
          {[
            { step: "I", title: "Put up the QR code", desc: "On screens, wristbands, tickets, tables or signage. Guests scan it with their phone camera." },
            { step: "II", title: "Guests shoot", desc: "No download, no account. Each guest gets a set number of shots with our film look." },
            { step: "III", title: "You get everything", desc: "Watch photos arrive live during the event, then download the lot, filtered and original." },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Playfair Display', serif", color: "#a89070", fontSize: 18, marginBottom: 24, fontStyle: "italic" }}>{step}</p>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 16, fontWeight: 400, color: "#f5efe6" }}>{title}</h4>
              <p style={{ color: "#a89070", lineHeight: 1.9, fontSize: 14, fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* Who it's for */}
      <div style={section}>
        <p style={{ ...eyebrow, textAlign: "center", marginBottom: 64 }}>Who it's for</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {audiences.map(({ title, desc }) => (
            <div key={title} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,239,230,0.06)",
              borderRadius: 6,
              padding: "36px 32px"
            }}>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 22, marginTop: 0, marginBottom: 16, fontWeight: 400, color: "#f5efe6" }}>{title}</h4>
              <p style={{ color: "#a89070", lineHeight: 1.9, fontSize: 14, fontWeight: 300, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* What you get */}
      <div style={{ ...section, maxWidth: 620 }}>
        <p style={{ ...eyebrow, textAlign: "center", marginBottom: 56 }}>What you get</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#a89070", fontSize: 15, fontWeight: 300, lineHeight: 1.7 }}>
          {features.map((item) => (
            <li key={item} style={{ marginBottom: 18, display: "flex", gap: 16, alignItems: "flex-start" }}>
              <span style={{ color: "#c4a882", marginTop: 1 }}>✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Built for sponsors */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 100px", position: "relative", zIndex: 10 }}>
        <div style={{
          background: "rgba(245,239,230,0.05)",
          border: "1px solid rgba(245,239,230,0.15)",
          borderRadius: 6,
          padding: "48px 32px",
          textAlign: "center"
        }}>
          <p style={{ color: "#c4a882", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24, fontWeight: 300 }}>Built for sponsors</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 22, lineHeight: 1.6, color: "#f5efe6", marginBottom: 32, fontWeight: 400 }}>
            A Shoto camera can carry a sponsor's branding, so the festival or event gets the camera free or at a reduced cost and the sponsor gets their name in every guest's hand all day.
          </p>
          <button
            onClick={scrollToForm}
            style={{
              background: "transparent", color: "#f5efe6", border: "1px solid rgba(245,239,230,0.2)",
              borderRadius: 3, padding: "13px 32px", fontSize: 11, letterSpacing: 3,
              textTransform: "uppercase", cursor: "pointer", fontFamily: "'Inter', sans-serif"
            }}>Talk to us about sponsor packages</button>
        </div>
      </div>

      <Divider />

      {/* Proof */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 10, textAlign: "center" }}>
        <p style={{ ...eyebrow, letterSpacing: 3, lineHeight: 1.8, marginBottom: 48 }}>Already capturing weddings, corporate events and parties across the UK</p>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(22px, 3vw, 28px)",
          fontStyle: "italic",
          color: "#f5efe6",
          lineHeight: 1.6,
          marginBottom: 24,
          fontWeight: 400
        }}>"The best QR code camera business I've seen, and the most simple."</p>
        <p style={{ color: "#a89070", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", fontWeight: 300 }}>Professional wedding photographer</p>
      </div>

      <Divider />

      {/* Enquiry form */}
      <div id="events-form" style={{ maxWidth: 560, margin: "0 auto", padding: "100px 24px", position: "relative", zIndex: 10 }}>
        <p style={{ ...eyebrow, textAlign: "center", marginBottom: 16 }}>Enquire</p>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 32, fontWeight: 400, textAlign: "center", marginBottom: 48, color: "#f5efe6" }}>Tell us about your event</h3>
        <EventsForm />
      </div>

      <Divider />

      {/* FAQ */}
      <div style={{ ...section, maxWidth: 720 }}>
        <p style={{ ...eyebrow, textAlign: "center", marginBottom: 56 }}>Questions</p>
        {faqs.map(({ q, a }) => (
          <div key={q} style={{ borderBottom: "1px solid rgba(245,239,230,0.08)", padding: "28px 0" }}>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400, marginTop: 0, marginBottom: 12, color: "#f5efe6" }}>{q}</h4>
            <p style={{ color: "#a89070", lineHeight: 1.9, fontSize: 14, fontWeight: 300, margin: 0 }}>{a}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(245,239,230,0.05)",
        padding: "36px 24px",
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
        <a href="/" style={{ color: "#a89070", textDecoration: "none", fontWeight: 300 }}>shoto</a>
        <a href="https://www.instagram.com/useshoto" target="_blank" rel="noopener noreferrer" style={{ color: "#a89070", textDecoration: "none", letterSpacing: 2 }}>useshoto</a>
        <a href="/contact" style={{ color: "#a89070", textDecoration: "none", letterSpacing: 2 }}>Contact</a>
        <a href="/privacy" style={{ color: "#a89070", textDecoration: "none", letterSpacing: 2 }}>Privacy Policy</a>
        <span>© 2026 est.</span>
      </div>
    </div>
  )
}

function EventsForm() {
  const [form, setForm] = useState({
    name: "", organisation: "", email: "", phone: "", eventType: "",
    attendance: "", dates: "", sponsorship: "", message: ""
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const ready = form.name && form.organisation && form.email

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    if (!ready) return
    setSending(true)
    try {
      const res = await fetch("/api/events-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error("Failed to send")
      setSent(true)
    } catch {
      alert("Something went wrong. Please email us directly at hello@shoto.co.uk")
    }
    setSending(false)
  }

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 6,
    border: "1px solid rgba(245,239,230,0.15)", background: "rgba(255,255,255,0.03)",
    color: "#f5efe6", fontSize: 14, marginBottom: 16, boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif"
  }

  const selectStyle = { ...inputStyle, background: "#221b16", appearance: "auto" }

  const labelStyle = {
    color: "#a89070", fontSize: 11, letterSpacing: 2, textTransform: "uppercase",
    display: "block", marginBottom: 8, fontWeight: 300
  }

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <p style={{ color: "#c4a882", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Enquiry sent</p>
        <p style={{ color: "#a89070", fontSize: 14, fontWeight: 300 }}>Thanks. We'll be in touch within one working day.</p>
      </div>
    )
  }

  return (
    <div>
      <label style={labelStyle}>Name</label>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" style={inputStyle} />
      <label style={labelStyle}>Organisation</label>
      <input name="organisation" value={form.organisation} onChange={handleChange} placeholder="Company, festival or venue" style={inputStyle} />
      <label style={labelStyle}>Email</label>
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} />
      <label style={labelStyle}>Phone (optional)</label>
      <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone number" style={inputStyle} />
      <label style={labelStyle}>Type of event</label>
      <select name="eventType" value={form.eventType} onChange={handleChange} style={selectStyle}>
        <option value="">Choose one</option>
        <option>Festival</option>
        <option>Corporate</option>
        <option>Venue</option>
        <option>Brand activation</option>
        <option>Other</option>
      </select>
      <label style={labelStyle}>Expected attendance</label>
      <input name="attendance" value={form.attendance} onChange={handleChange} placeholder="e.g. 2,000" style={inputStyle} />
      <label style={labelStyle}>Event date(s)</label>
      <input name="dates" value={form.dates} onChange={handleChange} placeholder="e.g. 18 to 20 July 2027" style={inputStyle} />
      <label style={labelStyle}>Interested in sponsorship?</label>
      <select name="sponsorship" value={form.sponsorship} onChange={handleChange} style={selectStyle}>
        <option value="">Choose one</option>
        <option>Yes</option>
        <option>No</option>
        <option>Not sure</option>
      </select>
      <label style={labelStyle}>Anything else we should know</label>
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us a little about the event" rows={4} style={{ ...inputStyle, resize: "vertical" }} />
      <button
        onClick={handleSubmit}
        disabled={sending || !ready}
        style={{
          width: "100%", padding: "14px", borderRadius: 4, border: "none",
          background: ready ? "#f5efe6" : "#2a2420",
          color: ready ? "#1a1410" : "#4a3f35",
          fontSize: 12, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase",
          cursor: ready ? "pointer" : "not-allowed",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {sending ? "Sending..." : "Send enquiry"}
      </button>
    </div>
  )
}
