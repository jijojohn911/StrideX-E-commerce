import localFont from "next/font/local";

export const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  variable: "--font-manrope",
  weight: "400 700",
  style: "normal",
  display: "swap",
});

export const cormorant = localFont({
  src: "./fonts/cormorant-garamond-latin.woff2",
  variable: "--font-cormorant",
  weight: "400 700",
  style: "normal",
  display: "swap",
});
