import { useState, useRef } from "react"
import { supabase } from "./lib/supabase"
import imageCompression from "browser-image-compression"

console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

const EVENT_ID = "testEvent"
const PHOTO_LIMIT = 50

function getDeviceId() {
  let id = localStorage.getItem("shoto_device_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("shoto_device_id", id)
  }
  return id
}

export default function App() {
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [shotCount, setShotCount] = useState(
    parseInt(localStorage.getItem(`shoto_count_${EVENT_ID}`) || "0")
  )
  const inputRef = useRef(null)

  const shotsLeft = PHOTO_LIMIT - shotCount

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
      const path = `${EVENT_ID}/${Date.now()}.jpg`

      const { error } = await supabase.storage
        .from("photos")
        .upload(path, compressed)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(path)

      const newCount = shotCount + 1
      localStorage.setItem(`shoto_count_${EVENT_ID}`, newCount)
      setShotCount(newCount)
      setPhotos((prev) => [urlData.publicUrl, ...prev])
    } catch (err) {
      console.error(err)
      alert("Something went wrong, try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>shoto</h1>
      <p style={{ textAlign: "center" }}>{shotsLeft} shots left</p>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
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
          disabled={uploading || shotsLeft <= 0}
          style={{
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "14px 32px",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          {uploading ? "Uploading..." : "Take Photo"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {photos.map((url, i) => (
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
    </div>
  )
}