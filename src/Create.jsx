import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"

function generateEventId() {
  return Math.random().toString(36).substring(2, 10)
}

export default function Create() {
  const [eventName, setEventName] = useState("")
  const [eventId, setEventId] = useState(null)

  function createEvent() {
    if (!eventName.trim()) return
    const id = generateEventId()
    setEventId(id)
  }

  const guestUrl = `https://shoto.co.uk/camera?event=${eventId}`
  const dashboardUrl = `https://shoto.co.uk/dashboard?event=${eventId}`

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
      padding: 20
    }}>
      <h1 style={{ letterSpacing: 2, marginBottom: 8 }}>shoto</h1>
      <p style={{ color: "#aaa", marginBottom: 40 }}>Create a new event</p>

      {!eventId ? (
        <div style={{ width: "100%", maxWidth: 400 }}>
          <input
            type="text"
            placeholder="Event name (e.g. Sarah & Tom's Wedding)"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #333",
              background: "#222",
              color: "#fff",
              fontSize: 16,
              marginBottom: 16,
              boxSizing: "border-box"
            }}
          />
          <button
            onClick={createEvent}
            disabled={!eventName.trim()}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 8,
              border: "none",
              background: eventName.trim() ? "#fff" : "#333",
              color: "#111",
              fontSize: 16,
              fontWeight: "bold",
              cursor: eventName.trim() ? "pointer" : "not-allowed"
            }}
          >
            Create Event
          </button>
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: 500, textAlign: "center" }}>
          <p style={{ color: "#aaa", marginBottom: 8 }}>Event created for</p>
          <h2 style={{ marginBottom: 32 }}>{eventName}</h2>

          <div style={{ marginBottom: 40 }}>
            <p style={{ color: "#aaa", marginBottom: 12 }}>Guest QR Code — print or display this</p>
            <div style={{ background: "#fff", display: "inline-block", padding: 16, borderRadius: 8 }}>
              <QRCodeSVG value={guestUrl} size={200} />
            </div>
          </div>

          <div style={{
            background: "#222",
            borderRadius: 8,
            padding: 20,
            textAlign: "left",
            marginBottom: 24
          }}>
            <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 4px" }}>Guest link</p>
            <p style={{ fontSize: 14, wordBreak: "break-all", margin: "0 0 16px" }}>{guestUrl}</p>
            <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 4px" }}>Your dashboard (keep this private)</p>
            <p style={{ fontSize: 14, wordBreak: "break-all", margin: 0 }}>{dashboardUrl}</p>
          </div>

          <p style={{ color: "#555", fontSize: 12 }}>
            Save your dashboard link — you'll need it to view photos after the event.
          </p>
        </div>
      )}
    </div>
  )
}