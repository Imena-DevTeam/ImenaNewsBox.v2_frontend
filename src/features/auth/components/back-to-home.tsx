import Image from "next/image";
import Link from "next/link";

/** White pill with a back arrow that returns to the landing page. */
export function BackToHome() {
  return (
    <Link
      href="/"
      className="group focus-visible:ring-brand inline-flex h-12 w-[186px] items-center gap-3 rounded-[32px] border border-black bg-white pl-[22px] text-xl leading-[normal] text-black transition-colors duration-300 ease-out hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <Image
        src="/icons/arrow-left.svg"
        alt=""
        width={14}
        height={14}
        className="transition-[filter] duration-300 ease-out group-hover:invert"
      />
      Back To Home
    </Link>
  );
}
