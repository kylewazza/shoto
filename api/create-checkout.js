export const config = {
  api: {
    bodyParser: true,
  },
}

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICES = {
  basic: "price_1Tw79GCR1ZJTrE5ZB67Pu9SK",
  standard: "price_1Tw7AGCR1ZJTrE5ZTPMYeqQd",
  premium: "price_1Tw7AsCR1ZJTrE5ZgpaU5r2h"
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { tier, eventName, occasion, eventDate, revealAt } = req.body

  if (!tier || !eventName || !occasion || !eventDate || !revealAt) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRICES[tier],
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.VITE_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL}/create`,
      metadata: {
        tier,
        eventName,
        occasion,
        eventDate,
        revealAt
      },
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to create checkout session" })
  }
}