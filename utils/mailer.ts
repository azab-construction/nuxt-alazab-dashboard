import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587,
  secure: false,
  auth: {
    user: "MS_L42vCY@azab.services",
    pass: "mssp.jyWRsO6.jy7zpl9xxvpl5vx6.aOyPK8R",
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  from = "info@al-azab.co",
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  const info = await transporter.sendMail({ from, to, subject, html });
  return info;
}
