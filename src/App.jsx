import { useState, useRef, useEffect } from "react"
import { supabase } from "./lib/supabase"
import imageCompression from "browser-image-compression"

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

        r = Math.min(255, r * 0.95)
        g = Math.min(255, g * 0.96)
        b = Math.min(255, b * 1.08)

        r = Math.min(255, r * 0.88 + 18)
        g = Math.min(255, g * 0.88 + 16)
        b = Math.min(255, b * 0.88 + 22)

        r = Math.min(255, Math.max(0, (r - 128) * 1.08 + 128))
        g = Math.min(255, Math.max(0, (g - 128) * 1.08 + 128))
        b = Math.min(255, Math.max(0, (b - 128) * 1.08 + 128))

        const grain = (Math.random() - 0.5) * 18
        data[i] = Math.min(255, Math.max(0, r + grain))
        data[i + 1] = Math.min(255, Math.max(0, g + grain))
        data[i + 2] = Math.min(255, Math.max(0, b + grain))
      }

      ctx.putImageData(imageData, 0, 0)

      const aberrationData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const aberration = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const shift = Math.floor(canvas.width * 0.003)
      for (let y = 0; y < canvas.height; y++) {
        for (let x = shift; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4
          const iShift = (y * canvas.width + (x - shift)) * 4
          aberration.data[i] = aberrationData.data[iShift]
        }
      }
      ctx.putImageData(aberration, 0, 0)

      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.2,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.85
      )
      vignette.addColorStop(0, "rgba(0,0,0,0)")
      vignette.addColorStop(1, "rgba(0,0,0,0.55)")
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const leak1 = ctx.createRadialGradient(
        canvas.width * 0.0, canvas.height * 1.0, 0,
        canvas.width * 0.0, canvas.height * 1.0, canvas.width * 0.45
      )
      leak1.addColorStop(0, "rgba(255, 100, 20, 0.35)")
      leak1.addColorStop(0.5, "rgba(255, 60, 0, 0.12)")
      leak1.addColorStop(1, "rgba(255, 0, 0, 0)")
      ctx.fillStyle = leak1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const leak2 = ctx.createRadialGradient(
        canvas.width * 1.0, canvas.height * 0.0, 0,
        canvas.width * 1.0, canvas.height * 0.0, canvas.width * 0.35
      )
      leak2.addColorStop(0, "rgba(255, 140, 40, 0.2)")
      leak2.addColorStop(0.5, "rgba(255, 80, 0, 0.07)")
      leak2.addColorStop(1, "rgba(255, 0, 0, 0)")
      ctx.fillStyle = leak2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const now = new Date()
      const day = String(now.getDate()).padStart(2, "0")
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const year = String(now.getFullYear()).slice(2)
      const dateStr = `${day} ${month} ${year}`
      const fontSize = Math.floor(canvas.width * 0.038)
      ctx.font = `${fontSize}px 'Courier New', monospace`
      ctx.fillStyle = "rgba(255, 140, 0, 0.85)"
      ctx.textAlign = "right"
      ctx.fillText(dateStr, canvas.width - fontSize, canvas.height - fontSize)

      URL.revokeObjectURL(url)
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.88)
    }
    img.src = url
  })
}

