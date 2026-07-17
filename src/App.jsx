import { useState, useRef } from "react"
import { supabase } from "./lib/supabase"
import imageCompression from "browser-image-compression"

const PHOTO_LIMIT = 50

function getDeviceId() {
  let id = localStorage.getItem("shoto_device_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("shoto_device_id", id)
  }
  return id
}

function getEventId() {
  const params = new URLSearchParams(window.location.search)
  return params.get("event")
}

function applyFilmFilter(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")

      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i]
        let g = data[i + 1]
        let b = data[i + 2]

        // warm film tone - richer colours
      r = Math.min(255, r * 1.15 + 12)
      g = Math.min(255, g * 1.02 + 3)
      b = Math.min(255, b * 0.78)

      // saturation boost
      const avg = (r + g + b) / 3
      r = Math.min(255, Math.max(0, avg + (r - avg) * 1.4))
      g = Math.min(255, Math.max(0, avg + (g - avg) * 1.3))
      b = Math.min(255, Math.max(0, avg + (b - avg) * 1.2))

      // contrast
      r = Math.min(255, Math.max(0, (r - 128) * 1.12 + 128))
      g = Math.min(255, Math.max(0, (g - 128) * 1.12 + 128))
      b = Math.min(255, Math.max(0, (b - 128) * 1.12 + 128))

      // slight fade (lifted blacks)
      r = Math.min(255, r * 0.92 + 18)
      g = Math.min(255, g * 0.92 + 12)
      b = Math.min(255, b * 0.92 + 8)

      // grain
      const grain = (Math.random() - 0.5) * 22
      data[i] = Math.min(255, Math.max(0, r + grain))
      data[i + 1] = Math.min(255, Math.max(0, g + grain))
      data[i + 2] = Math.min(255, Math.max(0, b + grain))
      }

      ctx.putImageData(imageData, 0, 0)

      // vignette
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.25,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.9
      )
      vignette.addColorStop(0, "rgba(0,0,0,0)")
      vignette.addColorStop(1, "rgba(0,0,0,0.65)")
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // light leak 1 — orange/red top left
      const leak1 = ctx.createRadialGradient(
        canvas.width * 0.05, canvas.height * 0.05, 0,
        canvas.width * 0.05, canvas.height * 0.05, canvas.width * 0.65
      )
      leak1.addColorStop(0, "rgba(255, 100, 10, 0.45)")
      leak1.addColorStop(0.4, "rgba(255, 60, 0, 0.2)")
      leak1.addColorStop(1, "rgba(255, 0, 0, 0)")
      ctx.fillStyle = leak1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // light leak 2 — yellow/orange bottom right
      const leak2 = ctx.createRadialGradient(
        canvas.width * 0.95, canvas.height * 0.92, 0,
        canvas.width * 0.95, canvas.height * 0.92, canvas.width * 0.6
      )
      leak2.addColorStop(0, "rgba(255, 180, 0, 0.4)")
      leak2.addColorStop(0.4, "rgba(255, 120, 0, 0.18)")
      leak2.addColorStop(1, "rgba(255, 80, 0, 0)")
      ctx.fillStyle = leak2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // horizontal streak — stronger orange along top edge
      const streak = ctx.createLinearGradient(0, 0, canvas.width, 0)
      streak.addColorStop(0, "rgba(255, 100, 40, 0.35)")
      streak.addColorStop(0.25, "rgba(255, 140, 60, 0.15)")
      streak.addColorStop(0.6, "rgba(255, 80, 40, 0.08)")
      streak.addColorStop(1, "rgba(255, 80, 20, 0.3)")
      ctx.fillStyle = streak
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.22)

      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.88)
    }
    img.src = url
  })
}

export default function App() {
  const eventId = getEventId()
  const [uploading, setUploading] = useState(false)
  const [shotCount, setShotCount] = useState(
    parseInt(localStorage.getItem(`shoto_count_${eventId}`) || "0")
  )
  const inputRef = useRef(null)

  const shotsLeft = PHOTO_LIMIT - shotCount

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
        <p style={{ color: "#aaa" }}>No event found. Please scan the QR code.</p>
      </div>
    )
  }

  async function handleCapture(e) {
    const file = e.target.files[0]
    if (!file) return
    if (shotCount >= PHOTO_LIMIT) {
      alert("You've used all your shots!")
      return
    }

    setUploading(true)

    try {
      const filtered = await applyFilmFilter(file)

      const compressed = await imageCompression(filtered, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1920,
      })

      const deviceId = getDeviceId()
      const path = `${eventId}/${deviceId}_${Date.now()}.jpg`

      const { error } = await supabase.storage
        .from("photos")
        .upload(path, compressed)

      if (error) throw error

      const newCount = shotCount + 1
      localStorage.setItem(`shoto_count_${eventId}`, newCount)
      setShotCount(newCount)
    } catch (err) {
      console.error(err)
      alert("Something went wrong, try again.")
    } finally {
      setUploading(false)
    }
  }

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
      <h1 style={{ fontSize: 32, marginBottom: 8, letterSpacing: 2 }}>shoto</h1>

      {shotsLeft > 0 ? (
        <>
          <p style={{ color: "#aaa", marginBottom: 40 }}>
            {shotsLeft} shot{shotsLeft !== 1 ? "s" : ""} remaining
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={handleCapture}
          />
          <button
            onClick={() => inputRef.current.click()}
            disabled={uploading}
            style={{
              background: uploading ? "#333" : "#fff",
              color: "#111",
              border: "none",
              borderRadius: 50,
              width: 80,
              height: 80,
              fontSize: 32,
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "..." : "📷"}
          </button>
          {uploading && (
            <p style={{ color: "#aaa", marginTop: 20 }}>Developing...</p>
          )}
        </>
      ) : (
        <p style={{ color: "#aaa", textAlign: "center" }}>
          You've used all your shots. Photos will be revealed after the event.
        </p>
      )}
    </div>
  )
}