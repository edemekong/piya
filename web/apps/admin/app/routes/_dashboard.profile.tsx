import type { MetaFunction } from "@remix-run/node";
import { ProfilePage } from "@/pages/profile";

export const meta: MetaFunction = () => [{ title: "Profile | Piya Admin" }];

export default ProfilePage;
