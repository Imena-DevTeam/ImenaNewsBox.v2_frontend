import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Members will sign in here to reach the family tree, the gallery and the archives.",
};

export default function LoginPage() {
  return (
    <ComingSoon
      title="Log in"
      description="Members will sign in here to reach the family tree, the gallery and the archives."
    />
  );
}
