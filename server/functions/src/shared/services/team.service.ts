import { createHash } from "crypto";
import { finalConfiguration } from "../../configs/configurations";
import { db } from "../../configs/firebase";
import { renderMemberInvitationEmail } from "../email_templates/email-template-functions";
import type {
  BusinessData,
  MemberData,
  MemberInvitationData,
} from "../model/business";
import type { UserData } from "../model/user";
import type {
  MemberInvitationBody,
  MemberRoleBody,
} from "../schema/team.schema";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { sendEmailTo } from "../utils/helpers/email-notifications";
import {
  getUTCTimeNow,
  getValidEmail,
} from "../utils/helpers/helper-functions";

const MEMBER_INVITATION_EXPIRY_DAYS = 7;

type InvitationAcceptanceResult =
  | { status: "accepted"; member: MemberData }
  | {
      status:
        | "business-not-found"
        | "expired"
        | "invitation-not-found"
        | "user-not-found";
    };

export class BusinessTeamService {
  static async getMembership(userId: string) {
    const userSnapshot = await db()
      .collection(COLLECTIONS.users)
      .doc(userId)
      .get();
    if (!userSnapshot.exists) return null;

    const user = userSnapshot.data() as UserData;
    const businessId = user.business?.businessIds[0];
    if (!businessId) return null;

    const [businessSnapshot, memberSnapshot] = await Promise.all([
      this.businessDocument(businessId).get(),
      this.memberDocument(businessId, userId).get(),
    ]);
    if (!businessSnapshot.exists || !memberSnapshot.exists) return null;

    return {
      business: businessSnapshot.data() as BusinessData,
      businessId,
      member: memberSnapshot.data() as MemberData,
      user,
    };
  }

  static async checkBusinessOwner(userId: string) {
    const membership = await this.getMembership(userId);
    return membership?.member.role === "owner" ? membership : null;
  }

  static async getTeam(businessId: string) {
    const businessRef = this.businessDocument(businessId);
    const [membersSnapshot, invitationsSnapshot] = await Promise.all([
      businessRef.collection(BUSINESS_SUBCOLLECTIONS.members).get(),
      businessRef
        .collection(BUSINESS_SUBCOLLECTIONS.memberInvitations)
        .where("status", "==", "pending")
        .get(),
    ]);

    return {
      invitations: invitationsSnapshot.docs.map(
        (document) => document.data() as MemberInvitationData,
      ),
      members: membersSnapshot.docs.map(
        (document) => document.data() as MemberData,
      ),
    };
  }

  static async getMember(businessId: string, memberId: string) {
    const snapshot = await this.memberDocument(businessId, memberId).get();
    return snapshot.exists ? (snapshot.data() as MemberData) : null;
  }

  static async getMemberByEmail(businessId: string, email: string) {
    const snapshot = await this.businessDocument(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.members)
      .where("email", "==", getValidEmail(email))
      .limit(1)
      .get();

    return snapshot.empty ? null : (snapshot.docs[0].data() as MemberData);
  }

  static async inviteMember(
    business: BusinessData,
    invitedBy: string,
    input: MemberInvitationBody,
  ) {
    const email = getValidEmail(input.email);
    const now = getUTCTimeNow();
    const invitationRef = this.invitationDocument(business.id, email);
    const invitationSnapshot = await invitationRef.get();
    const existingInvitation = invitationSnapshot.exists
      ? (invitationSnapshot.data() as MemberInvitationData)
      : null;
    const invitation: MemberInvitationData = {
      id: invitationRef.id,
      businessId: business.id,
      email,
      role: input.role,
      status: "pending",
      invitedBy,
      expiresAt: now + MEMBER_INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
      acceptedAt: null,
      acceptedBy: null,
      createdAt: existingInvitation?.createdAt ?? now,
      updatedAt: now,
    };

    await invitationRef.set(invitation);

    const dashboardUrl = finalConfiguration().DASHBOARD_URL?.replace(/\/$/, "");
    const emailSent = dashboardUrl
      ? await sendEmailTo({
          emails: [invitation.email],
          subject: `You have been invited to join ${business.name} on Piya`,
          html: renderMemberInvitationEmail({
            acceptUrl: `${dashboardUrl}/auth?invitationTo=${encodeURIComponent(
              invitation.businessId,
            )}`,
            businessName: business.name,
            expiresInDays: MEMBER_INVITATION_EXPIRY_DAYS,
            role:
              invitation.role.charAt(0).toUpperCase() +
              invitation.role.slice(1),
          }),
        })
      : false;

    return { emailSent, invitation };
  }

