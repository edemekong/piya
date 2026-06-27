import type { UserData } from "../models/user";

type UserRoleType = "owner" | "admin" | "manager";
type UserGenderType = "male" | "female" | "other";
type MiniUserData = Pick<UserData, "id" | "email" | "profileImageUrl">;

export type { UserRoleType, UserGenderType, MiniUserData };
