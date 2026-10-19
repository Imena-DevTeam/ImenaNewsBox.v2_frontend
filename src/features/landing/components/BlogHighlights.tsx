import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/constants/routes";

const POSTS = [
  {
    slug: "a-heart-warming-family-reunion",
    title: "A heart-warming family reunion:",
    excerpt:
      "This Family Reunion Serves As A Reminder Of The Importance Of Taking A Pause And Relishing The Company Of Those Who Matter Most.",
    image: "/images/blog-reunion.png",
    alt: "Family members at a remembrance ceremony lighting a flame",
  },
  {
    slug: "a-heart-warming-family-reunion-2",
    title: "A heart-warming family reunion:",
    excerpt:
      "This Family Reunion Serves As A Reminder Of The Importance Of Taking A Pause And Relishing The Company Of Those Who Matter Most.",
    image: "/images/blog-reunion.png",
    alt: "Family members gathered around a memorial flame",
  },
  {
    slug: "a-heart-warming-family-reunion-3",
    title: "A heart-warming family reunion:",
    excerpt:
      "Through Family Gatherings, Mentorship, Celebrations, And Shared Experiences, We Strengthen The Relationships That Connect Us.",
    image: "/images/blog-reunion.png",
    alt: "Family members standing together at a commemoration",
  },
];

export function BlogHighlights() {
  return (
    <section className="section-y">
      <Container>
        <SectionTitle title="Blogs and Posts" />

        <ul className="reveal-stagger mt-12 space-y-16 md:space-y-10">
          {POSTS.map((post, index) => {
            /* The design alternates which side the photo sits on. */
            const reversed = index % 2 === 1;

            return (
              <li
                key={post.slug}
                className="grid items-center gap-8 md:grid-cols-2 md:gap-16"
              >
                <Image
                  src={post.image}
                  alt={post.alt}
                  width={517}
                  height={296}
                  className={cn(
                    "w-full rounded-md object-cover",
                    reversed && "md:order-2",
                  )}
                />

                <div className={cn(reversed && "md:order-1")}>
                  <h3 className="text-h4-m text-text md:text-h4 tracking-wide uppercase">
                    {post.title}
                  </h3>
                  <p className="text-body text-muted mt-5">{post.excerpt}</p>

                  <Link
                    href={`${ROUTES.BLOGS}/${post.slug}`}
                    className="text-ui text-primary transition-base mt-7 inline-flex items-center gap-3 hover:gap-4"
                  >
                    Read More
                    <ArrowRight className="size-5" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
