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
    const guestLimits = { basic: 75, standard: 100, premium: null }

    const eventId = crypto.randomUUID()
    const guestUrl = `https://shoto.co.uk/camera?event=${eventId}`

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

    if (customerEmail) {
      await resend.emails.send({
        from: "Shoto <hello@shoto.co.uk>",
        to: customerEmail,
        subject: `Your Shoto QR code is ready — ${eventName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1410; color: #f5efe6;">
            <h1 style="letter-spacing: 4px; font-size: 20px; font-weight: 300; margin-bottom: 32px;">shoto</h1>
            
            <p style="color: #a89070; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">Your event is ready</p>
            <h2 style="font-size: 24px; font-weight: 400; margin-bottom: 8px;">${eventName}</h2>
            <p style="color: #a89070; margin-bottom: 40px;">${occasion} — ${new Date(eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>

            <p style="color: #f5efe6; margin-bottom: 16px;">Your gallery will be revealed on <strong>${revealDate} at ${revealTime}</strong>.</p>

            <p style="color: #a89070; margin-bottom: 32px;">Share the QR code below with your guests — they can scan it at any point during your event to start taking photos.</p>

            <div style="background: #f5efe6; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 32px;">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(guestUrl)}" width="200" height="200" alt="QR Code" style="display: block; margin: 0 auto 16px;" />
              <p style="color: #1a1410; font-size: 12px; margin: 0;">${guestUrl}</p>
            </div>

            <p style="color: #a89070; font-size: 12px;">You will receive a second email when your gallery is ready to view after the event.</p>

            <hr style="border: none; border-top: 1px solid rgba(245,239,230,0.1); margin: 40px 0;" />
            <p style="color: #4a3f35; font-size: 11px;">shoto.co.uk</p>
          </div>
        `
      })
    }
  }

  res.status(200).json({ received: true })
}