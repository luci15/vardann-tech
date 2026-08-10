import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Editorial display serif — regular + italic only (no bold cut), used for
// the large, standalone headline moments (Hero, page/section titles), not
// for compact UI text where a faux-bold serif would look off.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Vardann Tech and Engg LLP | Powering Precision Globally",
  description:
    "Vardann Tech and Engg LLP delivers Non-Destructive Testing, Inspection Services, Metallography, and Precision Manufacturing solutions to clients across India, the Middle East, Africa, and Asia-Pacific.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
