/* The add panel opens over the register, so what loads is the register. */
import { MembersSkeleton } from "@/features/admin/components/AdminSkeleton";

export default function AdminNewMemberLoading() {
  return <MembersSkeleton />;
}
