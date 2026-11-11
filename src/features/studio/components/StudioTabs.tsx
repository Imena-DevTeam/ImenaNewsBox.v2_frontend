import { SectionTabs } from "@/components/ui/SectionTabs";
import { STUDIO_TABS } from "@/constants/nav";
import { ROUTES } from "@/constants/routes";

/** The blogger's three pages: what needs doing, the posts, the albums. */
export function StudioTabs() {
  return (
    <SectionTabs
      label="Studio sections"
      tabs={STUDIO_TABS}
      rootHref={ROUTES.STUDIO}
    />
  );
}
