import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)

export const config = {
  api: {
    bodyParser: false,
  },
}

async function buffer(readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const sig = req.headers["stripe-signature"]
  const buf = await buffer(req)
  let event

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error("Webhook signature error:", err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const { tier, eventName, occasion, eventDate, revealAt } = session.metadata
    const customerEmail = session.customer_details?.email

    const photoLimits = { basic: 30, standard: 40, premium: 50 }
    const guestLimits = { basic: 75, standard: 100, premium: 150 }

    const eventId = crypto.randomUUID()
    const guestUrl = `https://shoto.co.uk/camera?event=${eventId}`
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(guestUrl)}`

    const { error } = await supabase.from("events").insert({
      id: eventId,
      name: eventName,
      occasion,
      reveal_at: new Date(revealAt).toISOString(),
      photo_limit: photoLimits[tier],
      guest_limit: guestLimits[tier],
      stripe_session_id: session.id,
      customer_email: customerEmail
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return res.status(500).json({ error: "Failed to create event" })
    }

    const revealDate = new Date(revealAt).toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    })
    const revealTime = new Date(revealAt).toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit"
    })

    const eventDateFormatted = new Date(eventDate).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric"
    })

    if (customerEmail) {
      await resend.emails.send({
        from: "Shoto <hello@shoto.co.uk>",
        to: customerEmail,
        subject: `Your Shoto QR code is ready — ${eventName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1410; color: #f5efe6;">
            
            <h1 style="letter-spacing: 6px; font-size: 16px; font-weight: 300; margin-bottom: 32px; text-transform: lowercase;">shoto</h1>
            
            <p style="color: #a89070; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px;">Your event is ready</p>
            <h2 style="font-size: 24px; font-weight: 400; margin-bottom: 8px;">${eventName}</h2>
            <p style="color: #a89070; margin-bottom: 48px; font-size: 14px;">${occasion} — ${eventDateFormatted}</p>

            <p style="color: #f5efe6; font-size: 15px; line-height: 1.8; margin-bottom: 12px;">Your QR code is attached to this email. Print it and display it at your event so guests can scan it throughout the day.</p>

            <p style="color: #a89070; font-size: 13px; line-height: 1.8; margin-bottom: 8px;">If you'd prefer to share a link directly, you can also send guests this URL:</p>
            <p style="color: #c4a882; font-size: 13px; word-break: break-all; margin-bottom: 48px;">${guestUrl}</p>

            <hr style="border: none; border-top: 1px solid rgba(245,239,230,0.08); margin-bottom: 32px;" />

            <p style="color: #a89070; font-size: 13px; line-height: 1.8; margin-bottom: 48px;">Your gallery will be revealed on <strong style="color: #f5efe6;">${revealDate} at ${revealTime}</strong>. You'll receive an email when it's ready to view.</p>

            <img src="${qrImageUrl}" width="160" height="160" alt="QR Code" style="display: block; margin: 0 auto 32px; border-radius: 4px;" />

            <hr style="border: none; border-top: 1px solid rgba(245,239,230,0.08); margin-bottom: 32px;" />

            <p style="color: #a89070; font-size: 13px; font-style: italic;">Enjoy every moment, Shoto</p>

          </div>
        `,
        attachments: [
          {
            filename: "shoto-qr-code.png",
            path: qrImageUrl,
          }
        ]
      })
    }
  }

  res.status(200).json({ received: true })
}