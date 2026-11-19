import type { StaticImageData } from "next/image";

/**
 * A photograph, from either side of the integration.
 *
 * This is the mismatch most likely to break the day the API is connected.
 * Every image in this project today is a `StaticImageData` — a local file
 * imported at build time, which carries its own width, height and blur
 * placeholder. **The API will send a URL string**, which carries none of
 * them.
 *
 * `next/image` accepts both, but not identically:
 *
 * | | `StaticImageData` | remote URL |
 * | --- | --- | --- |
 * | `width`/`height` | inferred | **required**, or `fill` |
 * | `placeholder="blur"` | works | needs `blurDataURL` |
 * | host | n/a | must be in `next.config.ts` `remotePatterns` |
 *
 * So components take `ImageSource`, and anything that renders one supplies
 * dimensions rather than relying on the import to carry them.
 */
export type ImageSource = StaticImageData | string;

/** A photograph with the things a remote one cannot infer. */
export interface RemoteImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  /** A tiny base64 preview, when the backend produces one. */
  blurDataURL?: string;
}

/** True for a URL the image optimiser has to be told about. */
export function isRemoteImage(source: ImageSource): source is string {
  return typeof source === "string";
}

/** A local import's own path, or the URL as it came. */
export function imageUrl(source: ImageSource): string {
  return isRemoteImage(source) ? source : source.src;
}

/**
 * `placeholder="blur"` throws on a remote image without a `blurDataURL`, so
 * the blur is only asked for when the source carries one.
 */
export function placeholderFor(source: ImageSource): "blur" | "empty" {
  return isRemoteImage(source) ? "empty" : "blur";
}