  static async acceptInvitation(params: {
    businessId: string;
    email: string;
    userId: string;
  }): Promise<InvitationAcceptanceResult> {
    const { businessId, userId } = params;
    const email = getValidEmail(params.email);
    const invitationRef = this.invitationDocument(businessId, email);
    const memberRef = this.memberDocument(businessId, userId);
    const userRef = db().collection(COLLECTIONS.users).doc(userId);
    const businessRef = this.businessDocument(businessId);

    return db().runTransaction(async (transaction) => {
      const [
        invitationSnapshot,
        memberSnapshot,
        userSnapshot,
        businessSnapshot,
      ] = await Promise.all([
        transaction.get(invitationRef),
        transaction.get(memberRef),
        transaction.get(userRef),
        transaction.get(businessRef),
      ]);
      if (!invitationSnapshot.exists) {
        return { status: "invitation-not-found" };
      }

      const invitation = invitationSnapshot.data() as MemberInvitationData;
      const existingMember = memberSnapshot.exists
        ? (memberSnapshot.data() as MemberData)
        : null;

      if (
        invitation.status === "accepted" &&
        invitation.acceptedBy === userId &&
        existingMember
      ) {
        return { status: "accepted", member: existingMember };
      }

      if (invitation.status !== "pending" || invitation.email !== email) {
        return { status: "invitation-not-found" };
      }
      if (invitation.expiresAt < getUTCTimeNow()) {
        return { status: "expired" };
      }
      if (!userSnapshot.exists) return { status: "user-not-found" };
      if (!businessSnapshot.exists) return { status: "business-not-found" };

      const now = getUTCTimeNow();
      const user = userSnapshot.data() as UserData;
      const businessIds = user.business?.businessIds ?? [];
      const member: MemberData = {
        id: userId,
        businessId,
        name: user.name.trim() || email,
        email,
        profileImageUrl: user.profileImageUrl,
        role: invitation.role,
        permission: invitation.role === "admin" ? "edit" : "view",
        createdAt: existingMember?.createdAt ?? now,
        updatedAt: now,
      };

      transaction.set(memberRef, member);
      transaction.set(invitationRef, {
        ...invitation,
        status: "accepted",
        acceptedAt: now,
        acceptedBy: userId,
        updatedAt: now,
      } satisfies MemberInvitationData);
      transaction.set(
        userRef,
        {
          business: {
            businessIds: businessIds.includes(businessId)
              ? businessIds
              : [businessId, ...businessIds],
            businessRoleTypes: {
              ...user.business?.businessRoleTypes,
              [businessId]: [invitation.role],
            },
          },
          updatedAt: now,
        },
        { merge: true },
      );

      return { status: "accepted", member };
    });
  }

  static async updateMemberRole(member: MemberData, input: MemberRoleBody) {
    const updatedMember: MemberData = {
      ...member,
      role: input.role,
      permission: input.role === "admin" ? "edit" : "view",
      updatedAt: getUTCTimeNow(),
    };
    await this.memberDocument(member.businessId, member.id).set(updatedMember);

    return updatedMember;
  }

  static async updateInvitationRole(
    businessId: string,
    invitationId: string,
    input: MemberRoleBody,
  ) {
    const invitationRef = this.invitationDocumentById(businessId, invitationId);
    const snapshot = await invitationRef.get();
    if (!snapshot.exists) return null;

    const invitation = snapshot.data() as MemberInvitationData;
    if (invitation.status !== "pending") return null;

    const updatedInvitation: MemberInvitationData = {
      ...invitation,
      role: input.role,
      updatedAt: getUTCTimeNow(),
    };
    await invitationRef.set(updatedInvitation);

    return updatedInvitation;
  }

