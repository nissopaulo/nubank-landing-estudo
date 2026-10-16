import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-nu-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-nu-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nubank — Estudo de landing page (não oficial)",
  description:
    "Projeto de estudo e portfólio: landing page inspirada na identidade visual da Nubank, reconstruída a partir de um design autoral no Figma. Não é um site oficial nem afiliado à Nubank.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}