import { useState, useEffect } from "react"
import { SiteNav, SiteFooter, CookieNotice, Rise } from "./SiteChrome"
import { useInView, prefersReducedMotion } from "./siteHooks"
import "./Landing.css"

const TIERS = [
  { name: "Basic", price: "£9.99", guests: "Up to 75 guests", shots: "30 shots each" },
  { name: "Standard", price: "£19.99", guests: "Up to 100 guests", shots: "40 shots each", featured: true },
  { name: "Premium", price: "£29.99", guests: "Up to 150 guests", shots: "50 shots each" },
]

// Prints dealt onto the table in the hero. Each one landing uses a shot.
const PRINTS = [
  { src: "/photos/wedding-01.jpg", style: { left: "2%", top: "6%" }, r: "-7deg", d: 200 },
  { src: "/photos/wedding-05.jpg", style: { right: "4%", top: "0%" }, r: "5deg", d: 420 },
  { src: "/photos/wedding-04.jpg", style: { left: "26%", top: "30%" }, r: "-2deg", d: 640 },
]
const START_SHOTS = 30
const LANDING_MS = 520

const DEVELOP = [
  "/photos/wedding-02.jpg",
  "/photos/wedding-06.jpg",
  "/photos/wedding-07.jpg",
  "/photos/wedding-08.jpg",
]

const OCCASIONS = ["Weddings", "Birthdays", "Christmas parties", "Proms", "Hen dos", "Work dos", "Anniversaries", "Stag dos"]

function ShotCounter({ ready }) {
  const [shots, setShots] = useState(START_SHOTS)
  useEffect(() => {
    if (!ready) return
    if (prefersReducedMotion()) { setShots(START_SHOTS - PRINTS.length); return }
    const timers = PRINTS.map((print, i) =>
      setTimeout(() => setShots(START_SHOTS - i - 1), print.d + LANDING_MS)
    )
    return () => timers.forEach(clearTimeout)
  }, [ready])
  return (
    <div className="lp-counter" aria-hidden="true">
      <b>{shots}</b> shots left
    </div>
  )
}

export default function Landing() {
  const [developRef, developed] = useInView(0.3)
  // Hold the deal until the hero photos have loaded, so they never pop in late.
  const [loaded, setLoaded] = useState(0)
  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 2500)
    return () => clearTimeout(t)
  }, [])
  const ready = timedOut || loaded >= PRINTS.length
  const loop = [...OCCASIONS, ...OCCASIONS]

  return (
    <div className="site">
      <div className="site-grain" />

      <div className="site-wrap">
        <SiteNav />

        <header className="lp-hero">
          <div>
            <h1>Everyone gets a camera. You get <em>every</em> photo.</h1>
            <p>Guests scan a QR code and shoot on their own phone. No app, no peeking. The photos develop when you say.</p>
            <div className="lp-hero-ctas">
              <a className="site-btn" href="/create">Create your event</a>
              <a className="site-btn site-btn--ghost" href="#pricing">See prices</a>
            </div>
          </div>

          <div className={`lp-table ${ready ? "is-ready" : ""}`}>
            {PRINTS.map(({ src, style, r, d }, i) => (
              <div key={src} className="lp-print" style={{ ...style, "--r": r, zIndex: i + 1 }}>
                <div className="lp-print-inner" style={{ "--d": `${d}ms` }}>
                  <img src={src} alt="" fetchPriority={i === 0 ? "high" : "auto"} onLoad={() => setLoaded(n => n + 1)} onError={() => setLoaded(n => n + 1)} />
                </div>
              </div>
            ))}
            <ShotCounter ready={ready} />
          </div>
        </header>

        <section className="site-steps" aria-label="How it works">
          <div className="site-step">
            <h3>Scan</h3>
            <p>Put your QR code on the tables. Guests open the camera in their phone's browser. Nothing to download.</p>
          </div>
          <div className="site-step">
            <h3>Shoot</h3>
            <p>Everyone gets a set number of shots with our film look. Fewer shots, better moments.</p>
          </div>
          <div className="site-step">
            <h3>Reveal</h3>
            <p>Nobody sees a thing on the night. Your private gallery opens at the time you choose.</p>
          </div>
        </section>
      </div>

      <section className="site-section">
        <div className="site-wrap">
          <Rise>
            <h2 className="site-h2">The good bits, from every table.</h2>
            <p className="site-lead">Your guests catch the moments a photographer never sees. They land in your gallery at the reveal, with the film look and as clean originals.</p>
          </Rise>
          <div ref={developRef} className={`lp-develop ${developed ? "is-in" : ""}`}>
            {DEVELOP.map((src, i) => (
              <div key={src} className="lp-tile">
                <img className="lp-latent" src={src} alt="" loading="lazy" />
                <img className="lp-sharp" src={src} alt="A guest's photo from a Shoto wedding" loading="lazy" style={{ "--d": `${i * 160}ms` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lp-marquee" aria-label="Shoto works for weddings, birthdays, Christmas parties, proms, hen dos, work dos, anniversaries and stag dos">
        <div className="lp-marquee-track">
          {loop.map((o, i) => (
            <span key={i} aria-hidden={i >= OCCASIONS.length ? "true" : undefined}>{o}</span>
          ))}
        </div>
      </div>

      <section className="site-section">
        <div className="site-wrap lp-quote">
          <figure>
            <img src="/photos/wedding-03.jpg" alt="Amy and her husband on their wedding day, taken by a guest on Shoto" loading="lazy" />
          </figure>
          <Rise>
            <blockquote>“Our guests absolutely loved the idea. The next morning, we were able to see all the amazing photos of what our guests had been getting up to.”</blockquote>
            <cite><b>Amy</b>, married September 2026</cite>
          </Rise>
        </div>
      </section>

      <section className="site-section" id="pricing" style={{ paddingTop: 0 }}>
        <div className="site-wrap">
          <h2 className="site-h2">One price per event.</h2>
          <p className="site-lead">Pay once. No subscription, no app, nothing for guests to sign up to.</p>
          <div className="lp-prices">
            {TIERS.map(({ name, price, guests, shots, featured }) => (
              <a key={name} href="/create" className={`lp-price ${featured ? "is-featured" : ""}`}>
                <span className="lp-price-name">{featured && <small>Most popular</small>}{name}</span>
                <span className="lp-price-meta">{guests}</span>
                <span className="lp-price-meta">{shots}</span>
                <span className="lp-price-cost">{price}</span>
                <span className="lp-price-go">Choose →</span>
              </a>
            ))}
          </div>
          <p className="lp-included">Every package includes the film look on every photo, clean originals, a private gallery, one click downloads and a printable QR code.</p>
        </div>
      </section>

      <section className="site-wrap">
        <div className="site-band">
          <div>
            <h2>Festival, awards night or 150+ guests?</h2>
            <p>We set Shoto up around bigger events, with a live gallery your team can watch on the night.</p>
          </div>
          <a className="site-btn site-btn--ghost" href="/events">Shoto Events</a>
        </div>
      </section>

      <SiteFooter />

      <CookieNotice />
    </div>
  )
}
