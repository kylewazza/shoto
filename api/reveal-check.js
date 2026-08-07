import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const now = new Date().toISOString()

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .lte("reveal_at", now)
    .eq("reveal_email_sent", false)
    .not("customer_email", "is", null)

  if (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to fetch events" })
  }

  for (const event of events) {
    const dashboardUrl = `https://shoto.co.uk/dashboard?event=${event.id}`

    const revealDate = new Date(event.reveal_at).toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    })

    await resend.emails.send({
      from: "Shoto <hello@shoto.co.uk>",
      to: event.customer_email,
      subject: `Your Shoto gallery is ready — ${event.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1410; color: #f5efe6;">

          <h1 style="letter-spacing: 6px; font-size: 16px; font-weight: 300; margin-bottom: 32px; text-transform: lowercase;">shoto</h1>

          <p style="color: #a89070; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px;">Your gallery is ready</p>
          <h2 style="font-size: 24px; font-weight: 400; margin-bottom: 8px;">${event.name}</h2>
          <p style="color: #a89070; font-size: 14px; margin-bottom: 48px;">${revealDate}</p>

          <p style="color: #f5efe6; font-size: 15px; line-height: 1.8; margin-bottom: 48px;">The moment has arrived. Your guests have been busy. Open your private gallery below to see every candid moment they captured.</p>

          <a href="${dashboardUrl}" style="display: inline-block; background: #f5efe6; color: #1a1410; padding: 16px 40px; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px;">View your gallery</a>

          <p style="color: #a89070; font-size: 12px; margin-bottom: 8px;">Or copy this link:</p>
          <p style="color: #c4a882; font-size: 12px; word-break: break-all; margin-bottom: 48px;">${dashboardUrl}</p>

          <hr style="border: none; border-top: 1px solid rgba(245,239,230,0.08); margin-bottom: 32px;" />

          <p style="color: #a89070; font-size: 13px; font-style: italic;">Enjoy every moment, Shoto</p>

        </div>
      `
    })

    await supabase
      .from("events")
      .update({ reveal_email_sent: true })
      .eq("id", event.id)
  }

  res.status(200).json({ processed: events.length })
}