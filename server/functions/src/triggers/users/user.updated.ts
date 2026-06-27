import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { type CriticalUserField, type UserData } from "../../shared/model/user";
import { BusinessTeamService } from "../../shared/services/team.service";
import { hasChangedFields } from "../../shared/utils/helpers/helper-functions";

const memberProfileFields = [
  "name",
  "email",
  "profileImageUrl",
] as const satisfies readonly CriticalUserField[];

export const onUserProfileUpdated = onDocumentUpdated(
  "users/{userId}",
  async (event) => {
    const before = event.data?.before.data() as UserData | undefined;
    const user = event.data?.after.data() as UserData | undefined;

    if (!before || !user) return true;

    const memberProfileChanged = hasChangedFields<UserData>(
      before,
      user,
      memberProfileFields,
    );

    if (memberProfileChanged) {
      await BusinessTeamService.updateMemberProfiles(user);
    }

    return true;
  },
);
