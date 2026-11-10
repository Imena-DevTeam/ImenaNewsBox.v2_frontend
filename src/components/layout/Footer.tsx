import { FOOTER_NAV } from "@/constants/nav";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  FAMILY_FOUNDED,
} from "@/constants/site";
import {
  FOOTER_LEGAL,
  FooterColumn,
  FooterFrame,
  FooterLink,
} from "./FooterFrame";

export function Footer() {
  return (
    <FooterFrame
      intro={
        <p>
          The IMENA family&rsquo;s home online: the tree, the photographs and
          the stories of every promotion since {FAMILY_FOUNDED}.
        </p>
      }
      columns={FOOTER_NAV.map((group) => (
        <FooterColumn key={group.heading} heading={group.heading}>
          {group.items.map((item) => (
            <FooterLink key={item.label} href={item.href} label={item.label} />
          ))}
        </FooterColumn>
      ))}
      bottomStart={
        <p>
          &copy; {new Date().getFullYear()} IMENA Family. All rights reserved.
        </p>
      }
      bottomEnd={
        <a href={CONTACT_EMAIL_HREF} className={FOOTER_LEGAL}>
          {CONTACT_EMAIL}
        </a>
      }
    />
  );
}
