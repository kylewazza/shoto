import { useState, useEffect } from "react"
import { useInView } from "./siteHooks"
import "./site.css"

// Shared pieces for the marketing pages: nav, footer, cookie notice and
// the small scroll helpers. Camera and dashboard don't use these.

const NAV = [
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export function SiteNav({ current, hideCta = false }) {
  return (
    <nav className="site-nav">
      <a className="site-wordmark" href="/">shoto</a>
      <div className="site-nav-links">
        {NAV.map(({ href, label }) => (
          <a key={href} href={href} aria-current={current === href ? "page" : undefined}>{label}</a>
        ))}
        {!hideCta && <a className="site-btn site-btn--small" href="/create">Create your event</a>}
      </div>
    </nav>
  )
}

export function SiteFooter({ small = false }) {
  return (
    <footer className={`site-wrap site-footer ${small ? "site-footer--small" : ""}`}>
      <p className="site-footer-mark" aria-hidden="true">shoto</p>
      <div className="site-footer-row">
        <nav>
          <a href="/create">Create your event</a>
          <a href="/events">Events</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="https://www.instagram.com/useshoto" target="_blank" rel="noopener noreferrer">Instagram</a>
        </nav>
        <span>© 2026 Shoto</span>
      </div>
    </footer>
  )
}

export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("shoto_cookies_accepted")) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem("shoto_cookies_accepted", "true")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="site-cookie">
      <span>We use cookies and local storage to provide our service. See our <a href="/privacy">Privacy Policy</a> for details.</span>
      <button className="site-btn site-btn--small" onClick={accept}>Got it</button>
    </div>
  )
}

export function Rise({ className = "", children }) {
  const [ref, inView] = useInView(0.2)
  return <div ref={ref} className={`site-rise ${inView ? "is-in" : ""} ${className}`}>{children}</div>
}
