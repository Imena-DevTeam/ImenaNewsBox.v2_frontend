import { Quote } from "@/components/ui/Quote";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cake, CalendarDays, Network, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { ROUTES } from "@/constants/routes";
import { getSubfamilyBySlug } from "@/features/families/data";
import { FAMILY_REGISTER } from "@/features/members/data";

type Params = { params: Promise<{ id: string }> };

/** Suspended people are kept in the register and out of the site. */
function findPerson(id: string) {
  const person = FAMILY_REGISTER.find((one) => one.id === id);
  return person && person.status !== "suspended" ? person : undefined;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const person = findPerson((await params).id);
  return { title: person?.fullName ?? "Family member" };
}

const ROLE_LABEL = {
  member: "Family member",
  blogger: "Family blogger",
  admin: "Administrator",
} as const;

function birthday(iso: string): string {
  /* Day and month only: a relative's age is theirs to share. */
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

/**
 * One relative: their branch, their birthday, when they joined, and the ways
 * on from here. What search, the birthdays and the tree can point at.
 *
 * No email address: members do not see each other's sign-in details. The
 * face is their portrait when the register has one, their initials if not.
 *
 * TODO: the members service, and a place in the tree once the tree data
 * carries register ids.
 */
export default async function PersonPage({ params }: Params) {
  const person = findPerson((await params).id);
  if (!person) notFound();

  const branch = getSubfamilyBySlug(person.branch);
  const facts = [
    {
      icon: Users,
      label: "Branch",
      value: branch ? (
        <Link
          href={`${ROUTES.FAMILIES}/${branch.slug}`}
          className="text-brand hover:underline"
        >
          {branch.name} family
        </Link>
      ) : (
        person.branch
      ),
    },
    {
      icon: Cake,
      label: "Birthday",
      value: person.bornOn ? birthday(person.bornOn) : "Not added yet",
    },
    {
      icon: CalendarDays,
      label: "In the register since",
      value: new Date(`${person.joinedOn}T00:00:00Z`).getUTCFullYear(),
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 pb-24">
      <PageHeader title="Family" as="p" />

      <section className="border-member-border bg-surface shadow-member flex flex-col items-center gap-6 rounded-lg border p-6 text-center sm:flex-row sm:p-10 sm:text-left">
        <PersonAvatar
          name={person.fullName}
          photo={person.photo}
          sizes="7rem"
          className="text-h2 size-28"
        />
        <div className="min-w-0">
          <p className="text-caption text-brand font-semibold">
            {ROLE_LABEL[person.role]}
          </p>
          <h1 className="text-h1-m md:text-h1 text-member-ink mt-1">
            {person.fullName}
          </h1>
          {branch ? (
            <Quote
              meaning={branch.mottoMeaning}
              cite={`The ${branch.name} motto`}
              className="mt-4"
            >
              {branch.motto}
            </Quote>
          ) : null}
        </div>
      </section>

      <dl className="grid gap-4 sm:grid-cols-3">
        {facts.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="border-member-border bg-surface flex items-center gap-3 rounded-md border p-4"
          >
            <span className="bg-member-tint text-brand grid size-10 shrink-0 place-items-center rounded-md">
              <Icon aria-hidden className="size-5" />
            </span>
            <div className="min-w-0">
              <dt className="text-caption text-muted">{label}</dt>
              <dd className="text-body-sm text-member-ink font-semibold">
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href={ROUTES.TREE} variant="outline">
          <Network aria-hidden className="size-4" />
          See the family tree
        </ButtonLink>
        <ButtonLink href={ROUTES.BIRTHDAYS} variant="outline">
          <Cake aria-hidden className="size-4" />
          Family birthdays
        </ButtonLink>
      </div>
    </div>
  );
}
