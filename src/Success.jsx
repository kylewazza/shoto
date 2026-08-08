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

  if (loading) {
    return (
      <div style={centreStyle}>
        <h1 style={logoStyle}>shoto</h1>
        <p style={mutedStyle}>Setting up your event...</p>
      </div>
    )
  }

  if (!event) {
    return (
      <div style={centreStyle}>
        <h1 style={logoStyle}>shoto</h1>
        <p style={{ ...mutedStyle, marginBottom: 8 }}>Your payment was successful.</p>
        <p style={mutedStyle}>Check your email for your event details.</p>
      </div>
    )
  }

  return (
    <div style={{ ...centreStyle, justifyContent: "flex-start", paddingTop: 64 }}>
      <h1 style={logoStyle}>shoto</h1>

      <p style={{ color: "#c4a882", letterSpacing: 4, fontSize: 10, textTransform: "uppercase", marginBottom: 16, fontWeight: 300 }}>You're all set</p>
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: 28,
        marginBottom: 40,
        textAlign: "center"
      }}>{event.name}</h2>

      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(245,239,230,0.08)",
        borderRadius: 8,
        padding: "32px 40px",
        textAlign: "center",
        marginBottom: 40,
        maxWidth: 420,
        width: "100%"
      }}>
        <p style={{ color: "#c4a882", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16, fontWeight: 300 }}>Check your email</p>
        <p style={{ color: "#a89070", fontSize: 14, lineHeight: 1.8, marginBottom: 0, fontWeight: 300 }}>
          Your QR code has been sent to your email as an attachment. Print it and display it at your event so guests can scan it on the day.
        </p>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(245,239,230,0.08)",
        borderRadius: 8,
        padding: "32px 40px",
        textAlign: "center",
        marginBottom: 40,
        maxWidth: 420,
        width: "100%"
      }}>
        <p style={{ color: "#c4a882", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16, fontWeight: 300 }}>Your gallery reveal</p>
        <p style={{ color: "#a89070", fontSize: 14, lineHeight: 1.8, fontWeight: 300 }}>
          After your event, you'll receive a second email with your private gallery link. Your photos will be waiting.
        </p>
      </div>

      <p style={{ color: "#a89070", fontSize: 13, fontStyle: "italic", marginTop: 8 }}>Enjoy every moment, Shoto</p>
    </div>
  )
}

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

const logoStyle = {
  letterSpacing: 4,
  fontSize: 18,
  fontWeight: 300,
  marginBottom: 32
}

const mutedStyle = {
  color: "#a89070",
  fontSize: 14,
  fontWeight: 300
}