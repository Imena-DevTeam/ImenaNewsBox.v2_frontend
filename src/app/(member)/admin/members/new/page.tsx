import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdminTabs } from "@/features/admin/components/AdminTabs";
import { MembersTable } from "@/features/admin/components/MembersTable";
import { FAMILY_REGISTER } from "@/features/members/data";

export const metadata: Metadata = {
  title: "Add Family Member",
  description: "Add someone to the family register.",
};

/**
 * The register with the panel already open.
 *
 * Adding somebody is not a page of its own: it is the same form the edit
 * uses, over the same list, so an administrator adding three relatives never
 * leaves the register. This route exists because links to it do, and because
 * the tab row should not grow a tab for a dialog.
 */
export default function AdminNewMemberPage() {
  return (
    <div className="section-enter min-w-0 pb-12">
      <PageHeader title="MEMBERS" />
      <span aria-hidden className="accent-bar bg-brand mt-3" />
      <p className="text-body-sm text-muted mt-2">
        Add someone to the register
      </p>

      <div className="mt-6">
        <AdminTabs />
      </div>

      <div className="mt-8">
        <MembersTable people={FAMILY_REGISTER} initialAdd />
      </div>
    </div>
  );
}
