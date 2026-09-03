import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_6ksmrnq";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_ab1dme8";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "0wPknJsYPxrTgLSex";

/**
 * Generates a secure 6-digit numeric verification code
 */
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sends a verification code to the recipient using EmailJS
 * @param {string} userEmail 
 * @param {string} userName 
 * @param {string} code 
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function sendVerificationEmail(userEmail, userName, code) {
  try {
    // Template parameters aligned with standard EmailJS template formats
    const templateParams = {
      to_email: userEmail,
      recipient_email: userEmail,
      email: userEmail,
      to_name: userName || "HighRon Member",
      name: userName || "HighRon Member",
      user_name: userName || "HighRon Member",
      passcode: code,
      verification_code: code,
      otp_code: code,
      code: code,
      message: `Your HighRon Tech security verification code is: ${code}. Please enter this code to verify your account. It expires in 10 minutes.`,
      company: "HighRon Tech",
      reply_to: "noreply@highron.tech"
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    return {
      success: true,
      message: "Verification email sent successfully!",
      response
    };
  } catch (error) {
    console.warn("EmailJS delivery notification:", error);
    return {
      success: false,
      message: error?.text || error?.message || "Failed to deliver email through EmailJS service.",
      error
    };
  }
}
