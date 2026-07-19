import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase"
import { QRCodeSVG } from "qrcode.react"

export default function Success() {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get("session_id")
    if (sessionId) loadEvent(sessionId)
    else setLoading(false)
  }, [])

  async function loadEvent(sessionId) {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single()

    if (data) setEvent(data)
    setLoading(false)
  }

  const guestUrl = event ? `https://shoto.co.uk/camera?event=${event.id}` : ""
  const dashboardUrl = event ? `https://shoto.co.uk/dashboard?event=${event.id}` : ""

  const centreStyle = {
    minHeight: "100vh",
    background: "#1a1410",
    color: "#f5efe6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    padding: 24,
    textAlign: "center"
  }

  if (loading) {
    return (
      <div style={centreStyle}>
        <h1 style={{ letterSpacing: 4, fontSize: 18, fontWeight: 300, marginBottom: 32 }}>shoto</h1>
        <p style={{ color: "#a89070" }}>Setting up your event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div style={centreStyle}>
        <h1 style={{ letterSpacing: 4, fontSize: 18, fontWeight: 300, marginBottom: 32 }}>shoto</h1>
        <p style={{ color: "#a89070", marginBottom: 16 }}>Your payment was successful.</p>
        <p style={{ color: "#a89070", fontSize: 13 }}>Check your email for your event details.</p>
      </div>
    )
  }

  return (
    <div style={{ ...centreStyle, justifyContent: "flex-start", paddingTop: 48 }}>
      <h1 style={{ letterSpacing: 4, fontSize: 18, fontWeight: 300, marginBottom: 32 }}>shoto</h1>

      <p style={{ color: "#c4a882", letterSpacing: 4, fontSize: 10, textTransform: "uppercase", marginBottom: 16, fontWeight: 300 }}>Payment successful</p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, fontSize: 28, marginBottom: 8 }}>{event.name}</h2>
      <p style={{ color: "#a89070", fontSize: 13, marginBottom: 48 }}>
        Gallery reveals on {new Date(event.reveal_at).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} at {new Date(event.reveal_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
      </p>

      <div style={{ marginBottom: 40 }}>
        <p style={{ color: "#a89070", marginBottom: 12, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Guest QR Code</p>
        <p style={{ color: "#a89070", fontSize: 12, marginBottom: 16 }}>Print or display this at your event</p>
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
        border: "1px solid rgba(245,239,230,0.08)",
        width: "100%",
        maxWidth: 480
      }}>
        <p style={{ color: "#a89070", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 6px" }}>Guest link</p>
        <p style={{ fontSize: 13, wordBreak: "break-all", margin: "0 0 20px", color: "#f5efe6" }}>{guestUrl}</p>
        <p style={{ color: "#a89070", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 6px" }}>Your dashboard — keep this private</p>
        <p style={{ fontSize: 13, wordBreak: "break-all", margin: 0, color: "#f5efe6" }}>{dashboardUrl}</p>
      </div>

      <p style={{ color: "#a89070", fontSize: 11, letterSpacing: 1, maxWidth: 400 }}>
        These details have also been sent to your email. Save your dashboard link — you will need it to view photos after the reveal.
      </p>
    </div>
  )
}