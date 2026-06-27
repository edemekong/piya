import { onDocumentWritten } from "firebase-functions/v2/firestore";
import type { MemberData } from "../../shared/model/business";
import { BusinessTeamService } from "../../shared/services/team.service";
import { hasChangedFields } from "../../shared/utils/helpers/helper-functions";

const userMembershipFields = ["role"] as const;

export const onBusinessMemberWritten = onDocumentWritten(
  "business/{businessId}/members/{memberId}",
  async (event) => {
    const beforeSnapshot = event.data?.before;
    const afterSnapshot = event.data?.after;

    const memberIsCreated =
      beforeSnapshot?.exists === false && afterSnapshot?.exists === true;

    const memberIsUpdated =
      beforeSnapshot?.exists === true && afterSnapshot?.exists === true;

    const memberIsDeleted =
      beforeSnapshot?.exists === true && afterSnapshot?.exists === false;

    const beforeMember = beforeSnapshot?.exists
      ? (beforeSnapshot.data() as MemberData)
      : null;

    const member = afterSnapshot?.exists
      ? (afterSnapshot.data() as MemberData)
      : null;

    if (memberIsDeleted) {
      await BusinessTeamService.removeUserMembership(
        event.params.businessId,
        event.params.memberId,
      );
    }


    if (member && beforeMember && (memberIsCreated || memberIsUpdated)) {
      const userMembershipChanged = hasChangedFields<MemberData>(
        beforeMember,
        member,
        userMembershipFields,
      );

      if (userMembershipChanged) {
        await BusinessTeamService.updateUserMembership(member);
      }
    }

    return true;
  },
);
