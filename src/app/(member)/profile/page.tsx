import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { endMemberSession } from "@/app/actions/session";
import { loadDevices, loadMyAccount } from "@/app/(member)/_lib/my-account";
import { getSubfamilyBySlug } from "@/features/families/data";
import { FAMILY_MOTTO, FAMILY_MOTTO_MEANING } from "@/constants/site";
import { ProfileView } from "@/features/profile/components/ProfileView";

export const metadata: Metadata = {
  title: "Family Profile",
  description: "Your details, your photograph and your signed-in devices.",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const [{ edit }, account, devices] = await Promise.all([
    searchParams,
    loadMyAccount(),
    loadDevices(),
  ]);

  /* The member layout has already turned away anybody without a session,
     so no account here means the backend stopped answering between the
     two: the error boundary says so and offers to try again. */
  if (!account) throw new Error("The account could not be loaded.");

  /* The official motto of the member's own branch, or the family's own
     when the branch is not known. Set by the family, never by the member. */
  const branch = getSubfamilyBySlug(account.branch);

  async function signOut() {
    "use server";
    await endMemberSession();
    redirect(ROUTES.LOGIN);
  }

  return (
    <ProfileView
      account={account}
      devices={devices}
      onSignOut={signOut}
      startEditing={edit === "1"}
      motto={branch?.motto ?? FAMILY_MOTTO}
      mottoMeaning={branch?.mottoMeaning ?? FAMILY_MOTTO_MEANING}
      branch={branch?.name}
      now={new Date().toISOString()}
    />
  );
}
