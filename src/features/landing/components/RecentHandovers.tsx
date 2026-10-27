import Image from "next/image";
import { Ellipsis, ImageIcon, MonitorPlay } from "lucide-react";
import { Container } from "@/components/layout/Container";
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

          <div className="mt-8 flex justify-center gap-4 md:absolute md:top-0 md:right-0 md:mt-0">
            <IconCircle label="Photo albums">
              <ImageIcon className="size-5" />
            </IconCircle>
            <IconCircle label="Video albums">
              <MonitorPlay className="size-5" />
            </IconCircle>
            <IconCircle label="More albums">
              <Ellipsis className="size-5" />
            </IconCircle>
          </div>
        </div>

        <ul className="reveal-stagger mt-12 grid gap-8 md:grid-cols-3">
          {HANDOVERS.map((item) => (
            <li
              key={item.title}
              /* The photo fills the card and the copy panel overlaps it. */
              className="shadow-main lift relative overflow-hidden rounded-md"
            >
              <Image
                src={item.image}
                alt={item.alt}
                width={426}
                height={367}
                className="h-110 w-full object-cover"
              />

              <div className="bg-surface absolute inset-x-0 bottom-0 mr-8 rounded-tr-md p-5">
                <p className="text-body">
                  <span className="text-h4 text-text">{item.title}</span>{" "}
                  <span className="text-primary">{BODY}</span>
                </p>

                <ButtonLink href={ROUTES.GALLERY} size="sm" className="mt-5">
                  View Album
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>
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
      className="rounded-pill border-primary text-primary hover:bg-primary hover:text-surface flex size-14 items-center justify-center border transition-colors"
    >
      {children}
    </a>
  );
}
