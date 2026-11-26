import type {
  Choice,
  Device,
  FamilyMember,
  MemberStatus,
  MyAccount,
  PublicPerson,
} from "@/types/member";
import type {
  PromotionRead,
  SessionRead,
  SubFamilyRead,
  UserPublicRead,
  UserRead,
} from "@/types/wire";

/**
 * The backend's people, in the shapes this frontend renders.
 *
 * Sub-families arrive as `{id, name: "HOPE"}`; the rest of the site knows
 * them by slug (`hope`), which is the name in lower case.
 */
export function branchSlug(subFamily: SubFamilyRead): string {
  return subFamily.name.trim().toLowerCase();
}

/** "SHEJA_NGABO" reads as "Sheja Ngabo". */
export function promotionLabel(name: string): string {
  return name
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word[0]!.toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function choice(promotion: PromotionRead | null): Choice | null {
  return promotion ? { id: promotion.id, name: promotion.name } : null;
}

/**
 * Whether somebody has used their invitation. A member uses it by
 * confirming their address; an administrator by choosing a password, and
 * cannot log in until they have.
 */
export function statusOf(user: UserRead): MemberStatus {
  if (user.deactivated_at) return "deactivated";
  const waiting =
    user.role === "admin" ? !user.has_password : !user.email_verified_at;
  return waiting ? "invited" : "active";
}

export function memberFromAccount(user: UserRead): FamilyMember {
  return {
    id: user.id,
    fullName: user.display_name,
    familyName: user.family_name,
    email: user.email,
    branch: branchSlug(user.sub_family),
    promotion: choice(user.promotion),
    bornOn: user.birthday ?? "",
    role: user.role,
    status: statusOf(user),
    joinedOn: user.created_at.slice(0, 10),
    photo: user.photo_url ?? "",
  };
}

export function personFromPublic(user: UserPublicRead): PublicPerson {
  return {
    id: user.id,
    fullName: user.display_name,
    familyName: user.family_name,
    branch: branchSlug(user.sub_family),
    promotion: choice(user.promotion),
    birthday: user.birthday
      ? { month: user.birthday.month, day: user.birthday.day }
      : null,
    photo: user.photo_url ?? "",
    bio: user.bio ?? "",
  };
}

export function accountFromMe(user: UserRead): MyAccount {
  return {
    id: user.id,
    fullName: user.display_name,
    familyName: user.family_name,
    email: user.email,
    emailConfirmed: user.email_verified_at !== null,
    branch: branchSlug(user.sub_family),
    promotion: choice(user.promotion),
    bornOn: user.birthday ?? "",
    bio: user.bio ?? "",
    photo: user.photo_url ?? "",
  };
}

export function deviceFromSession(session: SessionRead): Device {
  return {
    id: session.id,
    label: session.device_label,
    signedInAt: session.created_at,
    lastUsedAt: session.last_used_at,
    current: session.current,
  };
}
