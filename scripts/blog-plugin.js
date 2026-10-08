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
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-E7X77SYEFL"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-E7X77SYEFL');
    </script>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; background: #1a1410; color: #f5efe6; font-family: 'Inter', sans-serif; font-weight: 300; }
      body::before { content: ""; position: fixed; top: 0; left: 0; width: 60%; height: 40%; background: radial-gradient(ellipse at top left, rgba(255,180,80,0.07) 0%, transparent 70%); pointer-events: none; }
      a { color: #c4a882; }
      nav { display: flex; justify-content: space-between; align-items: center; padding: 28px 24px; position: relative; }
      nav a, footer a { color: #a89070; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; text-decoration: none; }
      nav .wordmark { color: #f5efe6; font-size: 16px; letter-spacing: 6px; text-transform: none; }
      nav .side { flex: 1; display: flex; gap: 24px; }
      nav .side.right { justify-content: flex-end; }
      @media (max-width: 480px) { nav .hide-small { display: none; } }
      main { max-width: 680px; margin: 0 auto; padding: 48px 24px 100px; position: relative; }
      .eyebrow { color: #c4a882; letter-spacing: 4px; font-size: 12px; text-transform: uppercase; margin: 0 0 24px; }
      h1 { font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400; font-size: clamp(34px, 6vw, 52px); line-height: 1.15; margin: 0 0 24px; text-shadow: 0 0 80px rgba(255,180,80,0.15); }
      .date { color: #a89070; font-size: 13px; letter-spacing: 1px; margin: 0 0 56px; }
      article h2 { font-family: 'Playfair Display', serif; font-weight: 400; font-size: 26px; line-height: 1.3; margin: 56px 0 20px; }
      article p, article li { color: #d9cfc0; font-size: 16px; line-height: 1.9; }
      article p { margin: 0 0 20px; }
      article strong { color: #f5efe6; font-weight: 500; }
      article ul, article ol { padding-left: 22px; margin: 0 0 24px; }
      article li { margin-bottom: 10px; }
      article li::marker { color: #c4a882; }
      article table { width: 100%; border-collapse: collapse; margin: 8px 0 24px; font-size: 14px; }
      article th { color: #c4a882; font-weight: 400; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; text-align: left; padding: 10px 8px; border-bottom: 1px solid rgba(245,239,230,0.15); }
      article td { color: #d9cfc0; padding: 12px 8px; border-bottom: 1px solid rgba(245,239,230,0.06); }
      .cta { text-align: center; margin-top: 40px; }
      .button { display: inline-block; background: #f5efe6; color: #1a1410; padding: 16px 44px; border-radius: 3px; text-decoration: none; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; font-weight: 400; }
      .post-list { list-style: none; padding: 0; margin: 0; }
      .post-list li { border-bottom: 1px solid rgba(245,239,230,0.08); padding: 32px 0; }
      .post-list a { text-decoration: none; }
      .post-list h2 { font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400; font-size: 26px; color: #f5efe6; margin: 0 0 12px; }
      .post-list p { color: #a89070; font-size: 14px; line-height: 1.8; margin: 0 0 8px; }
      footer { border-top: 1px solid rgba(245,239,230,0.05); padding: 36px 24px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; color: #a89070; font-size: 11px; letter-spacing: 2px; position: relative; }
      footer a { letter-spacing: 2px; text-transform: none; font-size: 11px; }
    </style>
  </head>
  <body>
    <nav>
      <div class="side"><a href="/blog">Blog</a></div>
      <a class="wordmark" href="/">shoto</a>
      <div class="side right"><a class="hide-small" href="/events">Events</a><a href="/contact">Contact</a></div>
    </nav>
    <main>
${body}
    </main>
    <footer>
      <a href="/">shoto</a>
      <a href="https://www.instagram.com/useshoto" target="_blank" rel="noopener noreferrer">useshoto</a>
      <a href="/blog">Blog</a>
      <a href="/contact">Contact</a>
      <a href="/privacy">Privacy Policy</a>
      <span>© 2026 est.</span>
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
    body: `      <p class="eyebrow"><a href="/blog" style="color: inherit; text-decoration: none;">Shoto blog</a></p>
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
            <p style="font-size: 12px; letter-spacing: 1px;">${formatDate(post.date)}</p>
          </a>
        </li>`).join("\n")
  return page({
    title: "Shoto Blog | Party, wedding and event photo ideas",
    description: "Ideas and guides for getting candid photos at Christmas parties, weddings, birthdays, proms and events, from the team behind Shoto.",
    url: `${SITE}/blog`,
    body: `      <p class="eyebrow">Shoto blog</p>
      <h1>Ideas for getting the photos you'll actually keep.</h1>
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
