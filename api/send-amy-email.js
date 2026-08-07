import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  const eventId = "b3eaa90e-a6b2-4b2b-9413-1b7eaca576b3"
  const eventName = "Amy & Sam's Wedding"
  const occasion = "Wedding"
  const eventDate = "4 September 2026"
  const revealDate = "Saturday, 5 September 2026 at 10:00"
  const guestUrl = `https://shoto.co.uk/camera?event=${eventId}`
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(guestUrl)}`

  await resend.emails.send({
    from: "Shoto <hello@shoto.co.uk>",
    to: ["amysharman68@gmail.com", "kylewilliamsmedia@gmail.com"],
    subject: `Your Shoto QR code is ready — ${eventName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #1a1410; color: #f5efe6;">
        
        <h1 style="letter-spacing: 6px; font-size: 16px; font-weight: 300; margin-bottom: 32px; text-transform: lowercase;">shoto</h1>
        
        <p style="color: #a89070; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px;">Your event is ready</p>
        <h2 style="font-size: 24px; font-weight: 400; margin-bottom: 8px;">${eventName}</h2>
        <p style="color: #a89070; margin-bottom: 48px; font-size: 14px;">${occasion} — ${eventDate}</p>

        <p style="color: #f5efe6; font-size: 15px; line-height: 1.8; margin-bottom: 12px;">Your QR code is attached to this email. Print it and display it at your event so guests can scan it throughout the day.</p>

        <p style="color: #a89070; font-size: 13px; line-height: 1.8; margin-bottom: 8px;">If you'd prefer to share a link directly, you can also send guests this URL:</p>
        <p style="color: #c4a882; font-size: 13px; word-break: break-all; margin-bottom: 48px;">${guestUrl}</p>

        <hr style="border: none; border-top: 1px solid rgba(245,239,230,0.08); margin-bottom: 32px;" />

        <p style="color: #a89070; font-size: 13px; line-height: 1.8; margin-bottom: 48px;">Your gallery will be revealed on <strong style="color: #f5efe6;">${revealDate}</strong>. You'll receive an email when it's ready to view.</p>

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

  res.status(200).json({ sent: true })
}