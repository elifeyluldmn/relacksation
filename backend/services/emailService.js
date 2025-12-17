// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.provider = process.env.EMAIL_PROVIDER || 'resend';
    this.apiKey = process.env.EMAIL_PROVIDER_API_KEY;
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@relacksation.com';
    this.ownerEmail = process.env.OWNER_NOTIFY_EMAIL;
    this.ownerContactPhone = process.env.OWNER_CONTACT_PHONE;
    this.ownerContactEmail = process.env.OWNER_CONTACT_EMAIL;
    
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    if (this.provider === 'resend') {
      return nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 587,
        secure: false,
        auth: {
          user: 'resend',
          pass: this.apiKey,
        },
      });
    } else if (this.provider === 'sendgrid') {
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: this.apiKey,
        },
      });
    } else {
      // Fallback to Gmail or other SMTP
      return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    }
  }

  async sendBookingConfirmation(booking) {
    try {
      const { customer, rental, products, pricing } = booking;
      
      const subject = 'RelAcksation - Your Booking Request Received';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2c3e50; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">RelAcksation</h1>
            <p style="margin: 10px 0 0 0;">Premium Sauna & Cold Plunge Rentals</p>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa;">
            <h2 style="color: #2c3e50;">Booking Request Received</h2>
            <p>Hi ${customer.name},</p>
            <p>Thank you for choosing RelAcksation! We've received your booking request and will contact you shortly to complete payment.</p>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
              <h3 style="color: #856404; margin-top: 0;">Next Steps</h3>
              <p style="color: #856404; margin: 0;">To complete your booking, please contact us to arrange payment via Venmo.</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Booking Details</h3>
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Dates:</strong> ${new Date(rental.startDate).toLocaleDateString()} - ${new Date(rental.endDate).toLocaleDateString()}</p>
              <p><strong>Duration:</strong> ${rental.duration} days</p>
              <p><strong>Rental Type:</strong> ${rental.type}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Products</h3>
              ${products.map(product => `
                <p><strong>${product.name}:</strong> $${product.unitPrice} × ${product.quantity} = $${product.totalPrice}</p>
              `).join('')}
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Pricing</h3>
              <p><strong>Subtotal:</strong> $${pricing.subtotal}</p>
              ${pricing.discount > 0 ? `<p><strong>Discount (${pricing.discountPercentage}%):</strong> -$${pricing.discount}</p>` : ''}
              <p><strong>Total:</strong> $${pricing.total}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Contact Information</h3>
              <p><strong>Service Address:</strong> ${customer.address}</p>
              <p><strong>Phone:</strong> ${customer.phone}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #2196f3;">
              <h3 style="color: #1976d2; margin-top: 0;">Contact Us to Complete Payment</h3>
              <p style="color: #1976d2; margin: 0;">We'll contact you within 24 hours to arrange payment and confirm your booking details.</p>
            </div>
            
            <p>If you have any questions, please don't hesitate to reach out.</p>
            
            <p>Best regards,<br>The RelAcksation Team</p>
          </div>
          
          <div style="background: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p>© 2024 RelAcks Wellness Inc. All rights reserved.</p>
          </div>
        </div>
      `;

      await this.sendEmail(customer.email, subject, html);
      console.log(`Booking confirmation email sent to ${customer.email}`);
      
    } catch (error) {
      console.error('Error sending booking confirmation email:', error);
      throw error;
    }
  }

  async sendOwnerNotification(booking) {
    try {
      if (!this.ownerEmail) {
        console.log('No owner email configured, skipping owner notification');
        return;
      }

      const { customer, rental, products, pricing } = booking;
      
      const subject = 'RelAcksation - New Booking Request';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #e74c3c; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">RelAcksation</h1>
            <p style="margin: 10px 0 0 0;">New Booking Request</p>
          </div>
          
          <div style="padding: 20px; background: #f8f9fa;">
            <h2 style="color: #2c3e50;">New Booking Request Received</h2>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
              <h3 style="color: #856404; margin-top: 0;">Action Required</h3>
              <p style="color: #856404; margin: 0;">Contact customer to arrange payment via Venmo and confirm booking details.</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Customer Information</h3>
              <p><strong>Name:</strong> ${customer.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${customer.email}">${customer.email}</a></p>
              <p><strong>Phone:</strong> <a href="tel:${customer.phone}">${customer.phone}</a></p>
              <p><strong>Address:</strong> ${customer.address}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Booking Details</h3>
              <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
              <p><strong>Status:</strong> Pending Payment</p>
              <p><strong>Dates:</strong> ${new Date(rental.startDate).toLocaleDateString()} - ${new Date(rental.endDate).toLocaleDateString()}</p>
              <p><strong>Duration:</strong> ${rental.duration} days</p>
              <p><strong>Rental Type:</strong> ${rental.type}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2c3e50; margin-top: 0;">Products & Revenue</h3>
              ${products.map(product => `
                <p><strong>${product.name}:</strong> $${product.unitPrice} × ${product.quantity} = $${product.totalPrice}</p>
              `).join('')}
              <hr>
              <p><strong>Total Revenue:</strong> $${pricing.total}</p>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #2196f3;">
              <h3 style="color: #1976d2; margin-top: 0;">Next Steps</h3>
              <p style="color: #1976d2; margin: 0;">1. Contact customer to arrange Venmo payment<br>
              2. Confirm booking details and delivery address<br>
              3. Update booking status to "paid" once payment is received<br>
              4. Schedule delivery and setup</p>
            </div>
          </div>
        </div>
      `;

      await this.sendEmail(this.ownerEmail, subject, html);
      console.log(`Owner notification email sent to ${this.ownerEmail}`);
      
    } catch (error) {
      console.error('Error sending owner notification email:', error);
      throw error;
    }
  }

  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: this.fromEmail,
        to: to,
        subject: subject,
        html: html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Email sent: ${info.messageId}`);
      return info;
      
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
