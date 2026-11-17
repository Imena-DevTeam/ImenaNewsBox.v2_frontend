import type { components } from "@/types/api.gen";

/**
 * The backend's shapes, by the names the backend gives them.
 *
 * Every one is an alias into `api.gen.ts`, which `pnpm api:types` writes from
 * the backend's OpenAPI schema. Nothing here is written by hand, so when the
 * backend changes a field, regenerating makes every place that reads it a
 * type error rather than a surprise at runtime.
 *
 * These are **wire** types. A feature that needs a different shape (a
 * register row, a blog card) maps from these in its own module, so the
 * mapping is in one place per feature rather than spread through the pages.
 */
type Schemas = components["schemas"];

export type Role = Schemas["Role"];

export type AccessToken = Schemas["AccessToken"];
export type CodeSent = Schemas["CodeSent"];
export type LoginRequest = Schemas["LoginRequest"];
export type VerifyRequest = Schemas["VerifyRequest"];
export type GoogleLoginRequest = Schemas["GoogleLoginRequest"];
export type SessionRead = Schemas["SessionRead"];

export type InvitationRead = Schemas["InvitationRead"];
export type InvitationAccept = Schemas["InvitationAccept"];

export type ResetRequested = Schemas["ResetRequested"];
export type ResetRequestRead = Schemas["ResetRequestRead"];

export type UserPublicRead = Schemas["UserPublicRead"];
export type UserRead = Schemas["UserRead"];
export type UserCreate = Schemas["UserCreate"];
export type UserUpdate = Schemas["UserUpdate"];
export type ProfileUpdate = Schemas["ProfileUpdate"];
export type SubFamilyRead = Schemas["SubFamilyRead"];
export type PromotionRead = Schemas["PromotionRead"];
export type MonthDay = Schemas["MonthDay"];
export type AuthorLink = Schemas["AuthorLink"];

export type WishRead = Schemas["WishRead"];
export type WishCreate = Schemas["WishCreate"];
export type WishUpdate = Schemas["WishUpdate"];
export type UpcomingBirthday = Schemas["UpcomingBirthday"];

export type PostSummary = Schemas["PostSummary"];
export type PostRead = Schemas["PostRead"];
export type PostCreate = Schemas["PostCreate"];
export type PostUpdate = Schemas["PostUpdate"];
export type PostImage = Schemas["PostImage"];
export type PostImageUploaded = Schemas["PostImageUploaded"];
export type AuthorRead = Schemas["AuthorRead"];
export type PortableTextBlock = Schemas["Block"];

export type ResourceRead = Schemas["ResourceRead"];
export type ResourceUpdate = Schemas["ResourceUpdate"];
export type ResourceCategory = Schemas["ResourceCategory"];
