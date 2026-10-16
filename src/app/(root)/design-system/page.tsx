import type { Metadata } from "next";
import { Catalog } from "./Catalog";

// Internal catalog of the design system (DS-001). Not part of the product: never indexed.
export const metadata: Metadata = {
  title: "Design system — ISRAEL HURTARTE.OS",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return <Catalog />;
}
