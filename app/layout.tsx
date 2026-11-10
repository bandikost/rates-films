import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Увядшие подсолнухи",
  description: "Виртуальная коллекция",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
