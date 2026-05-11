"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  LogOut,
  Store,
  PlusCircle,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

interface Props {
  userName: string;
  userEmail: string;
}

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Add Product", href: "/admin/products/addProducts", icon: PlusCircle },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart, soon: true },
  { label: "Customers", href: "/admin/customers", icon: Users, soon: true },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, soon: true },
];

export default function AdminSidebar({ userName, userEmail }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className={`flex flex-col bg-slate-950 text-white transition-all duration-300 min-h-screen ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500">
              <Store size={16} />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">ShopEase</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Admin Panel
              </p>
            </div>
          </Link>
        )}

        {collapsed && (
          <div className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-indigo-500">
            <Store size={16} />
          </div>
        )}

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            className="grid h-7 w-7 place-items-center rounded-md bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          className="mx-auto mt-3 grid h-7 w-7 place-items-center rounded-md bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft size={14} className="rotate-180" />
        </button>
      )}

      {/* Nav Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon
                size={18}
                className={active ? "text-white" : "text-slate-500 group-hover:text-white"}
              />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.soon && (
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                      Soon
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-white/10 px-3 py-3 space-y-1">
        <Link
          href="/"
          target="_blank"
          title={collapsed ? "View Store" : undefined}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-white/5 hover:text-white"
        >
          <Store size={16} />
          {!collapsed && <span>View Store ↗</span>}
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/admin-login" })}
          title={collapsed ? "Sign out" : undefined}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-400"
        >
          <LogOut size={16} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>

      {/* User profile */}
      {!collapsed && (
        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {userName}
              </p>
              <p className="truncate text-xs text-slate-500">{userEmail}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}