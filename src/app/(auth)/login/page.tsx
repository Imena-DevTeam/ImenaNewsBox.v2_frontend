import type { Metadata } from "next";
import { HouseHeartOrnament } from "@/features/story/components/Ornaments";
import { BackToHome, LoginForm, LoginPhoto } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to the IMENA family platform.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string }>;
}) {
  /* The navbar offers "As Admin" and "As a member"; the greeting follows. */
  const { as } = await searchParams;
  const audience = as === "member" ? "Member" : "Admin";

  return (
    <div className="page-enter relative overflow-hidden">
      <HouseHeartOrnament className="pointer-events-none absolute right-8 bottom-8 hidden w-28 md:block lg:w-36" />

      <div className="relative grid min-h-dvh items-center gap-12 px-6 py-10 md:px-10 lg:grid-cols-2 lg:gap-8">
        <div className="absolute top-10 left-6 md:left-10">
          <BackToHome />
        </div>

        <LoginForm audience={audience} />

        <LoginPhoto className="order-first lg:order-none" />
      </div>
    </div>
  );
}
