import { db } from "../../configs/firebase";
import { renderLeadRequestReceivedEmail } from "../email_templates/email-template-functions";
import type { LeadRequestData } from "../model/lead-request";
import type { CreateLeadRequestBody } from "../schema/lead-request.schema";
import { COLLECTIONS } from "../utils/collections";
import { sendEmailTo } from "../utils/helpers/email-notifications";
import {
  getUTCTimeNow,
  getValidEmail,
} from "../utils/helpers/helper-functions";

export class LeadRequestService {
  static async createLeadRequest(
    input: CreateLeadRequestBody,
  ): Promise<LeadRequestData> {
    const email = this.getLeadRequestEmail(input);
    const existingLeadRequest = await this.getExistingNewLeadRequest(
      input.type,
      email,
    );

    if (existingLeadRequest) return existingLeadRequest;

    const leadRequestRef = db().collection(COLLECTIONS.leadRequests).doc();
    const now = getUTCTimeNow();
    const baseLeadRequest = {
      email,
      id: leadRequestRef.id,
      status: "new" as const,
      createdAt: now,
      updatedAt: now,
    };
    const leadRequest: LeadRequestData =
      input.type === "demo"
        ? {
            ...baseLeadRequest,
            type: input.type,
            data: input.data,
          }
        : {
            ...baseLeadRequest,
            type: input.type,
            data: input.data,
          };

    await leadRequestRef.set(leadRequest);
    await this.sendLeadRequestReceivedEmail(leadRequest);

    return leadRequest;
  }

  private static async getExistingNewLeadRequest(
    type: CreateLeadRequestBody["type"],
    email: string,
  ): Promise<LeadRequestData | null> {
    const snapshot = await db()
      .collection(COLLECTIONS.leadRequests)
      .where("type", "==", type)
      .where("email", "==", email)
      .where("status", "==", "new")
      .limit(1)
      .get();
    const existingLeadRequest = snapshot.docs[0]?.data();

    return existingLeadRequest
      ? (existingLeadRequest as LeadRequestData)
      : null;
  }

  private static getLeadRequestEmail(input: CreateLeadRequestBody) {
    return getValidEmail(
      input.type === "demo" ? input.data.workEmail : input.data.email,
    );
  }

  private static async sendLeadRequestReceivedEmail(
    leadRequest: LeadRequestData,
  ) {
    const email =
      leadRequest.type === "demo"
        ? leadRequest.data.workEmail
        : leadRequest.data.email;
    const greetingName =
      leadRequest.type === "demo" ? leadRequest.data.fullName : "there";
    const requestLabel =
      leadRequest.type === "demo" ? "demo" : "market availability";

    await sendEmailTo({
      emails: [email],
      subject: "We received your Piya request",
      html: renderLeadRequestReceivedEmail({
        greetingName,
        requestLabel,
      }),
    });
  }
}
