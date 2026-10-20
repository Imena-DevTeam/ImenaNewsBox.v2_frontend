import Image from "next/image";
import Link from "next/link";

type AuthShellProps = {
  /** Heading lines, each on its own line. */
  title: string[];
  children: React.ReactNode;
};

/**
 * Auth page layout: a white page with the form column on the left and a
 * blob-cut family photo near the top right. The photo and the lavender
 * hearts / house outlines only show on desktop.
 */
export function AuthShell({ title, children }: AuthShellProps) {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-white px-6 py-6 sm:px-10 lg:px-[45px] lg:py-[45px]">
      <div aria-hidden="true" className="pointer-events-none hidden lg:block">
        {/* Centred in the space right of the form column (45px gutter + 11%
            inset + 343px column), so it drifts toward the middle on wide
            screens instead of hugging the right edge. */}
        <Image
          src="/images/auth-blob.png"
          alt=""
          width={1036}
          height={1008}
          sizes="523px"
          priority
          draggable={false}
          className="absolute top-2 left-[calc(55.5%-72px)] h-auto w-[523px] select-none"
        />
        <Image
          src="/images/hearts.svg"
          alt=""
          width={90.29}
          height={81.4}
          className="absolute top-[18%] left-[2.7%]"
        />
        <div className="absolute right-0 bottom-0.5 flex size-[171px] items-center justify-center">
          <Image
            src="/images/house.svg"
            alt=""
            width={149.19}
            height={155.46}
            className="-rotate-[21.56deg]"
          />
        </div>
      </div>

      <Link
        href="/"
        className="group focus-visible:ring-brand rounded-pill relative z-10 inline-flex h-12 items-center gap-3 self-start border border-black bg-white px-[22px] text-xl text-black transition-colors duration-300 ease-out hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Image
          src="/icons/arrow-back.svg"
          alt=""
          width={14}
          height={13.59}
          className="transition-[filter] duration-300 ease-out group-hover:invert"
        />
        Back To Home
      </Link>

      <div className="relative flex flex-1 items-center py-10 lg:py-6 lg:pl-[11%]">
        <div className="mx-auto w-full max-w-[343px] lg:mx-0">
          <h1 className="font-heading motion-safe:animate-rise text-[36px] leading-[1.22] font-bold text-black">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="motion-safe:animate-rise mt-8 [animation-delay:90ms]">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
