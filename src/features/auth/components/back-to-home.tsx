import Image from "next/image";
import Link from "next/link";

/** White pill with a back arrow that returns to the landing page. */
export function BackToHome() {
  return (
    <Link
      href="/"
      className="inline-flex h-12 w-[186px] items-center gap-2.5 rounded-[32px] border border-black bg-white pl-[23px] text-xl text-black transition-colors hover:bg-neutral-50"
    >
      <Image src="/icons/arrow-left.svg" alt="" width={24} height={24} />
      Back To Home
    </Link>
  );
}
