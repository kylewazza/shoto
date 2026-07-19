import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

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

    const photoLimits = { basic: 30, standard: 40, premium: 50 }
    const guestLimits = { basic: 75, standard: 100, premium: null }

    const { error } = await supabase.from("events").insert({
      id: crypto.randomUUID(),
      name: eventName,
      occasion,
      reveal_at: new Date(revealAt).toISOString(),
      photo_limit: photoLimits[tier],
      guest_limit: guestLimits[tier],
      stripe_session_id: session.id,
      customer_email: session.customer_details?.email
    })

    if (error) {
      console.error("Supabase insert error:", error)
      return res.status(500).json({ error: "Failed to create event" })
    }
  }

  res.status(200).json({ received: true })
}