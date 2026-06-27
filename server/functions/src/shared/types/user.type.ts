import type { UserData } from "../model/user";

type UserRoleType = "owner" | "admin" | "manager";
type UserGenderType = "male" | "female" | "other";
type MiniUserData = Pick<UserData, "id" | "email" | "profileImageUrl">;

export { UserRoleType, UserGenderType, MiniUserData };
