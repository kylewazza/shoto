import { useState } from "react"
import { SiteNav, SiteFooter } from "./SiteChrome"
import "./Create.css"

const OCCASIONS = [
  "Wedding",
  "Birthday",
  "Prom",
  "Hen Do",
  "Stag Do",
  "Corporate",
  "Weekend Away",
  "Other"
]

const HEARD_FROM = [
  "Google search",
  "ChatGPT or another AI assistant",
  "Instagram",
  "TikTok",
  "Facebook",
  "Wedding fayre or event",
  "Friend, family or a guest at an event",
  "Venue or supplier recommendation",
  "Other"
]

const TIERS = [
  {
    id: "basic",
    name: "Basic",
    price: "£9.99",
    guests: "Up to 75 guests",
    shots: "30 shots per guest"
  },
  {
    id: "standard",
    name: "Standard",
    price: "£19.99",
    guests: "Up to 100 guests",
    shots: "40 shots per guest",
    featured: true
  },
  {
    id: "premium",
    name: "Premium",
    price: "£29.99",
    guests: "Up to 150 guests",
    shots: "50 shots per guest"
  }
]

function getDefaultReveal(eventDate) {
  const date = new Date(eventDate)
  date.setDate(date.getDate() + 1)
  date.setHours(10, 0, 0, 0)
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export default function Create() {
  const [tier, setTier] = useState("standard")
  const [eventName, setEventName] = useState("")
  const [occasion, setOccasion] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [revealAt, setRevealAt] = useState("")
  const [heardFrom, setHeardFrom] = useState("")
  const [heardFromOther, setHeardFromOther] = useState("")
  const [loading, setLoading] = useState(false)

  function handleDateChange(date) {
    setEventDate(date)
    setRevealAt(getDefaultReveal(date))
  }

  async function handleCheckout() {
    if (!tier || !eventName.trim() || !occasion || !eventDate || !revealAt || !heardFrom) return
    setLoading(true)

    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          eventName: eventName.trim(),
          occasion,
          eventDate,
          revealAt,
          heardFrom: heardFrom === "Other" && heardFromOther.trim()
            ? `Other: ${heardFromOther.trim()}`
            : heardFrom
        })
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Something went wrong. Please try again.")
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const isValid = tier && eventName.trim() && occasion && eventDate && revealAt && heardFrom

  const selected = TIERS.find(t => t.id === tier)

  return (
    <div className="site">
      <div className="site-grain" />
      <div className="site-wrap">
        <SiteNav hideCta />
      </div>

      <main className="site-wrap cr-main">
        <h1 className="site-title">Create your event</h1>
        <p className="site-lead">Takes a couple of minutes. Your QR code arrives by email straight after payment.</p>

        <div className="cr-tiers" role="radiogroup" aria-label="Package">
          {TIERS.map(t => (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={tier === t.id}
              className={`cr-tier ${tier === t.id ? "is-on" : ""}`}
              onClick={() => setTier(t.id)}
            >
              <span className="cr-tier-name">{t.featured && <small>Most popular</small>}{t.name}</span>
              <span className="cr-tier-meta">{t.guests}<br />{t.shots}</span>
              <span className="cr-tier-price">{t.price}</span>
            </button>
          ))}
        </div>

        <div className="site-form site-form--two">
          <div className="site-field">
            <label htmlFor="cr-name">Event name</label>
            <input
              id="cr-name"
              type="text"
              placeholder="e.g. Sarah & Tom's Wedding"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div className="site-field">
            <label htmlFor="cr-occasion">Occasion</label>
            <select id="cr-occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
              <option value="">Select occasion</option>
              {OCCASIONS.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          <div className="site-field">
            <label htmlFor="cr-date">Event date</label>
            <input
              id="cr-date"
              type="date"
              value={eventDate}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>

          <div className="site-field">
            <label htmlFor="cr-reveal">Gallery reveal time</label>
            <input
              id="cr-reveal"
              type="datetime-local"
              value={revealAt}
              onChange={(e) => setRevealAt(e.target.value)}
            />
            <small>Default is 10am the morning after your event. You can change this.</small>
          </div>

          <div className="site-field site-field--full">
            <label htmlFor="cr-heard">How did you hear about us?</label>
            <select id="cr-heard" value={heardFrom} onChange={(e) => setHeardFrom(e.target.value)}>
              <option value="">Select one</option>
              {HEARD_FROM.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            {heardFrom === "Other" && (
              <input
                type="text"
                aria-label="Where did you hear about us?"
                placeholder="Tell us where"
                maxLength={100}
                value={heardFromOther}
                onChange={(e) => setHeardFromOther(e.target.value)}
              />
            )}
          </div>

          <div className="site-field--full">
            <button
              className="site-btn site-btn--block"
              onClick={handleCheckout}
              disabled={!isValid || loading}
            >
              {loading ? "Redirecting to payment..." : `Pay ${selected?.price}`}
            </button>
            <p className="cr-note">
              Secure payment via Stripe. By purchasing you agree to our <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter small />
    </div>
  )
}
