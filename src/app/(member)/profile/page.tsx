import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { endMemberSession } from "@/app/actions/session";
import { ProfileView } from "@/features/profile/components/ProfileView";

export const metadata: Metadata = {
  title: "Family Profile",
  description: "Your place in the family tree, details and settings.",
};

export default function ProfilePage() {
  async function signOut() {
    "use server";
    await endMemberSession();
    redirect(ROUTES.LOGIN);
  }

  return <ProfileView onSignOut={signOut} />;
}
