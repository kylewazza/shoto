import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase"
import { SiteNav, SiteFooter } from "./SiteChrome"

export default function Success() {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tracked, setTracked] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get("session_id")
    if (sessionId) loadEvent(sessionId)
    else setLoading(false)
  }, [])

  useEffect(() => {
    if (event && !tracked) {
      const prices = { basic: 9.99, standard: 19.99, premium: 29.99 }
      const value = prices[event.tier] || prices[Object.keys(prices).find(k => event.photo_limit === { basic: 30, standard: 40, premium: 50 }[k])] || 19.99

      if (typeof window.gtag === "function") {
        window.gtag("event", "purchase", {
          transaction_id: event.stripe_session_id,
          value: value,
          currency: "GBP",
          items: [{
            item_name: event.name,
            item_category: event.occasion,
            price: value,
            quantity: 1
          }]
        })
      }
      setTracked(true)
    }
  }, [event, tracked])

  async function loadEvent(sessionId) {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .single()

    if (data) setEvent(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <SuccessShell>
        <p className="site-lead">Setting up your event...</p>
      </SuccessShell>
    )
  }

  if (!event) {
    return (
      <SuccessShell>
        <h1 className="site-title">Payment received.</h1>
        <p className="site-lead">Check your email for your event details.</p>
      </SuccessShell>
    )
  }

  return (
    <SuccessShell>
      <h1 className="site-title">You're all set.</h1>
      <p className="sc-event">{event.name}</p>
      <div className="site-steps sc-steps">
        <div className="site-step">
          <h3>Check your email</h3>
          <p>Your QR code has been sent to your email as an attachment. Print it and display it at your event so guests can scan it on the day.</p>
        </div>
        <div className="site-step">
          <h3>Your gallery reveal</h3>
          <p>After your event, you'll receive a second email with your private gallery link. Your photos will be waiting.</p>
        </div>
      </div>
      <p className="sc-signoff">Enjoy every moment, Shoto</p>
    </SuccessShell>
  )
}

function SuccessShell({ children }) {
  return (
    <div className="site">
      <div className="site-grain" />
      <div className="site-wrap">
        <SiteNav hideCta />
      </div>
      <main className="site-wrap site-section--tight sc-main">{children}</main>
      <SiteFooter small />
    </div>
  )
}
