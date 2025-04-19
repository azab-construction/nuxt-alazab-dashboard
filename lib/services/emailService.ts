import emailjs from "@emailjs/browser";

export async function sendSupportEmail(data: {
  name: string;
  email: string;
  message: string;
}) {
  return await emailjs.send(
    "service_Alazab.co",
    "template_tvn06ki",
    {
      user_name: data.name,
      user_email: data.email,
      message: data.message,
    },
    "18ygGgryRoGve-Tpw",
  );
}
