import { useState } from "react"
import { SiteNav, SiteFooter } from "./SiteChrome"

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

  const ready = form.name && form.email && form.message

  return (
    <div className="site">
      <div className="site-grain" />
      <div className="site-wrap">
        <SiteNav current="/contact" />
      </div>

      <main className="site-wrap site-section--tight ct-grid">
        <div>
          <h1 className="site-title">Have a question? Ask away.</h1>
          <p className="site-lead">Whether it's about a package, a bigger event, or just how Shoto works, we'll get back to you within 24 hours.</p>
          <p className="ct-direct">Or email us directly at <a href="mailto:hello@shoto.co.uk">hello@shoto.co.uk</a></p>
        </div>

        <div>
          {sent ? (
            <div className="site-sent">
              <h3>Message sent</h3>
              <p>We will be in touch within 24 hours.</p>
            </div>
          ) : (
            <div className="site-form">
              <div className="site-field">
                <label htmlFor="ct-name">Your name</label>
                <input id="ct-name" name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
              </div>
              <div className="site-field">
                <label htmlFor="ct-email">Email</label>
                <input id="ct-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
              </div>
              <div className="site-field">
                <label htmlFor="ct-message">Message</label>
                <textarea id="ct-message" name="message" value={form.message} onChange={handleChange} placeholder="How can we help?" rows={6} />
              </div>
              <button className="site-btn site-btn--block" onClick={handleSubmit} disabled={sending || !ready}>
                {sending ? "Sending..." : "Send message"}
              </button>
            </div>
          )}
        </div>
      </main>

      <SiteFooter small />
    </div>
  )
}
