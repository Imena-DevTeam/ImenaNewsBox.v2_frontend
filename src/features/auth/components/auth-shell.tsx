import Image from "next/image";
import { BackToHome } from "./back-to-home";

/**
 * Two-column auth layout from the Figma auth screens: the form column on the
 * left under the logo and "Back To Home" pill, artwork filling the right.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-dvh bg-white">
      <div className="relative z-10 flex w-full flex-col px-6 pt-5 pb-12 sm:px-8 lg:w-[540px] lg:shrink-0 lg:pr-8 lg:pl-[34px]">
        <Image
          src="/images/logo.svg"
          alt="IMENA Family Times"
          width={83}
          height={83}
          priority
        />

        <div className="mt-[30px]">
          <BackToHome />
        </div>

        <div className="mt-[46px] w-full max-w-[403px]">{children}</div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[700px] max-w-[70%] lg:block">
        <Image
          src="/images/auth-illustration.svg"
          alt=""
          fill
          className="object-cover object-left"
          priority
        />
      </div>
    </main>
  );
}
