import { finalConfiguration } from "../../../configs/configurations";
import { resendEmailClient } from "../../../configs/resend";

export async function sendEmailTo({
  emails,
  subject,
  html,
  from = "Piya",
  fromEmailUserID = "piya",
}: {
  emails: string[];
  subject: string;
  html: string;
  from?: string;
  fromEmailUserID?: string;
}): Promise<boolean> {
  try {
    const { DOMAIN: APP_DOMAIN } = finalConfiguration();
    const DOMAIN = `mail.${APP_DOMAIN}`;

    const fromName = from
      ? `${from} <${fromEmailUserID}@${DOMAIN}>`
      : `${fromEmailUserID}@${DOMAIN}`;

    const { data: emailData, error } = await resendEmailClient().emails.send({
      from: fromName,
      to: emails,
      replyTo: `support@${DOMAIN}`,
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
