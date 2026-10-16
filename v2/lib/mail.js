import nodemailer from "nodemailer";
export async function sendBookingEmail(booking){
 const {SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASSWORD,MAIL_FROM,OWNER_EMAIL}=process.env;
 if(!SMTP_HOST||!SMTP_USER||!SMTP_PASSWORD||!MAIL_FROM||!OWNER_EMAIL) {console.warn("Booking email not configured; owner must follow up manually.");return false;}
 const transporter=nodemailer.createTransport({host:SMTP_HOST,port:Number(SMTP_PORT||587),secure:Number(SMTP_PORT||587)===465,auth:{user:SMTP_USER,pass:SMTP_PASSWORD}});
 const lines=[`Booking request #${booking._id}`,`Customer: ${booking.customer.name}`,`Email: ${booking.customer.email}`,`Phone: ${booking.customer.phone}`,`Rental: ${booking.startDate} to ${booking.endDate} (${booking.days} days)`,`Equipment: ${booking.products.join(", ")}`,`Estimated total: $${booking.total.toFixed(2)}`,`Delivery: ${booking.address.line1}, ${booking.address.city}, ${booking.address.state} ${booking.address.zip}`].join("\n");
 const customerText=`Thanks for choosing RelACKsation!\n\nWe've received your booking request. It is PENDING until the owner confirms availability, payment, and delivery details by phone.\n\n${lines}\n\nPlease call RelACKsation to finalize payment and delivery/pickup arrangements. ${process.env.NEXT_PUBLIC_BUSINESS_PHONE||""}`;
 const results=await Promise.allSettled([
   transporter.sendMail({from:MAIL_FROM,to:booking.customer.email,subject:"RelACKsation booking request received",text:customerText}),
   transporter.sendMail({from:MAIL_FROM,to:OWNER_EMAIL,subject:"New RelACKsation booking request",text:lines})
 ]);
 results.forEach((r,i)=>{if(r.status==="rejected")console.error("Email delivery failed",i,r.reason?.message);});
 return results.every(r=>r.status==="fulfilled");
}
