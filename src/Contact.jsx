import { useState } from "react"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
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
        body: JSON.stringify({ ...form, occasion: "Contact form", guests: "N/A" })
      })
      setSent(true)
    } catch (e) {
      alert("Something went wrong. Please email us directly at hello@shoto.co.uk")
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1410",
      color: "#f5efe6",
      fontFamily: "'Inter', sans-serif",
      padding: "64px 48px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ letterSpacing: 4, fontSize: 18, fontWeight: 300, marginBottom: 64 }}>shoto</h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "start"
        }}>
          {/* Left */}
          <div>
            <p style={{ color: "#c4a882", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24, fontWeight: 300 }}>Get in touch</p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: 32,
              color: "#f5efe6",
              lineHeight: 1.4,
              marginBottom: 32,
              fontWeight: 400
            }}>Have a question? We'd love to hear from you.</p>
            <p style={{ color: "#a89070", fontSize: 14, lineHeight: 1.9, marginBottom: 32, fontWeight: 300 }}>
              Whether you have a question about a package, want to discuss a bespoke event, or just want to find out more about how Shoto works — get in touch and we'll get back to you within 24 hours.
            </p>
            <p style={{ color: "#a89070", fontSize: 14, marginBottom: 8, fontWeight: 300 }}>Or email us directly:</p>
            <a href="mailto:hello@shoto.co.uk" style={{ color: "#c4a882", fontSize: 14, textDecoration: "none", letterSpacing: 1 }}>hello@shoto.co.uk</a>

            <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(245,239,230,0.08)" }}>
              <a href="/" style={{ color: "#a89070", fontSize: 12, textDecoration: "none", letterSpacing: 2 }}>← Back to shoto.co.uk</a>
            </div>
          </div>

          {/* Right */}
          <div>
            {sent ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <p style={{ color: "#c4a882", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Message sent</p>
                <p style={{ color: "#a89070", fontSize: 14, fontWeight: 300 }}>We will be in touch within 24 hours.</p>
              </div>
            ) : (
              <div>
                <label style={labelStyle}>Your name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" style={inputStyle} />

                <label style={labelStyle}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle} />

                <label style={labelStyle}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  rows={6}
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
                  {sending ? "Sending..." : "Send message"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}