export default function App() {
  const eventId = getEventId()
  const deviceId = getDeviceId()
  const [uploading, setUploading] = useState(false)
  const [started, setStarted] = useState(false)
  const [username, setUsername] = useState("")
  const [consented, setConsented] = useState(false)
  const [shotCount, setShotCount] = useState(
    parseInt(localStorage.getItem(`shoto_count_${eventId}`) || "0")
  )
  const [photoLimit, setPhotoLimit] = useState(50)
  const [eventName, setEventName] = useState("")
  const [requireUsername, setRequireUsername] = useState(false)
  const [requireConsent, setRequireConsent] = useState(false)
  const [allowGallery, setAllowGallery] = useState(false)
  const [guestLimitReached, setGuestLimitReached] = useState(false)
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const inputRef = useRef(null)
  const galleryRef = useRef(null)

  useEffect(() => {
    if (eventId) loadSession()
  }, [])

  async function loadSession() {
    try {
      const { data: eventData } = await supabase
        .from("events")
        .select("photo_limit, guest_limit, name, require_username, require_consent, allow_gallery_upload")
        .eq("id", eventId)
        .single()

      if (eventData?.photo_limit) setPhotoLimit(eventData.photo_limit)
      if (eventData?.name) setEventName(eventData.name)
      if (eventData?.require_username) setRequireUsername(eventData.require_username)
      if (eventData?.require_consent) setRequireConsent(eventData.require_consent)
      if (eventData?.allow_gallery_upload) setAllowGallery(eventData.allow_gallery_upload)

      const { data: existingSession } = await supabase
        .from("guest_sessions")
        .select("shot_count")
        .eq("event_id", eventId)
        .eq("device_id", deviceId)
        .single()

      if (existingSession) {
        const remoteCount = existingSession.shot_count
        const localCount = parseInt(localStorage.getItem(`shoto_count_${eventId}`) || "0")
        const count = Math.max(remoteCount, localCount)
        setShotCount(count)
        localStorage.setItem(`shoto_count_${eventId}`, count)
      } else {
        if (eventData?.guest_limit) {
          const { count } = await supabase
            .from("guest_sessions")
            .select("*", { count: "exact", head: true })
            .eq("event_id", eventId)

          if (count >= eventData.guest_limit) {
            setGuestLimitReached(true)
          }
        }
      }
    } catch (e) {
      // start fresh
    }
    setSessionLoaded(true)
  }

  async function updateSession(newCount) {
    await supabase
      .from("guest_sessions")
      .upsert({
        event_id: eventId,
        device_id: deviceId,
        shot_count: newCount,
        username: username || null,
        updated_at: new Date().toISOString()
      }, { onConflict: "event_id,device_id" })
  }

  async function handleCapture(e) {
    const file = e.target.files[0]
    if (!file) return
    await uploadFile(file)
  }

  async function uploadFile(file) {
    if (shotCount >= photoLimit) {
      alert("You've used all your shots!")
      return
    }

    setUploading(true)

    try {
      let fileToUpload = file

      if (file.type.startsWith("image/")) {
        const filtered = await applyFilmFilter(file)
        fileToUpload = await imageCompression(filtered, {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1920,
        })
      }

      const ext = file.type.startsWith("video/") ? "mp4" : "jpg"
      const path = `${eventId}/${deviceId}_${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from("photos")
        .upload(path, fileToUpload)

      if (error) throw error

      const newCount = shotCount + 1
      localStorage.setItem(`shoto_count_${eventId}`, newCount)
      setShotCount(newCount)
      await updateSession(newCount)
    } catch (err) {
      console.error(err)
      alert("Something went wrong, try again.")
    } finally {
      setUploading(false)
    }
  }

  const shotsLeft = photoLimit - shotCount

  const canStart = username.trim().length > 0 && (requireConsent ? consented : true)

  if (!eventId) {
    return (
      <div style={centreStyle}>
        <h1 style={logoStyle}>shoto</h1>
        <p style={mutedStyle}>No event found. Please scan the QR code.</p>
      </div>
    )
  }

  if (guestLimitReached) {
    return (
      <div style={centreStyle}>
        <h1 style={logoStyle}>shoto</h1>
        <p style={{ color: "#c4a882", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 32, fontWeight: 300 }}>Event full</p>
        <p style={{ ...mutedStyle, textAlign: "center", maxWidth: 280, lineHeight: 1.8 }}>
          This event has reached its guest limit. No more cameras are available.
        </p>
      </div>
    )
  }

  if (!sessionLoaded) {
    return (
      <div style={centreStyle}>
        <h1 style={logoStyle}>shoto</h1>
      </div>
    )
  }

  if (!started) {
    return (
      <div style={centreStyle}>
        <h1 style={logoStyle}>shoto</h1>
        <p style={{ color: "#c4a882", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 24, fontWeight: 300 }}>Your disposable camera</p>

        {eventName && (
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 20, color: "#f5efe6", marginBottom: 24, textAlign: "center" }}>
            Welcome to {eventName}
          </p>
        )}

        <p style={{ ...mutedStyle, marginBottom: 24, maxWidth: 280, textAlign: "center", lineHeight: 1.8 }}>
          You have <strong style={{ color: "#f5efe6" }}>{shotsLeft} shots</strong> remaining.
        </p>

        <p style={{ ...mutedStyle, marginBottom: 32, maxWidth: 280, textAlign: "center", lineHeight: 1.8 }}>
          Photos won't be visible until after the event. Just like a real disposable camera.
        </p>

        {requireUsername && (
          <div style={{ width: "100%", maxWidth: 280, marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Your name or Instagram @"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 6,
                border: "1px solid rgba(245,239,230,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "#f5efe6",
                fontSize: 14,
                boxSizing: "border-box",
                fontFamily: "sans-serif"
              }}
            />
          </div>
        )}

        {requireConsent && (
          <div style={{ width: "100%", maxWidth: 280, marginBottom: 24, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <input
              type="checkbox"
              id="consent"
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
              style={{ marginTop: 3, cursor: "pointer", flexShrink: 0 }}
            />
            <label htmlFor="consent" style={{ color: "#a89070", fontSize: 12, lineHeight: 1.6, cursor: "pointer" }}>
              I agree to my photos and videos being shared and used for promotional purposes on social media.
            </label>
          </div>
        )}

        <button
          onClick={() => { if (canStart || (!requireUsername && !requireConsent)) setStarted(true) }}
          disabled={requireUsername && !canStart}
          style={{
            background: (requireUsername && !canStart) ? "#2a2420" : "#f5efe6",
            color: (requireUsername && !canStart) ? "#4a3f35" : "#1a1410",
            border: "none",
            borderRadius: 4,
            padding: "16px 48px",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            cursor: (requireUsername && !canStart) ? "not-allowed" : "pointer"
          }}
        >
          Start shooting
        </button>
      </div>
    )
  }

  return (
    <div style={centreStyle}>
      <h1 style={logoStyle}>shoto</h1>

      {shotsLeft > 0 ? (
        <>
          <p style={{ ...mutedStyle, marginBottom: 40 }}>
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

          {allowGallery && (
            <input
              ref={galleryRef}
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={handleCapture}
            />
          )}

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
              marginBottom: allowGallery ? 16 : 0
            }}
          >
            {uploading ? "..." : "📷"}
          </button>

          {allowGallery && (
            <button
              onClick={() => galleryRef.current.click()}
              disabled={uploading}
              style={{
                background: "transparent",
                color: "#f5efe6",
                border: "1px solid rgba(245,239,230,0.2)",
                borderRadius: 4,
                padding: "10px 24px",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                cursor: uploading ? "not-allowed" : "pointer",
                fontFamily: "sans-serif"
              }}
            >
              Upload from gallery
            </button>
          )}

          {uploading && (
            <p style={{ ...mutedStyle, marginTop: 20 }}>Developing...</p>
          )}
        </>
      ) : (
        <p style={{ ...mutedStyle, textAlign: "center", maxWidth: 300 }}>
          You've used all your shots. Photos will be revealed when the event ends.
        </p>
      )}
    </div>
  )
}

const centreStyle = {
  minHeight: "100vh",
  background: "#111",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "sans-serif",
  padding: 20
}

const logoStyle = {
  fontSize: 32,
  marginBottom: 8,
  letterSpacing: 2,
  fontWeight: 300
}

const mutedStyle = {
  color: "#aaa",
  fontSize: 14
}