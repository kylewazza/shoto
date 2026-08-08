import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { name, email, occasion, guests, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    await resend.emails.send({
      from: "Shoto <hello@shoto.co.uk>",
      to: "kylewilliamsmedia@gmail.com",
      subject: `Bespoke enquiry — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1410; color: #f5efe6;">
          
          <h1 style="letter-spacing: 6px; font-size: 16px; font-weight: 300; margin-bottom: 32px; text-transform: lowercase;">shoto</h1>
          
          <p style="color: #a89070; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px;">New bespoke enquiry</p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
            <tr>
              <td style="color: #a89070; font-size: 12px; padding: 10px 0; border-bottom: 1px solid rgba(245,239,230,0.06); width: 140px;">Name</td>
              <td style="color: #f5efe6; font-size: 14px; padding: 10px 0; border-bottom: 1px solid rgba(245,239,230,0.06);">${name}</td>
            </tr>
            <tr>
              <td style="color: #a89070; font-size: 12px; padding: 10px 0; border-bottom: 1px solid rgba(245,239,230,0.06);">Email</td>
              <td style="color: #f5efe6; font-size: 14px; padding: 10px 0; border-bottom: 1px solid rgba(245,239,230,0.06);">${email}</td>
            </tr>
            <tr>
              <td style="color: #a89070; font-size: 12px; padding: 10px 0; border-bottom: 1px solid rgba(245,239,230,0.06);">Occasion</td>
              <td style="color: #f5efe6; font-size: 14px; padding: 10px 0; border-bottom: 1px solid rgba(245,239,230,0.06);">${occasion || "Not specified"}</td>
            </tr>
            <tr>
              <td style="color: #a89070; font-size: 12px; padding: 10px 0; border-bottom: 1px solid rgba(245,239,230,0.06);">Guest count</td>
              <td style="color: #f5efe6; font-size: 14px; padding: 10px 0; border-bottom: 1px solid rgba(245,239,230,0.06);">${guests || "Not specified"}</td>
            </tr>
          </table>

          <p style="color: #a89070; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">Message</p>
          <p style="color: #f5efe6; font-size: 14px; line-height: 1.8; margin-bottom: 0;">${message}</p>

        </div>
      `
    })

    await resend.emails.send({
      from: "Shoto <hello@shoto.co.uk>",
      to: email,
      subject: "We've received your enquiry — Shoto",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1410; color: #f5efe6;">
          
          <h1 style="letter-spacing: 6px; font-size: 16px; font-weight: 300; margin-bottom: 32px; text-transform: lowercase;">shoto</h1>
          
          <p style="color: #a89070; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px;">Enquiry received</p>
          <h2 style="font-size: 22px; font-weight: 400; margin-bottom: 24px;">Hi ${name},</h2>

          <p style="color: #f5efe6; font-size: 15px; line-height: 1.8; margin-bottom: 24px;">Thanks for getting in touch. We've received your bespoke enquiry and will get back to you within 24 hours with a tailored package.</p>

          <hr style="border: none; border-top: 1px solid rgba(245,239,230,0.08); margin-bottom: 32px;" />

          <p style="color: #a89070; font-size: 13px; font-style: italic;">Enjoy every moment, Shoto</p>

        </div>
      `
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to send enquiry" })
  }
}