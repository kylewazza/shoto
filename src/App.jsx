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
      const compressed = await imageCompression(file, {
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