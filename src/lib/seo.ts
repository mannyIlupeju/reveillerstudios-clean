import type { Metadata } from "next";

export const SITE_NAME = "Reveiller Studios";
export const SITE_URL = "https://www.reveillerstudios.com";
export const DEFAULT_OG = "/og.png";

type OgKind = "website" | "article" | "product";

type BaseOgArgs = {
  title: string;
  description?: string;
  path: string;              // e.g. "/", "/products/tee-1"
  image?: string | null;     // relative or absolute; falls back to DEFAULT_OG
  kind?: OgKind;             // accepts "product" but maps to "website" for OG
  publishedTime?: string;    // ISO string; used only when kind === "article"
  noindex?: boolean;
  locale?: string;           // e.g. "en_US"
  twitterHandle?: string;    // e.g. "@reveillerstudios"
};

/** Convert relative path/URL to absolute */
const toAbs = (pathOrUrl?: string | null): string | undefined => {
  if (!pathOrUrl || typeof pathOrUrl !== "string") return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalized = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${normalized}`;
};

/** Build Next.js Metadata */
export function baseOg({
  title,
  description,
  path,
  image,
  kind = "website",
  publishedTime,
  noindex = false,
  locale = "en_US",
  twitterHandle = "@reveillerstudios",
}: BaseOgArgs): Metadata {
  const canonical = toAbs(path) ?? SITE_URL;
  const ogImage = toAbs(image || DEFAULT_OG) ?? `${SITE_URL}${DEFAULT_OG}`;

  // Map "product" to a valid OpenGraph type for Next's typings
  const ogType: "website" | "article" = kind === "article" ? "article" : "website";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: ogType,                 // only "website" | "article"
      locale,
      ...(ogType === "article" && publishedTime ? { publishedTime } : {}),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} – ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: twitterHandle,
      images: [ogImage],            // ✅ string is valid
    },
    robots: noindex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large",
  };
}