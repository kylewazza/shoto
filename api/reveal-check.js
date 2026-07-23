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

    await resend.emails.send({
      from: "Shoto <hello@shoto.co.uk>",
      to: event.customer_email,
      subject: `Your Shoto gallery is ready — ${event.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1410; color: #f5efe6;">
          <h1 style="letter-spacing: 4px; font-size: 20px; font-weight: 300; margin-bottom: 32px;">shoto</h1>
          
          <p style="color: #a89070; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">Your gallery is ready</p>
          <h2 style="font-size: 24px; font-weight: 400; margin-bottom: 40px;">${event.name}</h2>

          <p style="color: #f5efe6; margin-bottom: 32px;">Your photos are ready to view. Click below to open your private gallery and download all the candid moments from your event.</p>

          <a href="${dashboardUrl}" style="display: inline-block; background: #f5efe6; color: #1a1410; padding: 16px 40px; border-radius: 4px; text-decoration: none; font-weight: 500; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 40px;">View your gallery</a>

          <p style="color: #a89070; font-size: 12px; margin-bottom: 8px;">Or copy this link:</p>
          <p style="color: #a89070; font-size: 12px; word-break: break-all;">${dashboardUrl}</p>

          <hr style="border: none; border-top: 1px solid rgba(245,239,230,0.1); margin: 40px 0;" />
          <p style="color: #4a3f35; font-size: 11px;">shoto.co.uk</p>
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