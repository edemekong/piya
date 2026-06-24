import { resendEmailClient } from "../../../configs/resend";
import { finalConfiguration } from "../../../configs/configurations";

export async function sendEmailTo({
  emails,
  subject,
  html,
  from = "Yinapp App",
  fromEmailUserID = "yinapp",
}: {
  emails: string[];
  subject: string;
  html: string;
  from?: string;
  fromEmailUserID?: string;
}): Promise<boolean> {
  try {
    const domain = finalConfiguration().DOMAIN?.trim();
    const mailDomain = `mail.${domain}`;
    const { data: emailData, error } = await resendEmailClient().emails.send({
      from: from
        ? `${from} <${fromEmailUserID}@${mailDomain}>`
        : `${fromEmailUserID}@${mailDomain}`,
      to: emails,
      replyTo: `support@${mailDomain}`,
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully:", emailData);
    return true;
  } catch (error) {
    console.log("Error sending email:", error);
  }

  return false;
}

export async function sendEmailWithTemplateTo({
  emails,
  templateId,
  templateData,
}: {
  emails: string[];
  templateId: string;
  templateData: Record<string, any>;
  from?: string;
  fromEmailUserID?: string;
}): Promise<boolean> {
  try {
    const { data: emailData, error } = await resendEmailClient().emails.send({
      to: emails,
      template: {
        id: templateId,
        variables: templateData,
      },
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully:", emailData);
    return true;

    return true;
  } catch (error) {}

  return false;
}
