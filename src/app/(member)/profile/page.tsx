import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { endMemberSession } from "@/app/actions/session";
import { signedInRecord } from "../_lib/signed-in-record";
import { getSubfamilyBySlug } from "@/features/families/data";
import { FAMILY_MOTTO, FAMILY_MOTTO_MEANING } from "@/constants/site";
import { ProfileView } from "@/features/profile/components/ProfileView";

export const metadata: Metadata = {
  title: "Family Profile",
  description: "Your place in the family tree, details and settings.",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const [{ edit }, record] = await Promise.all([
    searchParams,
    signedInRecord(),
  ]);

  /* The official motto of the member's own branch, or the family's own
     when the branch is not known. Set by the family, never by the member. */
  const branch = record ? getSubfamilyBySlug(record.branch) : undefined;

  async function signOut() {
    "use server";
    await endMemberSession();
    redirect(ROUTES.LOGIN);
  }

  return (
    <ProfileView
      onSignOut={signOut}
      startEditing={edit === "1"}
      registeredBornOn={record?.bornOn ?? ""}
      motto={branch?.motto ?? FAMILY_MOTTO}
      mottoMeaning={branch?.mottoMeaning ?? FAMILY_MOTTO_MEANING}
      branch={branch?.name}
    />
  );
}
