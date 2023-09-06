import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthContext from "./session";
import Navbar from "./util/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alaska",
  description: "Medium clone",
};

export default function RootLayout({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthContext>
        <body className={inter.className}>
          <Navbar />
          {children}
        </body>
      </AuthContext>
    </html>
  );
}
