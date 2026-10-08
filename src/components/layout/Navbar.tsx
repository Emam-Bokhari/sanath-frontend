"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Drawer, Button, Dropdown, Grid } from "antd";
import { MenuOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import NavActions from "./NavActions";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getUserInfo, isUserLoggedIn } from "@/services/auth.service";

const { useBreakpoint } = Grid;

const mobileLinks = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact-us" },
  { label: "About", href: "/about" },
];

const links = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const screens = useBreakpoint();
  const isLoggedIn = isUserLoggedIn();
  const user = getUserInfo() as any;
  const isAgent = user?.role === "AGENT";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-close drawer when switching to desktop
  useEffect(() => {
    if (screens.md) {
      setDrawerOpen(false);
    }
  }, [screens.md]);

  const navLinks = [
    { label: "Home", href: "/" },
    ...(isAgent ? [{ label: "Pricing", href: "/pricing" }] : []),
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact-us" },
  ];
  
  if (mounted && isLoggedIn) {
    navLinks.push({
      label: "Dashboard",
      href: isAgent ? "/agent-dashboard/overview" : "/user-dashboard/saved",
    });
  }

  return (
    <header
      className={`w-full bg-white sticky top-0 z-50 transition-shadow duration-200 ${isScrolled ? "shadow-sm" : "shadow-none"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="MyHome Logo"
              width={160}
              height={120}
              className="h-auto transition-all"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 md:flex-0 items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href && pathname !== "/";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md font-medium text-[15px] transition-all duration-200 whitespace-nowrap
                ${isActive
                    ? "bg-[#1a3c6e] text-white"
                    : "text-gray-700 hover:text-[#1a3c6e]"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <Link href="/terms-condition">Terms & Conditions</Link>
                  ),
                },
                {
                  key: "2",
                  label: <Link href="/privacy">Privacy Policy</Link>,
                },
                { key: "3", label: <Link href="/faq">FAQ</Link> },
              ],
            }}
            placement="bottom"
            trigger={["hover"]}
          >
            <div className="px-3 py-1.5 rounded-md font-medium text-[15px] text-gray-700 hover:text-[#1a3c6e] cursor-pointer flex items-center gap-1 transition-all duration-200">
              More <DownOutlined className="text-[10px]" />
            </div>
          </Dropdown>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-4">
          <Suspense fallback={<div className="w-20 h-10 bg-gray-100 rounded-lg animate-pulse"></div>}>
            <NavActions />
          </Suspense>
          <Button
            type="text"
            icon={<MenuOutlined className="text-xl" />}
            className="flex md:hidden items-center justify-center h-10 w-10 p-0 rounded-xl hover:bg-gray-50"
            onClick={() => setDrawerOpen(true)}
            id="mobile-menu-trigger"
          />
        </div>
      </div>

      {/* Mobile Drawer - Strictly Conditional Rendering for Web Version */}
      {!screens.md && (
        <Drawer
          placement="right"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          closeIcon={null}
          width={300}
          styles={{ body: { padding: 0 } }}
        >
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-6 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
              <Link
                href="/"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src="/logo.png"
                  alt="MyHome"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="font-bold text-[#1a3c6e] text-lg">MyHome</span>
              </Link>
              <Button
                type="text"
                icon={<CloseOutlined className="text-gray-400" />}
                onClick={() => setDrawerOpen(false)}
                className="hover:bg-white rounded-lg h-10 w-10 flex items-center justify-center"
              />
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-4">
              <nav className="flex flex-col gap-1">
                <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Main Menu
                </p>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-[15px] transition-all
                                        ${isActive
                          ? "bg-[#1a3c6e] text-white shadow-lg shadow-[#1a3c6e]/20"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#1a3c6e]"
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="h-[1px] bg-gray-50 my-4 mx-4" />
                <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Support & Legal
                </p>

                <Link
                  href="/terms-condition"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 font-bold text-[15px] hover:text-[#1a3c6e]"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 font-bold text-[15px] hover:text-[#1a3c6e]"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 font-bold text-[15px] hover:text-[#1a3c6e]"
                >
                  FAQ
                </Link>
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-gray-50 bg-gray-50/30 text-center">
              <p className="text-[11px] text-gray-400 font-medium">
                © 2026 MyHome Platform
              </p>
            </div>
          </div>
        </Drawer>
      )}
    </header>
  );
}