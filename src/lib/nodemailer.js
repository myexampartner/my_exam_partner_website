import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send email function
export const sendEmail = async (to, subject, htmlContent) => {
  try {
    console.log('Environment variables:', {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER ? 'Set' : 'Not Set',
      SMTP_PASS: process.env.SMTP_PASS ? 'Set' : 'Not Set',
    });
    
    const transporter = createTransporter();
    
    // Verify connection configuration
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    
    // Send mail with defined transport object
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'My Exam Partner'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    };
    
    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent successfully: %s', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      email: to
    };
    
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message,
      email: to
    };
  }
};

// Send bulk emails
export const sendBulkEmails = async (emailList, subject, htmlContent) => {
  const results = [];
  
  for (const email of emailList) {
    const result = await sendEmail(email, subject, htmlContent);
    results.push(result);
    
    // Add small delay between emails to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};

export default { sendEmail, sendBulkEmails };
