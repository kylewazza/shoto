import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { QRCodeSVG } from "qrcode.react"

function getEventId() {
  const params = new URLSearchParams(window.location.search)
  return params.get("event")
}

function Countdown({ revealAt }) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    function update() {
      const now = new Date()
      const reveal = new Date(revealAt)
      const diff = reveal - now

      if (diff <= 0) {
        setTimeLeft(null)
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const secs = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`)
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [revealAt])

  return timeLeft
}

export default function Dashboard() {
  const eventId = getEventId()
  const [event, setEvent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (eventId) loadEvent()
    else setLoading(false)
  }, [])

  async function loadEvent() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single()

    if (error || !data) {
      setLoading(false)
      return
    }

    setEvent(data)

    const now = new Date()
    const revealTime = new Date(data.reveal_at)

    if (now >= revealTime) {
      setRevealed(true)
      await loadPhotos()
    }

    setLoading(false)
  }

  async function loadPhotos() {
    const { data, error } = await supabase.storage
      .from("photos")
      .list(eventId, { sortBy: { column: "created_at", order: "desc" } })

    if (error || !data) return

    const urls = data.map((file) => {
      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(`${eventId}/${file.name}`)
      return { url: urlData.publicUrl, name: file.name }
    })

    setPhotos(urls)
  }

  async function downloadAll() {
    setDownloading(true)
    const zip = new JSZip()

    await Promise.all(
      photos.map(async ({ url, name }) => {
        const response = await fetch(url)
        const blob = await response.blob()
        zip.file(name, blob)
      })
    )

    const content = await zip.generateAsync({ type: "blob" })
    saveAs(content, `shoto-${eventId}.zip`)
    setDownloading(false)
  }

  const guestUrl = `https://shoto.co.uk/camera?event=${eventId}`

  if (!eventId) {
    return (
      <div style={centreStyle}>
        <h1 style={logoStyle}>shoto</h1>
        <p style={mutedStyle}>No event found.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={centreStyle}>
        <h1 style={logoStyle}>shoto</h1>
        <p style={mutedStyle}>Loading...</p>
      </div>
    )
  }

  if (!revealed && event) {
    const revealDate = new Date(event.reveal_at).toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    })
    const revealTime = new Date(event.reveal_at).toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit"
    })

    return (
      <div style={centreStyle}>
        <h1 style={logoStyle}>shoto</h1>
        <p style={{ ...mutedStyle, marginBottom: 8, fontSize: 11, letterSpacing: 4, textTransform: "uppercase" }}>{event.name}</p>
        <p style={{ ...mutedStyle, marginBottom: 48 }}>Your photos are developing...</p>

        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(245,239,230,0.08)",
          borderRadius: 8,
          padding: "40px 48px",
          textAlign: "center",
          marginBottom: 48
        }}>
          <p style={{ color: "#c4a882", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Gallery reveals in</p>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 36,
            fontStyle: "italic",
            color: "#f5efe6",
            marginBottom: 16
          }}>
            <Countdown revealAt={event.reveal_at} />
          </p>
          <p style={{ color: "#a89070", fontSize: 12 }}>{revealDate} at {revealTime}</p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <p style={{ color: "#a89070", marginBottom: 12, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Guest QR Code</p>
          <div style={{ background: "#f5efe6", display: "inline-block", padding: 16, borderRadius: 8 }}>
            <QRCodeSVG value={guestUrl} size={160} />
          </div>
        </div>

        <p style={{ color: "#a89070", fontSize: 11 }}>Guests can still scan and take photos until the reveal.</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1410",
      color: "#f5efe6",
      fontFamily: "'Inter', sans-serif",
      padding: 24,
      maxWidth: 960,
      margin: "0 auto"
    }}>
      <h1 style={logoStyle}>shoto</h1>
      {event && <p style={{ ...mutedStyle, marginBottom: 8, fontSize: 11, letterSpacing: 4, textTransform: "uppercase" }}>{event.name}</p>}
      <p style={{ ...mutedStyle, marginBottom: 40 }}>Organiser Dashboard</p>

      <div style={{ marginBottom: 40 }}>
        <p style={{ color: "#a89070", marginBottom: 12, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Guest QR Code</p>
        <div style={{ background: "#f5efe6", display: "inline-block", padding: 16, borderRadius: 8 }}>
          <QRCodeSVG value={guestUrl} size={160} />
        </div>
      </div>

      {loading ? (
        <p style={mutedStyle}>Loading photos...</p>
      ) : photos.length === 0 ? (
        <p style={mutedStyle}>No photos yet.</p>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <p style={{ color: "#a89070", margin: 0 }}>{photos.length} photos</p>
            <button
              onClick={downloadAll}
              disabled={downloading}
              style={{
                background: downloading ? "#333" : "#f5efe6",
                color: "#1a1410",
                border: "none",
                borderRadius: 4,
                padding: "8px 20px",
                cursor: downloading ? "not-allowed" : "pointer",
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase"
              }}
            >
              {downloading ? "Preparing..." : "Download All"}
            </button>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 8
          }}>
            {photos.map(({ url }, i) => (
              <img
                key={i}
                src={url}
                alt=""
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
        </>
      )}
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