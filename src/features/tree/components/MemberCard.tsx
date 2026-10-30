import Image from "next/image";
import type { Person } from "@/features/tree/data";
import { SubfamilyBadge } from "@/components/ui/SubfamilyBadge";

/** The role is set as a small outlined pill in the design. */
function Tag({ children }: { children: string }) {
  return (
    <span className="border-tree-edge/40 text-caption text-tree-role inline-flex w-fit rounded-sm border px-2 py-1">
      {children}
    </span>
  );
}

export function MemberCard({ member }: { member: Person }) {
  return (
    <article className="border-tree-edge/50 bg-tree-card lift flex gap-4 rounded-md border p-2.5 md:gap-5">
      {/* Inset from the card edge rather than bleeding into it. */}
      <Image
        src={member.photo}
        alt={member.name}
        placeholder="blur"
        sizes="13rem"
        className="w-28 shrink-0 self-stretch rounded-sm object-cover sm:w-36 md:w-44"
      />

      <div className="flex flex-col justify-center gap-2.5 py-3 pr-3">
        <h4 className="text-h4-m md:text-h4 text-tree-ink">{member.name}</h4>

        <div className="flex flex-wrap items-center gap-2">
          <Tag>{member.role}</Tag>
          <SubfamilyBadge subfamily={member.subfamily} />
        </div>

        <blockquote className="border-border text-body-sm text-tree-quote mt-1 border-l-2 pl-3">
          &ldquo;{member.saying}&rdquo;
        </blockquote>
      </div>
    </article>
  );
}
