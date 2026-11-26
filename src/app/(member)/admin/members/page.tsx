import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdminTabs } from "@/features/admin/components/AdminTabs";
import { MembersTable } from "@/features/admin/components/MembersTable";
import { RegisterUnavailable } from "@/features/admin/components/RegisterUnavailable";
import { TRINITY } from "@/features/families/data";
import { requireViewer } from "@/lib/viewer";
import { loadRegister } from "@/app/(member)/admin/_lib/register";

export const metadata: Metadata = {
  title: "Members",
  description: "Everyone in the family register.",
};

/**
 * The register.
 *
 * Two links arrive here carrying a question: the attention queue and the
 * command palette send `?find=<id>`, and the overview's branch counts send
 * `?branch=<slug>`. The id is resolved to the person's name on the server so
 * the search box reads as a name rather than as an id, and so no address
 * ends up in a URL.
 */
export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ find?: string; branch?: string }>;
}) {
  const [{ find, branch }, viewer] = await Promise.all([
    searchParams,
    requireViewer(),
  ]);
  const register = await loadRegister(viewer.id);

  const asked = find
    ? register?.people.find((person) => person.id === find)
    : undefined;
  const chosen = TRINITY.some((family) => family.slug === branch)
    ? branch
    : undefined;

  return (
    <div className="section-enter min-w-0 pb-12">
      <PageHeader title="MEMBERS" />
      <span aria-hidden className="accent-bar bg-brand mt-3" />
      <p className="text-body-sm text-muted mt-2">
        Everyone in the family register
      </p>

      <div className="mt-6">
        <AdminTabs />
      </div>

      <div className="mt-8">
        {register ? (
          <MembersTable
            people={register.people}
            choices={register.choices}
            selfId={register.selfId}
            initialSearch={asked?.fullName}
            initialBranch={chosen}
          />
        ) : (
          <RegisterUnavailable />
        )}
      </div>
    </div>
  );
}
