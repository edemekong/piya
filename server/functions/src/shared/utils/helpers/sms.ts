import axios from "axios";
import { finalConfiguration } from "../../../configs/configurations";
import { SendSMSParams, SendSMSResponse } from "../../types/auth.type";

async function sendSMS(
  params: SendSMSParams,
): Promise<SendSMSResponse> {
  const { TERMII_API_KEY, TERMII_SENDER_ID, TERMII_BASE_URL } =
    finalConfiguration();
  const apiKey = TERMII_API_KEY?.trim();
  const senderId = TERMII_SENDER_ID?.trim();

  if (!apiKey || !senderId) {
    console.error("Termii API key or Sender ID not configured");
    return { success: false, error: "Termii not configured" };
  }

  try {
    const response = await axios.post(
      `${TERMII_BASE_URL}/sms/send`,
      {
        to: params.to,
        from: senderId,
        sms: params.message,
        type: "plain",
        channel: params.channel || "generic",
        api_key: apiKey,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data?.code === "ok" || response.data?.message_id) {
      return {
        success: true,
        messageId: response.data.message_id,
      };
    }

    return {
      success: false,
      error: response.data?.message || "Failed to send SMS",
    };
  } catch (error: any) {
    console.error("Termii SMS error:", error?.response?.data || error.message);
    return {
      success: false,
      error: error?.response?.data?.message || error.message,
    };
  }
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
