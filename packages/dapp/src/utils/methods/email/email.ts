import { Transporter } from 'nodemailer';
import { transporter } from '../../../../config/nodemailer';

/**
 * Sends an email with the specified content.
 * @param email The email address to send to.
 * @param subject The subject of the email.
 * @param body The HTML body of the email.
 * @param transporter The NodeMailer Transporter instance.
 * @returns A promise that resolves to true if the email was sent successfully, or throws an error if not.
 */
export async function sendEmail(
  email: string,
  subject: string,
  body: string
): Promise<boolean> {
  const mailOptions = {
    from: 'your-email@example.com', // Replace with your email
    to: email,
    subject: subject,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    //console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}
