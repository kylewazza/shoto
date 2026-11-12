// Builds the blog as plain HTML pages so search engines and link previews
// can read them without running JavaScript.
// Posts live in src/posts/*.md with a small header (slug, title, seoTitle,
// description, date). On build they are written to dist/blog/<slug>/index.html
// and dist/blog/index.html. In `npm run dev` the same pages are served live.

import fs from "node:fs"
import path from "node:path"
import { marked } from "marked"

const SITE = "https://shoto.co.uk"
const POSTS_DIR = path.resolve("src/posts")

function escape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function readPosts() {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8")
      const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      if (!match) throw new Error(`Blog post ${file} is missing its --- header`)
      const meta = {}
      for (const line of match[1].split("\n")) {
        const i = line.indexOf(":")
        if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
      }
      for (const key of ["slug", "title", "description", "date"]) {
        if (!meta[key]) throw new Error(`Blog post ${file} is missing "${key}"`)
      }
      return { ...meta, seoTitle: meta.seoTitle || meta.title, html: marked.parse(match[2], { breaks: true }) }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

function formatDate(iso) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

function page({ title, description, url, body, jsonLd }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    <link rel="canonical" href="${url}" />
    <meta name="robots" content="index, follow" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="${jsonLd ? "article" : "website"}" />
    <meta property="og:site_name" content="Shoto" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(description)}" />
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-E7X77SYEFL"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-E7X77SYEFL');
    </script>
    <style>
      /* Matches src/site.css: dark film-at-night look, date-stamp orange accent */
      :root { --bg: #17120e; --bg-raised: #211a14; --cream: #f5efe6; --muted: #b3a089; --gold: #c4a882; --stamp: #ff9548; --line: rgba(245,239,230,0.1); }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--bg); color: var(--cream); font-family: "Bricolage Grotesque", system-ui, sans-serif; font-size: 17px; line-height: 1.6; }
      body::after { content: ""; position: fixed; inset: 0; z-index: 50; pointer-events: none; opacity: 0.06; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
      a { color: var(--stamp); }
      .wrap { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 24px; }
      nav { display: flex; align-items: center; justify-content: space-between; height: 72px; }
      .wordmark { font-family: "Playfair Display", serif; font-style: italic; font-size: 30px; color: var(--gold); text-decoration: none; line-height: 1; }
      .links { display: flex; align-items: center; gap: 28px; font-size: 15px; }
      .links a { color: var(--muted); text-decoration: none; }
      .links a[aria-current="page"] { color: var(--cream); }
      @media (max-width: 640px) { .links a:not(.button) { display: none; } }
      .button { display: inline-flex; align-items: center; white-space: nowrap; background: var(--stamp); color: #1d1208 !important; padding: 15px 26px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 16px; }
      .button.small { padding: 10px 18px; font-size: 14px; }
      @media (hover: hover) and (pointer: fine) { .button:hover { background: #ffa868; } .links a:not(.button):hover { color: var(--cream); } }
      main { max-width: 720px; margin: 0 auto; padding: 48px 24px 64px; }
      h1 { font-family: "Playfair Display", serif; font-style: italic; font-weight: 400; font-size: clamp(40px, 6vw, 64px); line-height: 1.08; margin: 0 0 20px; padding-bottom: 4px; }
      .date { font-family: "Space Mono", monospace; color: var(--stamp); font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 48px; }
      .crumb { color: var(--muted); text-decoration: none; font-size: 15px; display: inline-block; margin-bottom: 20px; }
      article h2 { font-family: "Playfair Display", serif; font-weight: 400; font-size: 32px; line-height: 1.2; margin: 56px 0 16px; }
      article p, article li { color: #e2d7c8; }
      article p { margin: 0 0 20px; }
      article strong { color: var(--cream); font-weight: 600; }
      article ul, article ol { padding-left: 22px; margin: 0 0 24px; }
      article li { margin-bottom: 10px; }
      article li::marker { color: var(--stamp); }
      article table { width: 100%; border-collapse: collapse; margin: 8px 0 24px; font-size: 15px; }
      article th { color: var(--muted); font-weight: 600; text-align: left; padding: 10px 8px; border-bottom: 1px solid rgba(245,239,230,0.2); }
      article td { padding: 12px 8px; border-bottom: 1px solid var(--line); }
      .cta { margin-top: 40px; }
      .post-list { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--line); }
      .post-list li { border-bottom: 1px solid var(--line); }
      .post-list a { display: block; padding: 32px 0; text-decoration: none; color: inherit; }
      .post-list h2 { font-family: "Playfair Display", serif; font-style: italic; font-weight: 400; font-size: 32px; line-height: 1.15; margin: 0 0 10px; }
      .post-list p { color: var(--muted); margin: 0 0 8px; }
      .post-list .date { margin: 0; font-size: 12px; }
      @media (hover: hover) and (pointer: fine) { .post-list a:hover h2 { color: var(--stamp); } }
      footer { padding: 96px 0 40px; }
      .footer-mark { font-family: "Playfair Display", serif; font-style: italic; font-size: clamp(96px, 18vw, 240px); line-height: 0.9; color: var(--gold); margin: 0 0 40px; padding-bottom: 12px; }
      .footer-row { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px 32px; color: var(--muted); font-size: 15px; border-top: 1px solid var(--line); padding-top: 24px; }
      .footer-row nav { display: flex; flex-wrap: wrap; gap: 12px 28px; height: auto; }
      .footer-row a { color: inherit; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <nav>
        <a class="wordmark" href="/">shoto</a>
        <div class="links">
          <a href="/events">Events</a>
          <a href="/blog" aria-current="page">Blog</a>
          <a href="/contact">Contact</a>
          <a class="button small" href="/create">Create your event</a>
        </div>
      </nav>
    </div>
    <main>
${body}
    </main>
    <footer class="wrap">
      <p class="footer-mark" aria-hidden="true">shoto</p>
      <div class="footer-row">
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
  </body>
</html>
`
}

function postPage(post) {
  const url = `${SITE}/blog/${post.slug}`
  return page({
    title: post.seoTitle,
    description: post.description,
    url,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url,
      author: { "@type": "Organization", name: "Shoto" },
      publisher: { "@type": "Organization", name: "Shoto" },
    },
    body: `      <a class="crumb" href="/blog">← Shoto blog</a>
      <h1>${escape(post.title)}</h1>
      <p class="date">${formatDate(post.date)}</p>
      <article>
${post.html}
      </article>`,
  })
}

function indexPage(posts) {
  const items = posts.map((post) => `        <li>
          <a href="/blog/${post.slug}">
            <h2>${escape(post.title)}</h2>
            <p>${escape(post.description)}</p>
            <p class="date">${formatDate(post.date)}</p>
          </a>
        </li>`).join("\n")
  return page({
    title: "Shoto Blog | Party, wedding and event photo ideas",
    description: "Ideas and guides for getting candid photos at Christmas parties, weddings, birthdays, proms and events, from the team behind Shoto.",
    url: `${SITE}/blog`,
    body: `      <h1>Ideas for getting the photos you'll actually keep.</h1>
      <ul class="post-list">
${items}
      </ul>`,
  })
}

export default function blogPlugin() {
  return {
    name: "shoto-blog",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split("?")[0].replace(/\/$/, "")
        if (url !== "/blog" && !url.startsWith("/blog/")) return next()
        const posts = readPosts()
        const post = posts.find((p) => url === `/blog/${p.slug}`)
        if (url !== "/blog" && !post) return next()
        res.setHeader("Content-Type", "text/html; charset=utf-8")
        res.end(post ? postPage(post) : indexPage(posts))
      })
    },

    generateBundle() {
      const posts = readPosts()
      this.emitFile({ type: "asset", fileName: "blog/index.html", source: indexPage(posts) })
      for (const post of posts) {
        this.emitFile({ type: "asset", fileName: `blog/${post.slug}/index.html`, source: postPage(post) })
      }
    },
  }
}
