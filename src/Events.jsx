import { useState } from "react"
import { SiteNav, SiteFooter, Rise } from "./SiteChrome"
import { usePageMeta } from "./siteHooks"
import "./Events.css"

const PAGE_TITLE = "Shoto Events | Digital disposable camera for festivals, corporate events and venues"
const PAGE_DESCRIPTION = "Shoto Events turns every attendee into your content team. One QR code, no app, thousands of candid photos from festivals, corporate events, venues and brand activations. Sponsor branding available."

const AUDIENCES = [
  { title: "Festivals and live events", desc: "Capture the crowd's view of every stage and every moment. Content for next year's line up announcement, straight from the people who were there." },
  { title: "Corporate events and conferences", desc: "Awards nights, summer parties, Christmas dos and conferences. A shared camera gets people talking and gives your comms team a gallery the next morning." },
  { title: "Venues and stadiums", desc: "Offer Shoto to every event you host. A simple add on for your clients, and a steady stream of real photos of your venue in use." },
  { title: "Brands and sponsors", desc: "Put your name on the camera every guest is using. Every photo taken is a moment people chose to capture with your brand on it." },
]

const FEATURES = [
  "Scales from a hundred guests to thousands",
  "Set the number of shots per guest",
  "Live gallery for your team during the event",
  "Our signature film look, plus clean originals for your own use",
  "Optional guest usernames and marketing consent, so you can share photos with permission",
  "Short video clips if you want them",
  "Download everything in one go",
]

const FAQS = [
  { q: "How many people can use it?", a: "As many as are at your event. We set it up around your numbers." },
  { q: "Do guests need to download anything?", a: "No. They scan the QR code and the camera opens in their phone's browser." },
  { q: "Can we see photos during the event?", a: "Yes. Your team can watch the gallery fill up live." },
  { q: "Can we use the photos in our marketing?", a: "Yes. We can ask guests for their username and permission before they start shooting." },
  { q: "How much does it cost?", a: "It depends on attendance, the number of shots and whether a sponsor is involved. Tell us about your event and we'll send a quote." },
]

function scrollToForm() {
  document.getElementById("events-form")?.scrollIntoView({ behavior: "smooth" })
}

export default function Events() {
  usePageMeta(PAGE_TITLE, PAGE_DESCRIPTION)

  return (
    <div className="site">
      <div className="site-grain" />

      <div className="site-wrap">
        <SiteNav current="/events" />

        <header className="ev-hero">
          <div>
            <h1 className="site-title">Every guest becomes your <em>content team</em>.</h1>
            <p>A digital disposable camera for festivals, corporate events and venues. One QR code, every attendee shooting on their own phone.</p>
            <button className="site-btn" onClick={scrollToForm}>Talk to us about your event</button>
          </div>
          <figure>
            <img src="/photos/wedding-02.jpg" alt="Guests dancing under coloured lights, taken on Shoto" fetchPriority="high" />
            <span className="ev-live" aria-hidden="true">Live gallery</span>
          </figure>
        </header>

        <section className="site-steps" aria-label="How it works">
          <div className="site-step">
            <h3>Put it up</h3>
            <p>On screens, wristbands, tickets, tables or signage. Guests scan it with their phone camera.</p>
          </div>
          <div className="site-step">
            <h3>Guests shoot</h3>
            <p>No download, no account. Each guest gets a set number of shots with our film look.</p>
          </div>
          <div className="site-step">
            <h3>You get everything</h3>
            <p>Watch photos arrive live during the event, then download the lot, filtered and original.</p>
          </div>
        </section>
      </div>

      <section className="site-section">
        <div className="site-wrap">
          <h2 className="site-h2">Who it's for</h2>
          <div className="ev-audience">
            {AUDIENCES.map(({ title, desc }) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap">
          <h2 className="site-h2">What you get</h2>
          <ul className="ev-features">
            {FEATURES.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="site-wrap">
        <div className="site-band">
          <div>
            <h2>Built for sponsors</h2>
            <p>A Shoto camera can carry a sponsor's branding, so the festival or event gets the camera free or at a reduced cost and the sponsor gets their name in every guest's hand all day.</p>
          </div>
          <button className="site-btn site-btn--ghost" onClick={scrollToForm}>Talk to us about your event</button>
        </div>
      </section>

      <section className="site-section">
        <Rise className="site-wrap ev-proof">
          <blockquote>“The best QR code camera business I've seen, and the most simple.”</blockquote>
          <cite>Professional wedding photographer</cite>
        </Rise>
      </section>

      <section className="site-section" id="events-form" style={{ paddingTop: 0 }}>
        <div className="site-wrap ev-enquire">
          <div>
            <h2 className="site-h2">Tell us about your event</h2>
            <p className="site-lead">Already capturing weddings, corporate events and parties across the UK. We'll reply within one working day.</p>
          </div>
          <EventsForm />
        </div>
      </section>

      <section className="site-section" style={{ paddingTop: 0 }}>
        <div className="site-wrap site-wrap--narrow">
          <h2 className="site-h2">Questions</h2>
          <div className="site-faq">
            {FAQS.map(({ q, a }) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
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

  if (sent) {
    return (
      <div className="site-sent">
        <h3>Enquiry sent</h3>
        <p>Thanks. We'll be in touch within one working day.</p>
      </div>
    )
  }

  return (
    <div className="site-form site-form--two">
      <div className="site-field">
        <label htmlFor="ev-name">Name</label>
        <input id="ev-name" name="name" value={form.name} onChange={handleChange} placeholder="Full name" />
      </div>
      <div className="site-field">
        <label htmlFor="ev-org">Organisation</label>
        <input id="ev-org" name="organisation" value={form.organisation} onChange={handleChange} placeholder="Company, festival or venue" />
      </div>
      <div className="site-field">
        <label htmlFor="ev-email">Email</label>
        <input id="ev-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
      </div>
      <div className="site-field">
        <label htmlFor="ev-phone">Phone (optional)</label>
        <input id="ev-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone number" />
      </div>
      <div className="site-field">
        <label htmlFor="ev-type">Type of event</label>
        <select id="ev-type" name="eventType" value={form.eventType} onChange={handleChange}>
          <option value="">Choose one</option>
          <option>Festival</option>
          <option>Corporate</option>
          <option>Venue</option>
          <option>Brand activation</option>
          <option>Other</option>
        </select>
      </div>
      <div className="site-field">
        <label htmlFor="ev-attendance">Expected attendance</label>
        <input id="ev-attendance" name="attendance" value={form.attendance} onChange={handleChange} placeholder="e.g. 2,000" />
      </div>
      <div className="site-field">
        <label htmlFor="ev-dates">Event date(s)</label>
        <input id="ev-dates" name="dates" value={form.dates} onChange={handleChange} placeholder="e.g. 18 to 20 July 2027" />
      </div>
      <div className="site-field">
        <label htmlFor="ev-sponsor">Interested in sponsorship?</label>
        <select id="ev-sponsor" name="sponsorship" value={form.sponsorship} onChange={handleChange}>
          <option value="">Choose one</option>
          <option>Yes</option>
          <option>No</option>
          <option>Not sure</option>
        </select>
      </div>
      <div className="site-field site-field--full">
        <label htmlFor="ev-message">Anything else we should know</label>
        <textarea id="ev-message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us a little about the event" rows={4} />
      </div>
      <div className="site-field--full">
        <button className="site-btn site-btn--block" onClick={handleSubmit} disabled={sending || !ready}>
          {sending ? "Sending..." : "Send enquiry"}
        </button>
      </div>
    </div>
  )
}
