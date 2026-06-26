import { SendSMSParams, SendSMSResponse } from "../../types/auth.type";

async function sendSMS(params: SendSMSParams): Promise<SendSMSResponse> {
  return {
    success: false,
  };
}

async function sendOTP(params: {
  to: string;
  otpCode: string;
  channel?: "generic" | "dnd" | "whatsapp";
}): Promise<SendSMSResponse> {
  const message = `Your Piya verification code is ${params.otpCode}. This code expires in 30 minutes.`;

  return sendSMS({
    to: params.to,
    message,
    channel: params.channel,
  });
}

export { sendSMS, sendOTP };
