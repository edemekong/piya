import { finalConfiguration } from "./configurations";
import { Resend } from "resend";

let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    const { RESEND_API_KEY } = finalConfiguration();
    resend = new Resend(RESEND_API_KEY);
  }
  return resend;
}

export { getResendClient as resendEmailClient };
