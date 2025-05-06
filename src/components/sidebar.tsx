'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import {
  FiHome,
  FiUpload,
  FiFilePlus,
  FiList,
  FiArchive,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { Icon } from "./ui/icon";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const SidebarLink = ({ href, label, icon, onClick }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors",
        "text-gray-700 hover:text-forensic hover:bg-blue-50",
        isActive && "bg-blue-50 text-forensic font-medium"
      )}
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  
  // Close sidebar when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Prevent scrolling when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <div className="fixed top-3 sm:top-4 left-3 sm:left-4 z-40 md:hidden">
        <button
          className="p-2 rounded-md bg-white shadow-md border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-forensic focus:ring-opacity-50"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isOpen}
        >
          {isOpen ? <Icon icon={FiX} size={18} /> : <Icon icon={FiMenu} size={18} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 shadow-md transition-transform duration-300 transform",
          "md:translate-x-0 md:sticky flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo and App Title */}
        <div className="h-14 sm:h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-lg sm:text-xl font-semibold text-forensic">
            Digital Evidence Viewer
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 sm:py-6 space-y-1 overflow-y-auto">
          <SidebarLink
            href="/dashboard"
            label="Dashboard"
            icon={<Icon icon={FiHome} />}
            onClick={closeSidebar}
          />
          <SidebarLink
            href="/upload"
            label="Upload File"
            icon={<Icon icon={FiUpload} />}
            onClick={closeSidebar}
          />
          <SidebarLink
            href="/analysis"
            label="Analysis"
            icon={<Icon icon={FiFilePlus} />}
            onClick={closeSidebar}
          />
          <SidebarLink
            href="/history"
            label="History"
            icon={<Icon icon={FiList} />}
            onClick={closeSidebar}
          />
          <SidebarLink
            href="/cases"
            label="Case Management"
            icon={<Icon icon={FiArchive} />}
            onClick={closeSidebar}
          />
          <SidebarLink
            href="/reports"
            label="Reports"
            icon={<Icon icon={FiFileText} />}
            onClick={closeSidebar}
          />
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <SignOutButton>
            <button
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-forensic transition-colors w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-forensic focus:ring-opacity-50"
              aria-label="Sign out"
            >
              <Icon icon={FiLogOut} size={18} />
              <span>Sign Out</span>
            </button>
          </SignOutButton>
        </div>
      </aside>
    </>
  );
}; 