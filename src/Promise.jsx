import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function PromiseFayres() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    const { data } = await supabase
      .from('events')
      .select('id, name, fayre_date, expires_at')
      .eq('is_fayre', true)
      .eq('organiser', 'promise')
      .order('fayre_date', { ascending: true })
    if (data) setEvents(data)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1410', color: '#f5efe6', fontFamily: 'sans-serif', padding: '64px 24px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ letterSpacing: 4, fontSize: 18, fontWeight: 300, marginBottom: 8 }}>shoto</h1>
      <p style={{ color: '#c4a882', fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8, fontWeight: 300 }}>Promise Wedding Fayres</p>
      <p style={{ color: '#a89070', fontSize: 13, marginBottom: 64, fontWeight: 300 }}>Select your event below to get started</p>
      {loading ? (
        <p style={{ color: '#a89070' }}>Loading events...</p>
      ) : events.length === 0 ? (
        <p style={{ color: '#a89070' }}>No active events right now.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {events.map(event => {
            const today = new Date().toISOString().slice(0, 10)
            const isActive = event.fayre_date <= today && new Date(event.expires_at) > new Date()
            const isPast = new Date(event.expires_at) < new Date()
            if (isPast) return null
            if (isActive) {
              return (
                <a key={event.id} href={'/camera?event=' + event.id} style={{ display: 'block', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(245,239,230,0.15)', borderRadius: 8, padding: '24px 32px', textDecoration: 'none', color: '#f5efe6' }}>
                  <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, marginBottom: 8 }}>{event.name}</p>
                  {event.fayre_date && (
                    <p style={{ color: '#a89070', fontSize: 13, fontWeight: 300 }}>
                      {new Date(event.fayre_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </a>
              )
            }
            return (
              <div key={event.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(245,239,230,0.04)', borderRadius: 8, padding: '24px 32px', opacity: 0.4, cursor: 'default' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, marginBottom: 8, color: '#a89070' }}>{event.name}</p>
                {event.fayre_date && (
                  <p style={{ color: '#a89070', fontSize: 13, fontWeight: 300 }}>
                    {new Date(event.fayre_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
                <p style={{ color: '#4a3f35', fontSize: 11, marginTop: 8 }}>Coming soon</p>
              </div>
            )
          })}
        </div>
      )}
      <p style={{ color: '#4a3f35', fontSize: 11, marginTop: 64, letterSpacing: 1 }}>Powered by shoto.co.uk</p>
    </div>
  )
}