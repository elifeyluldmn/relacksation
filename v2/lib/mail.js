import nodemailer from "nodemailer";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

const money = (amount) => new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(amount);
const productName = (slug) => ({"sauna": "Sauna", "cold-plunge": "Cold Plunge", "fire-pit": "Fire Pit"}[slug] || slug);
const friendlyDate = (date) => new Date(date + "T12:00:00Z").toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric", timeZone: "UTC"});

function customerHtml(booking) {
  const row = (label, value) => `<tr><td style="padding:10px 0;color:#59655d;font-size:14px;">${label}</td><td align="right" style="padding:10px 0;color:#183e31;font-size:14px;font-weight:600;">${escapeHtml(value)}</td></tr>`;
  const products = booking.products.map(productName).join(", ");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:24px 12px;background:#f7f4ec;font-family:Arial,Helvetica,sans-serif;color:#434a43;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;margin:0 auto;border-collapse:collapse;">
<tr><td align="center" style="background:#183e31;padding:30px 20px;">
<div style="font-size:27px;font-weight:700;letter-spacing:.4px;color:#f6f2e7;">RelACKsation</div>
<div style="font-size:11px;letter-spacing:2px;color:#e2d8c7;margin-top:7px;">NANTUCKET WELLNESS RENTALS</div></td></tr>
<tr><td style="background:#ffffff;padding:34px 30px;">
<h1 style="font-size:26px;line-height:1.3;color:#183e31;margin:0 0 22px;">Your relaxation is on its way.</h1>
<p style="font-size:15px;line-height:1.7;margin:0 0 14px;">Hi ${escapeHtml(booking.customer.name)},</p>
<p style="font-size:15px;line-height:1.7;margin:0 0 24px;">Thank you for choosing RelACKsation! We've received your booking request and can't wait to bring a little relaxation to you.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f1f4ed;border-radius:8px;">
<tr><td style="padding:22px;">
<div style="font-size:16px;font-weight:700;color:#183e31;margin-bottom:9px;">Your booking request</div>
<div style="display:inline-block;padding:6px 10px;border-radius:20px;background:#fff0d7;color:#79510c;font-size:12px;font-weight:700;margin-bottom:12px;">Pending confirmation</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
${row("Rental", products)}
${row("Dates", friendlyDate(booking.startDate) + " – " + friendlyDate(booking.endDate))}
${row("Estimated total", money(booking.total))}
</table></td></tr></table>
<p style="font-size:15px;line-height:1.7;margin:24px 0;">We'll be in touch to confirm availability, payment, and delivery details. <strong>Your reservation is not confirmed yet.</strong> No payment is due through the website.</p>
<p style="font-size:15px;line-height:1.7;margin:0;color:#183e31;">See you in relaxation,<br><strong>The RelACKsation Team</strong></p>
</td></tr>
<tr><td align="center" style="background:#e8e6dd;padding:22px 16px;color:#4b5b50;font-size:12px;line-height:1.8;">Nantucket, Massachusetts<br><a href="mailto:relackswellness@gmail.com" style="color:#183e31;">relackswellness@gmail.com</a></td></tr>
</table></body></html>`;
}

export async function sendBookingEmail(booking){
 const {SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASSWORD,MAIL_FROM,OWNER_EMAIL}=process.env;
 if(!SMTP_HOST||!SMTP_USER||!SMTP_PASSWORD||!MAIL_FROM||!OWNER_EMAIL) {console.warn("Booking email not configured; owner must follow up manually.");return false;}
 const transporter=nodemailer.createTransport({host:SMTP_HOST,port:Number(SMTP_PORT||587),secure:Number(SMTP_PORT||587)===465,auth:{user:SMTP_USER,pass:SMTP_PASSWORD}});
 const lines=[`Booking request #${booking._id}`,`Customer: ${booking.customer.name}`,`Email: ${booking.customer.email}`,`Phone: ${booking.customer.phone}`,`Rental: ${booking.startDate} to ${booking.endDate} (${booking.days} days)`,`Equipment: ${booking.products.join(", ")}`,`Estimated total: $${booking.total.toFixed(2)}`,`Delivery: ${booking.address.line1}, ${booking.address.city}, ${booking.address.state} ${booking.address.zip}`].join("\n");
 const customerText=`Thanks for choosing RelACKsation!\n\nWe've received your booking request. It is PENDING until the owner confirms availability, payment, and delivery details.\n\n${lines}\n\nWe'll contact you to arrange payment and delivery/pickup. ${process.env.NEXT_PUBLIC_BUSINESS_PHONE||""}`;
 const results=await Promise.allSettled([
   transporter.sendMail({from:MAIL_FROM,to:booking.customer.email,subject:"RelACKsation booking request received",text:customerText,html:customerHtml(booking)}),
   transporter.sendMail({from:MAIL_FROM,to:OWNER_EMAIL,subject:"New RelACKsation booking request",text:lines})
 ]);
 results.forEach((r,i)=>{if(r.status==="rejected")console.error("Email delivery failed",i,r.reason?.message);});
 return results.every(r=>r.status==="fulfilled");
}
