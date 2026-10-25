import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase"
import JSZip from "jszip"
import { saveAs } from "file-saver"

function getEventId() {
  const params = new URLSearchParams(window.location.search)
  return params.get("event")
}

const LIST_PAGE_SIZE = 1000
const ZIP_PART_SIZE = 300

// Storage .list() returns 100 files by default, so page through the folder
// until every file is in. Oldest first keeps the pages stable while guests
// are still uploading. Hidden files such as .emptyFolderPlaceholder are skipped.
async function listAllFiles(bucket, folder) {
  const files = []
  const seen = new Set()
  for (let offset = 0; ; offset += LIST_PAGE_SIZE) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, { limit: LIST_PAGE_SIZE, offset, sortBy: { column: "created_at", order: "asc" } })
    if (error) throw error
    for (const file of data) {
      if (file.name.startsWith(".") || seen.has(file.name)) continue
      seen.add(file.name)
      files.push(file)
    }
    if (data.length < LIST_PAGE_SIZE) break
  }
  return files.reverse()
}

function splitIntoParts(items) {
  const parts = []
  for (let i = 0; i < items.length; i += ZIP_PART_SIZE) parts.push(items.slice(i, i + ZIP_PART_SIZE))
  return parts
}

// Builds one ZIP for one part, fetching a few files at a time to keep memory
// and network use steady. Returns how many files could not be fetched.
async function downloadZip(files, filename) {
  const zip = new JSZip()
  let failed = 0
  for (let i = 0; i < files.length; i += 8) {
    await Promise.all(files.slice(i, i + 8).map(async ({ url, name }) => {
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(response.status)
        zip.file(name, await response.blob())
      } catch {
        failed++
      }
    }))
  }
  const content = await zip.generateAsync({ type: "blob" })
  saveAs(content, filename)
  return failed
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
  const [cleanFiles, setCleanFiles] = useState([])
  const [sessions, setSessions] = useState({})
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)
  const [downloaded, setDownloaded] = useState({})
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

        if (now >= revealTime || data.dashboard_always_open) {
      setRevealed(true)
      await loadPhotos()
      await loadSessions()
    }

    setLoading(false)
  }

  async function loadSessions() {
    const { data } = await supabase
      .from("guest_sessions")
      .select("device_id, username")
      .eq("event_id", eventId)

    if (data) {
      const map = {}
      data.forEach(s => { if (s.username) map[s.device_id] = s.username })
      setSessions(map)
    }
  }

  async function loadPhotos() {
    let files, clean
    try {
      [files, clean] = await Promise.all([
        listAllFiles("photos", eventId),
        listAllFiles("photos-clean", eventId)
      ])
    } catch (err) {
      console.error(err)
      return
    }

    const urls = files.map((file) => {
      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(`${eventId}/${file.name}`)
      const deviceId = file.name.split("_")[0]
      const isVideo = file.name.endsWith(".mp4") || file.name.endsWith(".mov") || file.name.endsWith(".webm")
      return { url: urlData.publicUrl, name: file.name, deviceId, isVideo }
    })

    setPhotos(urls)
    setCleanFiles(clean.map((file) => ({
      name: file.name,
      url: supabase.storage.from("photos-clean").getPublicUrl(`${eventId}/${file.name}`).data.publicUrl
    })))
  }

  async function downloadPart(kind, files, index, total) {
    const key = `${kind}-${index}`
    setDownloading(key)
    const prefix = kind === "clean" ? `shoto-clean-${eventId}` : `shoto-${eventId}`
    const filename = total > 1 ? `${prefix}-part-${index + 1}-of-${total}.zip` : `${prefix}.zip`
    try {
      const failed = await downloadZip(files, filename)
      setDownloaded(prev => ({ ...prev, [key]: true }))
      if (failed > 0) alert(`${failed} file${failed === 1 ? "" : "s"} couldn't be downloaded. Please try this download again.`)
    } catch (err) {
      console.error(err)
      alert("Something went wrong preparing your download. Please try again.")
    }
    setDownloading(null)
  }

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
      maxWidth: 1400,
      margin: "0 auto"
    }}>
      <h1 style={logoStyle}>shoto</h1>
      {event && <p style={{ ...mutedStyle, marginBottom: 32, fontSize: 11, letterSpacing: 4, textTransform: "uppercase" }}>{event.name}</p>}

      {loading ? (
        <p style={mutedStyle}>Loading photos...</p>
      ) : photos.length === 0 ? (
        <p style={mutedStyle}>No photos yet.</p>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <p style={{ color: "#a89070", margin: 0 }}>{photos.length} photos</p>
            {photos.length > ZIP_PART_SIZE && (
              <p style={{ color: "#a89070", margin: 0, fontSize: 12, flexBasis: "100%" }}>
                Large galleries download in parts of {ZIP_PART_SIZE}. Download each part to get everything.
              </p>
            )}
            {[
              { kind: "filtered", label: "Download Filtered", files: photos, primary: true },
              { kind: "clean", label: "Download Originals", files: cleanFiles, primary: false }
            ].map(({ kind, label, files, primary }) => {
              const parts = splitIntoParts(files)
              if (parts.length === 0) return null
              return parts.map((part, index) => {
                const key = `${kind}-${index}`
                const busy = downloading === key
                const text = busy
                  ? "Preparing..."
                  : parts.length > 1
                    ? `${label} ${index + 1} of ${parts.length}${downloaded[key] ? " ✓" : ""}`
                    : label
                return (
                  <button
                    key={key}
                    onClick={() => downloadPart(kind, part, index, parts.length)}
                    disabled={downloading !== null}
                    style={{
                      background: primary ? (busy ? "#333" : "#f5efe6") : "transparent",
                      color: primary ? "#1a1410" : "#f5efe6",
                      border: primary ? "none" : "1px solid rgba(245,239,230,0.2)",
                      borderRadius: 4,
                      padding: "8px 20px",
                      cursor: downloading !== null ? "not-allowed" : "pointer",
                      fontWeight: primary ? 500 : 300,
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase"
                    }}
                  >
                    {text}
                  </button>
                )
              })
            })}
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 8
          }}>
            {photos.map(({ url, name, deviceId, isVideo }) => (
              <div key={name} style={{ position: "relative" }}>
                {isVideo ? (
                  <video
                    src={url}
                    controls
                    playsInline
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      borderRadius: 4,
                      display: "block"
                    }}
                  />
                ) : (
                  <img
                    src={url}
                    alt=""
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      borderRadius: 4,
                      display: "block"
                    }}
                  />
                )}
                {sessions[deviceId] && (
                  <p style={{
                    position: "absolute",
                    bottom: 6,
                    left: 6,
                    background: "rgba(0,0,0,0.6)",
                    color: "#f5efe6",
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 3,
                    margin: 0
                  }}>{sessions[deviceId]}</p>
                )}
              </div>
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