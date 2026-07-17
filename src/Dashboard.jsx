import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase"

const EVENT_ID = "testEvent"

export default function Dashboard() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPhotos()
  }, [])

  async function loadPhotos() {
    const { data, error } = await supabase.storage
      .from("photos")
      .list(EVENT_ID, { sortBy: { column: "created_at", order: "desc" } })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const urls = data.map((file) => {
      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(`${EVENT_ID}/${file.name}`)
      return urlData.publicUrl
    })

    setPhotos(urls)
    setLoading(false)
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

      {loading ? (
        <p style={{ color: "#aaa" }}>Loading photos...</p>
      ) : photos.length === 0 ? (
        <p style={{ color: "#aaa" }}>No photos yet.</p>
      ) : (
        <>
          <p style={{ color: "#aaa", marginBottom: 20 }}>{photos.length} photos taken</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 8
          }}>
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
        </>
      )}
    </div>
  )
}