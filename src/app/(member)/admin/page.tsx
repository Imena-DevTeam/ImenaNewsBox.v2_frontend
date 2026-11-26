import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { PageHeader } from "@/components/layout/PageHeader";
import { requireViewer } from "@/lib/viewer";
import { ROUTES } from "@/constants/routes";
import { ActivityList } from "@/features/admin/components/ActivityList";
import { AdminBoard } from "@/features/admin/components/AdminBoard";
import { AdminTabs } from "@/features/admin/components/AdminTabs";
import { AttentionQueue } from "@/features/admin/components/AttentionQueue";
import { SearchField } from "@/components/layout/SearchField";
import { ResetRequests } from "@/features/admin/components/ResetRequests";
import { ACTIVITY, attentionItems } from "@/features/admin/data";
import { TRINITY } from "@/features/families/data";
import { countByBranch } from "@/features/members/data";
import { loadRegister } from "./_lib/register";
import { loadResetRequests } from "./_lib/reset-requests";

export const metadata: Metadata = {
  title: "Admin",
  description: "What needs doing, and what has been done.",
};

export default async function AdminPage() {
  const { id, person } = await requireViewer();

  /* The register, read once for the queue and the counts; and the
     administrators who cannot get in. That band is the other half of
     /admin/forgot-password: the family's answer to a lost password is
     another administrator rather than an inbox. */
  const [register, resets] = await Promise.all([
    loadRegister(id),
    loadResetRequests(),
  ]);

  /* Deactivated people are kept in the register and out of the family:
     nobody has to fill in their birthday, and they are not counted. */
  const present =
    register?.people.filter((one) => one.status !== "deactivated") ?? [];
  const waiting = attentionItems(present);

  /* Fixed at render on the server and handed down, so the server and the
     client agree what "2 hours ago" means. */
  const now = new Date().toISOString();

  /* The counts, demoted: a quiet strip, not the headline. Posts and albums
     are gone with the rest of that work; what is left is the register, read
     a branch at a time, because that is the shape an administrator is asked
     about. Each number comes from the register itself, never from
     TRINITY[].members, or the two disagree the moment somebody is added. */
  const byBranch = countByBranch(present);
  const counts = TRINITY.map((family) => ({
    label: family.name,
    value: byBranch[family.slug] ?? 0,
    href: `${ROUTES.ADMIN_MEMBERS}?branch=${family.slug}`,
  }));

  return (
    <div className="section-enter min-w-0 pb-12">
      <PageHeader title="ADMIN" />
      <span aria-hidden className="accent-bar bg-brand mt-3" />

      <div className="mt-6">
        <AdminTabs />
      </div>

      {/* Band one: who you are, then the three things you came to do. */}
      <p className="text-body-sm text-muted mt-6 text-pretty">
        Signed in as{" "}
        <span className="text-member-ink font-medium">{person.name}</span> ·{" "}
        {person.role}
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* One action, not three. Writing a post and creating an album were
            two thirds of this row and neither is the administrator's job. */}
        <ButtonLink variant="brand" size="md" href={ROUTES.ADMIN_MEMBER_NEW}>
          <UserPlus aria-hidden className="size-4" />
          Add a member
        </ButtonLink>
        <div className="min-w-0 flex-1">
          <SearchField />
        </div>
      </div>

      {/* Bands two and three, as panels the admin can rearrange: what is
          waiting, and what has been done. */}
      <div className="mt-10 md:mt-14">
        <AdminBoard
          bands={[
            {
              id: "attention",
              heading: "Needs attention",
              note:
                waiting.length > 0 ? `${waiting.length} waiting` : undefined,
              body: (
                <AttentionQueue
                  items={waiting}
                  emptyDescription={
                    register
                      ? "Everybody has a date of birth, and nobody is still waiting on an invitation."
                      : "The register could not be loaded, so nothing can be checked. Reload the page in a moment."
                  }
                />
              ),
            },
            {
              id: "activity",
              heading: "Recent activity",
              body: <ActivityList entries={ACTIVITY} now={now} />,
            },
            {
              id: "resets",
              heading: "Password resets",
              note: resets?.length ? `${resets.length} waiting` : undefined,
              body: <ResetRequests requests={resets} now={now} />,
            },
          ]}
        />
      </div>

      {/* The counts, last and quiet, and absent rather than zero when the
          register could not be read. */}
      {register ? (
        <section aria-labelledby="admin-counts" className="mt-10 md:mt-14">
          <h2 id="admin-counts" className="sr-only">
            The register, by branch
          </h2>
          <ul className="border-member-border divide-member-border bg-member-panel flex flex-col divide-y rounded-md border sm:flex-row sm:divide-x sm:divide-y-0">
            {counts.map((count) => (
              <li key={count.label} className="flex-1">
                <Link
                  href={count.href}
                  className="focus-visible:outline-brand hover:bg-member-tint transition-fast flex flex-col items-center gap-1 px-5 py-7"
                >
                  {/* The figure climbs to itself once, when the strip is
                    scrolled to. Still no chart in here: a number that moves
                    is text, and it is the one sign this page is live rather
                    than a screenshot. Shorter than the public pages' climb,
                    because these are read rather than admired. */}
                  <CountUp
                    value={count.value}
                    durationMs={420}
                    className="text-h1-m text-member-ink font-bold"
                  />
                  <span className="text-caption text-muted tracking-widest uppercase">
                    {count.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
