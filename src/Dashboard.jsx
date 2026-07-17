import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { QRCodeSVG } from "qrcode.react"

function getEventId() {
  const params = new URLSearchParams(window.location.search)
  return params.get("event")
}

export default function Dashboard() {
  const eventId = getEventId()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (eventId) loadPhotos()
    else setLoading(false)
  }, [])

  async function loadPhotos() {
    const { data, error } = await supabase.storage
      .from("photos")
      .list(eventId, { sortBy: { column: "created_at", order: "desc" } })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const urls = data.map((file) => {
      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(`${eventId}/${file.name}`)
      return { url: urlData.publicUrl, name: file.name }
    })

    setPhotos(urls)
    setLoading(false)
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

  if (!eventId) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#111",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif"
      }}>
        <h1 style={{ letterSpacing: 2 }}>shoto</h1>
        <p style={{ color: "#aaa" }}>No event found.</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111",
      color: "#fff",
      fontFamily: "sans-serif",
      padding: 20,
      maxWidth: 900,
      margin: "0 auto"
    }}>
      <h1 style={{ letterSpacing: 2, marginBottom: 4 }}>shoto</h1>
      <p style={{ color: "#aaa", marginBottom: 32 }}>Organiser Dashboard</p>

      <div style={{ marginBottom: 40 }}>
        <p style={{ color: "#aaa", marginBottom: 12 }}>Guest QR Code — print or share this</p>
        <div style={{ background: "#fff", display: "inline-block", padding: 16, borderRadius: 8 }}>
          <QRCodeSVG value={`https://shoto.co.uk/camera?event=${eventId}`} size={180} />
        </div>
        <p style={{ color: "#555", fontSize: 12, marginTop: 8 }}>shoto.co.uk/?event={eventId}</p>
      </div>

      {loading ? (
        <p style={{ color: "#aaa" }}>Loading photos...</p>
      ) : photos.length === 0 ? (
        <p style={{ color: "#aaa" }}>No photos yet.</p>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <p style={{ color: "#aaa", margin: 0 }}>{photos.length} photos taken</p>
            <button
              onClick={downloadAll}
              disabled={downloading}
              style={{
                background: downloading ? "#333" : "#fff",
                color: "#111",
                border: "none",
                borderRadius: 6,
                padding: "8px 20px",
                cursor: downloading ? "not-allowed" : "pointer",
                fontWeight: "bold"
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
                  filter: "sepia(0.4) contrast(1.1) brightness(0.95) saturate(0.85)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}