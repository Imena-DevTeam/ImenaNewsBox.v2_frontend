import Image from "next/image";
import { Ellipsis, ImageIcon, MonitorPlay } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ROUTES } from "@/constants/routes";

const HANDOVERS = [
  {
    title: "Fete 2025-2026:",
    image: "/images/handover-1.webp",
    alt: "Family members in front of a green and blue balloon arch",
  },
  {
    title: "Fete 2025-2024:",
    image: "/images/handover-2.webp",
    alt: "Family members celebrating under gold letter balloons",
  },
  {
    title: "Fete 2024-2023:",
    image: "/images/handover-3.webp",
    alt: "Family members together at an evening celebration",
  },
];

const BODY =
  "This was filled with joy, gratitude and gratefullness. Celebrating for the coming new year.";

export function RecentHandovers() {
  return (
    <section className="bg-band section-y">
      <Container>
        <div className="relative">
          <SectionTitle title="Recent Handovers" />

          {/* The album buttons pop in one after another beside the title. */}
          <Stagger
            stagger={0.08}
            delay={0.3}
            className="mt-8 flex justify-center gap-4 md:absolute md:top-0 md:right-0 md:mt-0"
          >
            <StaggerItem from="none" scale={0.6}>
              <IconCircle label="Photo albums">
                <ImageIcon className="size-5" />
              </IconCircle>
            </StaggerItem>
            <StaggerItem from="none" scale={0.6}>
              <IconCircle label="Video albums">
                <MonitorPlay className="size-5" />
              </IconCircle>
            </StaggerItem>
            <StaggerItem from="none" scale={0.6}>
              <IconCircle label="More albums">
                <Ellipsis className="size-5" />
              </IconCircle>
            </StaggerItem>
          </Stagger>
        </div>

        {/* The cards slide in from the right one after another, so the row
            assembles in reading order with the last card arriving last. */}
        <Stagger
          as="ul"
          stagger={0.15}
          className="mt-12 grid gap-8 md:grid-cols-3"
        >
          {HANDOVERS.map((item) => (
            <StaggerItem key={item.title} as="li" from="right" distance={80}>
              {/* The photo fills the card and the copy panel overlaps it.
                  The card tips toward the pointer, the photo leans in, and
                  the panel rises a little to meet the hand. */}
              <TiltCard className="group shadow-main transition-base hover:shadow-menu overflow-hidden rounded-md">
                <div className="img-zoom">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    width={426}
                    height={367}
                    className="h-110 w-full object-cover"
                  />
                </div>

                <div className="bg-surface transition-base absolute inset-x-0 bottom-0 mr-8 rounded-tr-md p-5 motion-safe:group-hover:-translate-y-1">
                  <p className="text-body">
                    <span className="text-h4 text-text">{item.title}</span>{" "}
                    <span className="text-primary">{BODY}</span>
                  </p>

                  <ButtonLink href={ROUTES.GALLERY} size="sm" className="mt-5">
                    View Album
                  </ButtonLink>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

function IconCircle({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={ROUTES.GALLERY}
      aria-label={label}
      /* The icon gives a small turn and swell as the circle fills. */
      className="rounded-pill border-primary text-primary hover:bg-primary hover:text-surface transition-base [&_svg]:transition-base flex size-14 items-center justify-center border motion-safe:active:scale-95 motion-safe:hover:[&_svg]:scale-115 motion-safe:hover:[&_svg]:-rotate-12"
    >
      {children}
    </a>
  );
}
