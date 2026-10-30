"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, Send, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

const PROMOTIONS = [
  "2023–2024",
  "2022–2023",
  "2021–2022",
  "2020–2021",
  "2019–2020",
  "2018–2019",
  "2017–2018",
  "2016–2017",
  "2015–2016",
  "Founding Generation (1996–2005)",
  "Family Descendant / Elder",
];

const BRANCHES = [
  "Sanctuary (Uruhisho)",
  "Light (Umurinzi)",
  "Wihogora (Humura)",
  "Hope (Icyizere)",
  "Not yet allocated / Inquire",
];

export default function JoinasaMemberPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API registration request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-bg min-h-screen py-16 md:py-24">
      <Container className="max-w-2xl">
        <Link
          href={ROUTES.HOME}
          className="text-muted hover:text-heading mb-8 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back to IMENA home
        </Link>

        <div className="border-border bg-surface shadow-subtle rounded-3xl border p-8 md:p-12">
          {submitted ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="mb-6 grid size-16 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="size-8" />
              </div>

              <h1 className="text-h2-m md:text-h2 text-heading font-serif font-bold">
                Request Submitted
              </h1>

              <p className="text-muted mt-3 max-w-md text-sm leading-relaxed">
                Murakoze. Your request to join the permanent IMENA family record
                has been received. An elder from your subfamily will verify your
                lineage details and send your access credentials.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href={ROUTES.HOME} variant="outline">
                  Return Home
                </ButtonLink>
                <ButtonLink href={ROUTES.LOGIN}>Go to Member Login</ButtonLink>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <span className="border-border bg-surface-elevated text-brand mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase">
                  <Sparkles className="size-3.5" aria-hidden />
                  Family Registry
                </span>
                <h1 className="text-h2-m md:text-h2 text-heading font-serif font-bold">
                  Request a Place in the Family Record
                </h1>
                <p className="text-muted mt-2 text-sm">
                  Add your name, university promotion cohort, and chapter
                  lineage to the permanent IMENA archive.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="full-name"
                      className="text-heading text-xs font-semibold"
                    >
                      Full Name *
                    </label>
                    <input
                      id="full-name"
                      name="fullName"
                      required
                      placeholder="e.g. Christian Aganze"
                      className="border-border bg-surface-elevated text-heading focus:border-brand rounded-xl border px-3.5 py-2.5 text-sm transition-all outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="email"
                      className="text-heading text-xs font-semibold"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@domain.com"
                      className="border-border bg-surface-elevated text-heading focus:border-brand rounded-xl border px-3.5 py-2.5 text-sm transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="promotion"
                      className="text-heading text-xs font-semibold"
                    >
                      Promotion Cohort *
                    </label>
                    <select
                      id="promotion"
                      name="promotion"
                      required
                      className="border-border bg-surface-elevated text-heading focus:border-brand rounded-xl border px-3.5 py-2.5 text-sm transition-all outline-none"
                    >
                      <option value="">Select your cohort...</option>
                      {PROMOTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="subfamily"
                      className="text-heading text-xs font-semibold"
                    >
                      Subfamily Branch *
                    </label>
                    <select
                      id="subfamily"
                      name="subfamily"
                      required
                      className="border-border bg-surface-elevated text-heading focus:border-brand rounded-xl border px-3.5 py-2.5 text-sm transition-all outline-none"
                    >
                      <option value="">Select branch...</option>
                      {BRANCHES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="text-heading text-xs font-semibold"
                  >
                    Family Connection &amp; Notes
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Mention your university chapter (e.g. UR Huye, UR Nyarugenge) or your elders."
                    className="border-border bg-surface-elevated text-heading focus:border-brand resize-none rounded-xl border px-3.5 py-2.5 text-sm transition-all outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-3 min-h-[46px] w-full"
                >
                  <Send className="size-4" aria-hidden />
                  {loading
                    ? "Submitting Request..."
                    : "Submit Registry Request"}
                </Button>

                <p className="text-muted text-center text-xs">
                  Already registered?{" "}
                  <Link
                    href={ROUTES.LOGIN}
                    className="text-brand font-medium hover:underline"
                  >
                    Sign in to your member portal
                  </Link>
                </p>
              </form>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
