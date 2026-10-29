import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Calendar,
  FileText,
  Heart,
  LogOut,
  MapPin,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { MEMBER } from "@/constants/member";
import { ROUTES } from "@/constants/routes";
import { elder3 } from "@/lib/images";
import { endMemberSession } from "@/app/actions/session";

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

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 pb-24">
      <PageHeader title="PROFILE" subtitle="Your Family Identity & Records" />

      {/* Main Identity Banner */}
      <section className="border-border bg-surface shadow-subtle relative overflow-hidden rounded-2xl border p-6 md:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
          {/* Avatar with branch ring */}
          <div className="relative shrink-0">
            <div className="border-wihogora-edge/60 ring-wihogora-tint relative size-24 overflow-hidden rounded-full border-2 ring-4 sm:size-28">
              <Image
                src={elder3}
                alt={`${MEMBER.name}'s profile photograph`}
                fill
                sizes="112px"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -right-1 -bottom-1">
              <VerifiedBadge />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-h3 text-heading font-serif font-bold tracking-tight">
                {MEMBER.name} Christian
              </h2>
              <span className="border-wihogora-edge bg-wihogora-tint text-wihogora-ink inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold">
                Subfamily {MEMBER.subfamily}
              </span>
              <span className="border-border bg-surface-elevated text-muted inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                <ShieldCheck
                  aria-hidden
                  className="size-3.5 text-emerald-600"
                />
                Active Member
              </span>
            </div>

            <p className="text-body text-muted flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1">
                <UserCheck aria-hidden className="text-muted size-4" />
                {MEMBER.role}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar aria-hidden className="text-muted size-4" />
                Promotion 2019–2020
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin aria-hidden className="text-muted size-4" />
                Huye Chapter
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Grid: Lineage & Membership Info + Activity Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Family Lineage & Registry */}
        <section className="border-border bg-surface shadow-subtle flex flex-col gap-5 rounded-2xl border p-6">
          <h3 className="text-h4 text-heading border-b pb-3 font-serif font-semibold">
            Lineage & Records
          </h3>

          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div className="border-border bg-surface-elevated rounded-xl border p-3">
              <dt className="text-muted text-xs font-medium tracking-wider uppercase">
                Subfamily Branch
              </dt>
              <dd className="text-heading mt-1 font-semibold">
                {MEMBER.subfamily}
              </dd>
              <dd className="text-muted text-xs">Comfort &amp; Unity</dd>
            </div>

            <div className="border-border bg-surface-elevated rounded-xl border p-3">
              <dt className="text-muted text-xs font-medium tracking-wider uppercase">
                Promotion Cohort
              </dt>
              <dd className="text-heading mt-1 font-semibold">2019–2020</dd>
              <dd className="text-muted text-xs">Generation 24</dd>
            </div>

            <div className="border-border bg-surface-elevated rounded-xl border p-3">
              <dt className="text-muted text-xs font-medium tracking-wider uppercase">
                Origin Campus
              </dt>
              <dd className="text-heading mt-1 font-semibold">
                Univ. of Rwanda
              </dd>
              <dd className="text-muted text-xs">Huye, Southern Province</dd>
            </div>

            <div className="border-border bg-surface-elevated rounded-xl border p-3">
              <dt className="text-muted text-xs font-medium tracking-wider uppercase">
                Registry ID
              </dt>
              <dd className="text-brand mt-1 font-mono text-xs font-bold">
                IMN-2019-HUYE-042
              </dd>
              <dd className="text-muted text-xs">Verified in 2019</dd>
            </div>
          </dl>
        </section>

        {/* Member Activity Summary */}
        <section className="border-border bg-surface shadow-subtle flex flex-col gap-5 rounded-2xl border p-6">
          <h3 className="text-h4 text-heading border-b pb-3 font-serif font-semibold">
            Member Activity
          </h3>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="border-border bg-surface-elevated flex flex-col items-center justify-center rounded-xl border p-4">
              <Heart className="size-5 text-rose-500" aria-hidden />
              <span className="text-heading mt-2 font-serif text-2xl font-bold">
                18
              </span>
              <span className="text-muted text-xs">Wishes Sent</span>
            </div>

            <div className="border-border bg-surface-elevated flex flex-col items-center justify-center rounded-xl border p-4">
              <FileText className="text-brand size-5" aria-hidden />
              <span className="text-heading mt-2 font-serif text-2xl font-bold">
                12
              </span>
              <span className="text-muted text-xs">Stories Saved</span>
            </div>

            <div className="border-border bg-surface-elevated flex flex-col items-center justify-center rounded-xl border p-4">
              <Calendar className="size-5 text-amber-500" aria-hidden />
              <span className="text-heading mt-2 font-serif text-2xl font-bold">
                7
              </span>
              <span className="text-muted text-xs">Gazettes Read</span>
            </div>
          </div>

          <div className="border-border/60 bg-surface-elevated text-muted rounded-xl border p-4 text-xs">
            <p>
              Your membership contributes to the preserved memories and archival
              heritage of the IMENA family across generations.
            </p>
          </div>
        </section>
      </div>

      {/* Account Settings & Sign Out */}
      <section className="border-border bg-surface shadow-subtle flex flex-col items-start justify-between gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-heading font-serif text-base font-semibold">
            Session &amp; Device
          </h3>
          <p className="text-muted text-xs">
            Signed in securely as {MEMBER.name}. Signing out removes the session
            from this browser.
          </p>
        </div>

        <form action={signOut}>
          <Button
            type="submit"
            variant="outline"
            className="border-border hover:bg-surface-elevated min-h-[44px] text-rose-600 hover:text-rose-700"
          >
            <LogOut aria-hidden className="size-4" />
            Sign out of this device
          </Button>
        </form>
      </section>
    </div>
  );
}
