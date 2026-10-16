import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

/**
 * O projeto usa apenas a Montserrat. O arquivo do Figma usava Inter no
 * subtítulo, mas essa foi a única referência a Inter em todo o design.
 */
const montserrat = Montserrat({
  variable: "--font-nu-montserrat",
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
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}