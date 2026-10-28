import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { endMemberSession } from "@/app/actions/session";

export const metadata: Metadata = {
  title: "Family Profile",
  description: "Your place in the family tree, details and settings.",
};

/**
 * The profile page itself is still to come, but it is where the one thing
 * a signed-in member must always be able to do lives: leave.
 */
export default function ProfilePage() {
  async function signOut() {
    "use server";
    await endMemberSession();
    redirect(ROUTES.LOGIN);
  }

  return (
    <>
      <ComingSoon
        title="Family Profile"
        description="Your place in the family tree, details and settings."
      />

      <form action={signOut} className="-mt-10 pb-16 text-center">
        <Button type="submit" variant="outline">
          <LogOut aria-hidden className="size-4" />
          Sign out
        </Button>
      </form>
    </>
  );
}
