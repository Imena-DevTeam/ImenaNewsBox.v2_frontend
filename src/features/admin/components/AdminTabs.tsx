import { SectionTabs } from "@/components/ui/SectionTabs";
import { ADMIN_TABS } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";

/** The administrator's two pages: what needs doing, and the register. */
export function AdminTabs() {
  return (
    <SectionTabs
      label="Admin sections"
      tabs={ADMIN_TABS}
      rootHref={ROUTES.ADMIN}
    />
  );
}
