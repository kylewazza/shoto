import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { SiteNav, SiteFooter } from './SiteChrome'

export default function PromiseFayres() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    const { data } = await supabase
      .from('events')
      .select('id, name, fayre_date, expires_at, is_active')
      .eq('is_fayre', true)
      .eq('organiser', 'promise')
      .order('fayre_date', { ascending: true })
    if (data) setEvents(data)
    setLoading(false)
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="site">
      <div className="site-grain" />
      <div className="site-wrap">
        <SiteNav hideCta />
      </div>
      <main className="site-wrap site-wrap--narrow site-section--tight">
        <h1 className="site-title">Promise Wedding Fayres</h1>
        <p className="site-lead">Select your event below to get started.</p>
        {loading ? (
          <p className="site-lead">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="site-lead">No active events right now.</p>
        ) : (
          <div className="pr-list">
            {events.map(event => {
              const isPast = new Date(event.expires_at) < new Date()
              if (isPast) return null
              if (event.is_active) {
                return (
                  <a key={event.id} className="pr-event" href={'/camera?event=' + event.id}>
                    <span className="pr-name">{event.name}</span>
                    {event.fayre_date && <span className="pr-date">{formatDate(event.fayre_date)}</span>}
                    <span className="pr-go">Open camera →</span>
                  </a>
                )
              }
              return (
                <div key={event.id} className="pr-event is-off">
                  <span className="pr-name">{event.name}</span>
                  {event.fayre_date && <span className="pr-date">{formatDate(event.fayre_date)}</span>}
                  <span className="pr-go">Coming soon</span>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <SiteFooter small />
    </div>
  )
}
