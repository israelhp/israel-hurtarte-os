import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/** Class names that define the `--font-geist-*` variables used by the theme CSS. */
export const fontVariables = `${geistSans.variable} ${geistMono.variable}`;