  static async deleteMember(member: MemberData) {
    await this.memberDocument(member.businessId, member.id).delete();
  }

  static async deleteInvitation(businessId: string, invitationId: string) {
    const invitationRef = this.invitationDocumentById(businessId, invitationId);
    const snapshot = await invitationRef.get();
    if (!snapshot.exists) return false;

    await invitationRef.delete();
    return true;
  }

  static async updateUserMembership(member: MemberData) {
    const userRef = db().collection(COLLECTIONS.users).doc(member.id);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) return;

    const user = userSnapshot.data() as UserData;
    const businessIds = user.business?.businessIds ?? [];
    const currentRoles =
      user.business?.businessRoleTypes[member.businessId] ?? [];
    const membershipIsCurrent =
      businessIds.includes(member.businessId) &&
      currentRoles.length === 1 &&
      currentRoles[0] === member.role;
    if (membershipIsCurrent) return;

    await userRef.set(
      {
        business: {
          businessIds: businessIds.includes(member.businessId)
            ? businessIds
            : [member.businessId, ...businessIds],
          businessRoleTypes: {
            ...user.business?.businessRoleTypes,
            [member.businessId]: [member.role],
          },
        },
        updatedAt: getUTCTimeNow(),
      },
      { merge: true },
    );
  }

  static async removeUserMembership(businessId: string, memberId: string) {
    const userRef = db().collection(COLLECTIONS.users).doc(memberId);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) return;

    const user = userSnapshot.data() as UserData;
    const businessIds = user.business?.businessIds ?? [];
    const businessRoleTypes = {
      ...user.business?.businessRoleTypes,
    };
    if (
      !businessIds.includes(businessId) &&
      !(businessId in businessRoleTypes)
    ) {
      return;
    }
    delete businessRoleTypes[businessId];

    await userRef.set(
      {
        business: {
          businessIds: businessIds.filter((id) => id !== businessId),
          businessRoleTypes,
        },
        updatedAt: getUTCTimeNow(),
      },
      { merge: true },
    );
  }

  static async updateMemberProfiles(
    user: Pick<
      UserData,
      "business" | "email" | "id" | "name" | "profileImageUrl"
    >,
  ) {
    const businessIds = user.business?.businessIds ?? [];
    if (businessIds.length === 0) return;
    const email = getValidEmail(user.email);

    const memberRefs = businessIds.map((businessId) =>
      this.memberDocument(businessId, user.id),
    );
    const memberSnapshots = await db().getAll(...memberRefs);
    const changedMemberRefs = memberSnapshots
      .filter((snapshot) => {
        if (!snapshot.exists) return false;

        const member = snapshot.data() as MemberData;
        return (
          member.name !== user.name ||
          member.email !== email ||
          member.profileImageUrl !== user.profileImageUrl
        );
      })
      .map((snapshot) => snapshot.ref);

    if (changedMemberRefs.length === 0) return;

    const batch = db().batch();
    const updatedAt = getUTCTimeNow();
    changedMemberRefs.forEach((memberRef) => {
      batch.set(
        memberRef,
        {
          email,
          name: user.name,
          profileImageUrl: user.profileImageUrl,
          updatedAt,
        },
        { merge: true },
      );
    });
    await batch.commit();
  }

  private static invitationDocument(businessId: string, email: string) {
    const invitationId = createHash("sha256")
      .update(getValidEmail(email))
      .digest("hex");
    return this.invitationDocumentById(businessId, invitationId);
  }

  private static invitationDocumentById(
    businessId: string,
    invitationId: string,
  ) {
    return this.businessDocument(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.memberInvitations)
      .doc(invitationId);
  }

  private static memberDocument(businessId: string, memberId: string) {
    return this.businessDocument(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.members)
      .doc(memberId);
  }

  private static businessDocument(businessId: string) {
    return db().collection(COLLECTIONS.business).doc(businessId);
  }
}
