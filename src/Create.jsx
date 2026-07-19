import { useState } from "react"

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
    guests: "Unlimited guests",
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
  const [loading, setLoading] = useState(false)

  function handleDateChange(date) {
    setEventDate(date)
    setRevealAt(getDefaultReveal(date))
  }

  async function handleCheckout() {
    if (!tier || !eventName.trim() || !occasion || !eventDate || !revealAt) return
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
          revealAt
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

  const isValid = tier && eventName.trim() && occasion && eventDate && revealAt

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 6,
    border: "1px solid rgba(245,239,230,0.15)",
    background: "rgba(255,255,255,0.03)",
    color: "#f5efe6",
    fontSize: 15,
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
      padding: 24,
      maxWidth: 520,
      margin: "0 auto"
    }}>
      <h1 style={{ letterSpacing: 4, fontSize: 18, fontWeight: 300, marginBottom: 48, marginTop: 32 }}>shoto</h1>

      <p style={{ color: "#c4a882", letterSpacing: 4, fontSize: 10, textTransform: "uppercase", marginBottom: 32, fontWeight: 300 }}>Create your event</p>

      {/* Tier selection */}
      <label style={labelStyle}>Package</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {TIERS.map(t => (
          <div
            key={t.id}
            onClick={() => setTier(t.id)}
            style={{
              border: tier === t.id ? "1px solid rgba(245,239,230,0.4)" : "1px solid rgba(245,239,230,0.1)",
              borderRadius: 6,
              padding: "12px 8px",
              textAlign: "center",
              cursor: "pointer",
              background: tier === t.id ? "rgba(245,239,230,0.05)" : "transparent"
            }}
          >
            <p style={{ color: "#c4a882", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{t.name}</p>
            <p style={{ fontSize: 16, fontFamily: "'Playfair Display', serif", fontStyle: "italic", marginBottom: 4 }}>{t.price}</p>
            <p style={{ color: "#a89070", fontSize: 10 }}>{t.guests}</p>
            <p style={{ color: "#a89070", fontSize: 10 }}>{t.shots}</p>
          </div>
        ))}
      </div>

      <label style={labelStyle}>Event name</label>
      <input
        type="text"
        placeholder="e.g. Sarah & Tom's Wedding"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Occasion</label>
      <select
        value={occasion}
        onChange={(e) => setOccasion(e.target.value)}
        style={{ ...inputStyle, cursor: "pointer" }}
      >
        <option value="" style={{ background: "#1a1410" }}>Select occasion</option>
        {OCCASIONS.map(o => (
          <option key={o} value={o} style={{ background: "#1a1410" }}>{o}</option>
        ))}
      </select>

      <label style={labelStyle}>Event date</label>
      <input
        type="date"
        value={eventDate}
        onChange={(e) => handleDateChange(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Gallery reveal time</label>
      <input
        type="datetime-local"
        value={revealAt}
        onChange={(e) => setRevealAt(e.target.value)}
        style={inputStyle}
      />
      <p style={{ color: "#a89070", fontSize: 11, marginTop: -8, marginBottom: 32, letterSpacing: 0.5 }}>
        Default is 10am the morning after your event. You can change this.
      </p>

      <button
        onClick={handleCheckout}
        disabled={!isValid || loading}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: 4,
          border: "none",
          background: isValid ? "#f5efe6" : "#2a2420",
          color: isValid ? "#1a1410" : "#4a3f35",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: 3,
          textTransform: "uppercase",
          cursor: isValid ? "pointer" : "not-allowed"
        }}
      >
        {loading ? "Redirecting to payment..." : `Pay ${TIERS.find(t => t.id === tier)?.price}`}
      </button>

      <p style={{ color: "#4a3f35", fontSize: 11, textAlign: "center", marginTop: 16 }}>
        Secure payment via Stripe
      </p>
    </div>
  )
}