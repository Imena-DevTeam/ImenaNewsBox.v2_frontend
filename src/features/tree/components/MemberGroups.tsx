import { Container } from "@/components/layout/Container";
import { HeartsOrnament } from "@/features/story/components/Ornaments";
import { MemberCard } from "@/features/tree/components/MemberCard";
import { MEMBER_GROUPS } from "@/features/tree/data";

export function MemberGroups() {
  return (
    <div className="relative">
      <HeartsOrnament className="absolute top-0 right-4 hidden w-20 md:block md:w-24" />

      <Container className="relative pb-16 md:pb-24">
        {MEMBER_GROUPS.map((group) => (
          <section key={group.heading} className="mt-14 first:mt-12">
            <h3 className="text-h4-m md:text-h4 text-center">
              {group.heading}
            </h3>

            <div className="reveal-stagger mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-2">
              {group.members.map((member, i) => (
                <MemberCard key={i} member={member} />
              ))}
            </div>
          </section>
        ))}

        <hr className="border-border mx-auto mt-20 max-w-5xl border-t" />
      </Container>
    </div>
  );
}
