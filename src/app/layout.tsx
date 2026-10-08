import "@ant-design/v5-patch-for-react-19";
import { Inter } from "next/font/google";
import { ConfigProvider } from "antd";
import "./globals.css";
import { mainTheme } from "./theme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased inter`}>
        <AntdRegistry>
          <ConfigProvider theme={mainTheme} wave={{ disabled: true }}>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}