import Image from "next/image";
import { BackToHome } from "./back-to-home";

/**
 * Two-column auth layout from the Figma auth screens: the form column on the
 * left under the logo and "Back To Home" pill, the family photo top-right and
 * a faint house mark below it.
 *
 * The page is locked to the viewport (no scrolling), so vertical gaps use the
 * Figma values as a ceiling and shrink with the viewport height.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex h-dvh overflow-hidden bg-white">
      <div className="relative z-10 flex w-full flex-col px-6 pt-[clamp(16px,5dvh,49px)] pb-[clamp(16px,4dvh,48px)] sm:px-8 lg:w-[540px] lg:shrink-0 lg:pr-8 lg:pl-7 [@media(max-height:720px)]:pt-6">
        {/* The hearts artwork overflows its 83x81 slot by ~3.5px per side. */}
        <Image
          src="/images/logo.svg"
          alt="IMENA Family Times"
          width={90.27}
          height={88.47}
          className="ml-[12.5px] aspect-[90.27/88.47] h-[clamp(48px,9dvh,88.47px)] w-auto self-start [@media(max-height:720px)]:h-12"
          priority
        />

        <div className="mt-[clamp(12px,3dvh,30px)] -ml-[7px]">
          <BackToHome />
        </div>

        <div className="mt-[clamp(16px,4.5dvh,46px)] w-full max-w-[403px]">
          {children}
        </div>
      </div>

      {/* 700px wide at the 1024px design width; grows on larger screens but
          never taller than ~78% of the viewport. */}
      <div className="pointer-events-none absolute top-0 right-0 hidden w-[min(calc(100vw_-_324px),calc(78dvh*700/572))] lg:block">
        <Image
          src="/images/auth-photo.png"
          alt=""
          width={700}
          height={572}
          sizes="(min-width: 1024px) 60vw, 0px"
          className="h-auto w-full"
          priority
        />
        <Image
          src="/images/house.svg"
          alt=""
          width={151.04}
          height={153.65}
          className="absolute top-[97.7%] right-[5%] h-auto w-[21.6%] -rotate-[21deg]"
        />
      </div>
    </main>
  );
}
