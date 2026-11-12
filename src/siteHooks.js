import { useRef, useState, useEffect } from "react"

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// Adds "is-in" once the element scrolls into view, then stops watching.
export function useInView(threshold = 0.25) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!("IntersectionObserver" in window)) { setInView(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect() }
    }, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

// Sets the browser tab title and search description while a page is open.
export function usePageMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const previousDescription = meta?.getAttribute("content")
    if (title) document.title = title
    if (description) meta?.setAttribute("content", description)
    return () => {
      document.title = previousTitle
      if (meta && previousDescription) meta.setAttribute("content", previousDescription)
    }
  }, [title, description])
}
