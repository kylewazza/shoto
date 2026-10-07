import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function escape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function row(label, value) {
  return `
            <tr>
              <td style="color: #a89070; font-size: 12px; padding: 10px 0; border-bottom: 1px solid rgba(245,239,230,0.06); width: 160px;">${label}</td>
              <td style="color: #f5efe6; font-size: 14px; padding: 10px 0; border-bottom: 1px solid rgba(245,239,230,0.06);">${escape(value) || "Not specified"}</td>
            </tr>`
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { name, organisation, email, phone, eventType, attendance, dates, sponsorship, message } = req.body

  if (!name || !organisation || !email) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    await resend.emails.send({
      from: "Shoto <hello@shoto.co.uk>",
      to: "kylewilliamsmedia@gmail.com",
      replyTo: email,
      subject: `Shoto Events enquiry: ${organisation}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1410; color: #f5efe6;">

          <h1 style="letter-spacing: 6px; font-size: 16px; font-weight: 300; margin-bottom: 32px; text-transform: lowercase;">shoto</h1>

          <p style="color: #a89070; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px;">Shoto Events enquiry</p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
            ${row("Name", name)}
            ${row("Organisation", organisation)}
            ${row("Email", email)}
            ${row("Phone", phone)}
            ${row("Type of event", eventType)}
            ${row("Attendance", attendance)}
            ${row("Event date(s)", dates)}
            ${row("Sponsorship", sponsorship)}
          </table>

          <p style="color: #a89070; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">Anything else</p>
          <p style="color: #f5efe6; font-size: 14px; line-height: 1.8; margin-bottom: 0; white-space: pre-wrap;">${escape(message) || "Nothing added"}</p>

        </div>
      `
    })

    await resend.emails.send({
      from: "Shoto <hello@shoto.co.uk>",
      to: email,
      subject: "We've received your enquiry. Shoto Events",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1410; color: #f5efe6;">

          <h1 style="letter-spacing: 6px; font-size: 16px; font-weight: 300; margin-bottom: 32px; text-transform: lowercase;">shoto</h1>

          <p style="color: #a89070; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px;">Enquiry received</p>
          <h2 style="font-size: 22px; font-weight: 400; margin-bottom: 24px;">Hi ${escape(name)},</h2>

          <p style="color: #f5efe6; font-size: 15px; line-height: 1.8; margin-bottom: 24px;">Thanks for telling us about your event. We'll be in touch within one working day with ideas and a quote.</p>

          <hr style="border: none; border-top: 1px solid rgba(245,239,230,0.08); margin-bottom: 32px;" />

          <p style="color: #a89070; font-size: 13px; font-style: italic;">Shoto Events</p>

        </div>
      `
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to send enquiry" })
  }
}
