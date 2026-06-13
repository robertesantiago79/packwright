import { createHash } from "node:crypto";

export interface UrlIdentity {
  canonicalUrl: string;
  fullHash: string;
  id: string;
}

export function canonicalizeUrl(rawUrl: string): string {
  const url = new URL(rawUrl);
  url.protocol = url.protocol.toLowerCase();
  url.hostname = url.hostname.toLowerCase();
  url.hash = "";
  url.searchParams.sort();

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  return url.toString();
}

export function createUrlIdentity(rawUrl: string): UrlIdentity {
  const canonicalUrl = canonicalizeUrl(rawUrl);
  const fullHash = createHash("sha256").update(canonicalUrl).digest("hex");

  return {
    canonicalUrl,
    fullHash,
    id: `url-sha256:${fullHash.slice(0, 16)}`,
  };
}
