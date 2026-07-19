import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { supabase } from "./lib/supabase"

function generateEventId() {
  return crypto.randomUUID()
}

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

function getDefaultReveal(occasion, eventDate) {
  const date = new Date(eventDate)
  date.setDate(date.getDate() + 1)
  date.setHours(10, 0, 0, 0)
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export default function Create() {
  const [step, setStep] = useState(1)
  const [eventName, setEventName] = useState("")
  const [occasion, setOccasion] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [revealAt, setRevealAt] = useState("")
  const [eventId, setEventId] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleDateChange(date) {
    setEventDate(date)
    if (occasion) setRevealAt(getDefaultReveal(occasion, date))
  }

  function handleOccasionChange(occ) {
    setOccasion(occ)
    if (eventDate) setRevealAt(getDefaultReveal(occ, eventDate))
  }

  async function createEvent() {
    if (!eventName.trim() || !occasion || !eventDate || !revealAt) return
    setLoading(true)

    const id = generateEventId()

    const { error } = await supabase.from("events").insert({
      id,
      name: eventName.trim(),
      occasion,
      reveal_at: new Date(revealAt).toISOString()
    })

    if (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    setEventId(id)
    setLoading(false)
  }

  const guestUrl = `https://shoto.co.uk/camera?event=${eventId}`
  const dashboardUrl = `https://shoto.co.uk/dashboard?event=${eventId}`

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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: 24
    }}>
      <h1 style={{ letterSpacing: 4, fontSize: 18, fontWeight: 300, marginBottom: 48 }}>shoto</h1>

      {!eventId ? (
        <div style={{ width: "100%", maxWidth: 420 }}>
          <p style={{ color: "#c4a882", letterSpacing: 4, fontSize: 10, textTransform: "uppercase", marginBottom: 32, fontWeight: 300 }}>Create your event</p>

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
            onChange={(e) => handleOccasionChange(e.target.value)}
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
          <p style={{ color: "#a89070", fontSize: 11, marginTop: -8, marginBottom: 24, letterSpacing: 0.5 }}>
            Default is 10am the morning after your event. You can change this.
          </p>

          <button
            onClick={createEvent}
            disabled={!eventName.trim() || !occasion || !eventDate || !revealAt || loading}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 4,
              border: "none",
              background: eventName.trim() && occasion && eventDate && revealAt ? "#f5efe6" : "#2a2420",
              color: eventName.trim() && occasion && eventDate && revealAt ? "#1a1410" : "#4a3f35",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: 3,
              textTransform: "uppercase",
              cursor: eventName.trim() && occasion && eventDate && revealAt ? "pointer" : "not-allowed"
            }}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: 500, textAlign: "center" }}>
          <p style={{ color: "#c4a882", letterSpacing: 4, fontSize: 10, textTransform: "uppercase", marginBottom: 16, fontWeight: 300 }}>Event created</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, fontSize: 28, marginBottom: 8 }}>{eventName}</h2>
          <p style={{ color: "#a89070", fontSize: 13, marginBottom: 40 }}>Gallery reveals on {new Date(revealAt).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} at {new Date(revealAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>

          <div style={{ marginBottom: 40 }}>
            <p style={{ color: "#a89070", marginBottom: 12, fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>Guest QR Code</p>
            <div style={{ background: "#f5efe6", display: "inline-block", padding: 20, borderRadius: 8 }}>
              <QRCodeSVG value={guestUrl} size={200} />
            </div>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.02)",
            borderRadius: 8,
            padding: 24,
            textAlign: "left",
            marginBottom: 24,
            border: "1px solid rgba(245,239,230,0.08)"
          }}>
            <p style={{ color: "#a89070", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 6px" }}>Guest link</p>
            <p style={{ fontSize: 13, wordBreak: "break-all", margin: "0 0 20px", color: "#f5efe6" }}>{guestUrl}</p>
            <p style={{ color: "#a89070", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 6px" }}>Your dashboard — keep this private</p>
            <p style={{ fontSize: 13, wordBreak: "break-all", margin: 0, color: "#f5efe6" }}>{dashboardUrl}</p>
          </div>

          <p style={{ color: "#a89070", fontSize: 11, letterSpacing: 1 }}>
            Save your dashboard link — you'll need it to view photos after the reveal.
          </p>
        </div>
      )}
    </div>
  )
}