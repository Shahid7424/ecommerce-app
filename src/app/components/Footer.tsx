"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CreditCard,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // wire this up to your API later
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="relative mt-20 bg-slate-950 text-slate-300">
      {/* Top trust strip — sits above the main footer */}
      <div className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-8 md:grid-cols-4">
          {[
            { Icon: Truck, title: "Free Delivery", sub: "On orders over ₹500" },
            { Icon: RotateCcw, title: "Easy Returns", sub: "7-day return policy" },
            { Icon: ShieldCheck, title: "Secure Payments", sub: "100% protected" },
            { Icon: Headphones, title: "24/7 Support", sub: "We're here to help" },
          ].map(({ Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 ring-1 ring-indigo-400/30">
                <Icon size={20} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-12 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-white">
              Get <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">10% off</span> your first order
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Subscribe for exclusive deals, new arrivals and insider-only offers.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full max-w-md">
            <div className="flex overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-indigo-400">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="w-full bg-transparent px-5 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="group flex items-center gap-1.5 bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Subscribe
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </button>
            </div>
            {subscribed && (
              <p className="mt-2 text-xs text-emerald-400">
                ✓ You&apos;re in. Check your inbox for the welcome code.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Main link columns */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand column — wider */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  ShopEase
                </span>
              </h2>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              Next-generation marketplace. Curated products, honest prices, and a checkout that just works. Based in Hagerstown, Maryland 21740.
            </p>

            {/* Contact */}
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-indigo-400" />
                <span>Hagerstown, Maryland 21740</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-indigo-400" />
                <a href="tel:+911800123456" className="hover:text-white">
                  +1(888) 206-5831
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-indigo-400" />
                <a href="mailto:support@shopease.in" className="hover:text-white">
                  support@shopease.com
                </a>
              </li>
            </ul>

            {/* App badges */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Get the app
              </p>
              <div className="flex gap-3">
                <AppBadge store="App Store" />
                <AppBadge store="Google Play" />
              </div>
            </div>
          </div>

          {/* Link columns */}
          <FooterLinks
            className="md:col-span-2"
            title="Shop"
            links={[
              { label: "All Products", href: "/products" },
              { label: "Electronics", href: "/products?cat=electronics" },
              { label: "Fashion", href: "/products?cat=fashion" },
              { label: "Home & Kitchen", href: "/products?cat=home" },
              { label: "Beauty", href: "/products?cat=beauty" },
              { label: "Deals", href: "/deals" },
            ]}
          />

          <FooterLinks
            className="md:col-span-2"
            title="Support"
            links={[
              { label: "Help Center", href: "/help" },
              { label: "Track Order", href: "/orders" },
              { label: "Returns", href: "/returns" },
              { label: "Shipping Info", href: "/shipping" },
              { label: "Contact Us", href: "/contact" },
              { label: "FAQ", href: "/faq" },
            ]}
          />

          <FooterLinks
            className="md:col-span-2"
            title="Company"
            links={[
              { label: "About Us", href: "/about" },
              { label: "Careers", href: "/careers" },
              { label: "Press", href: "/press" },
              { label: "Blog", href: "/blog" },
              { label: "Sustainability", href: "/sustainability" },
              { label: "Affiliates", href: "/affiliates" },
            ]}
          />

          <FooterLinks
            className="md:col-span-2"
            title="Legal"
            links={[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookies" },
              { label: "Refund Policy", href: "/refunds" },
              { label: "Accessibility", href: "/accessibility" },
            ]}
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-6 md:flex-row">
          {/* Socials */}
          <div className="flex items-center gap-2">
            {[
              { Icon: Facebook, label: "Facebook", href: "#" },
              { Icon: Instagram, label: "Instagram", href: "#" },
              { Icon: Twitter, label: "Twitter", href: "#" },
              { Icon: Youtube, label: "YouTube", href: "#" },
              { Icon: Linkedin, label: "LinkedIn", href: "#" },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 ring-1 ring-white/10 transition hover:bg-indigo-500 hover:text-white hover:ring-indigo-400"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="order-3 text-center text-xs text-slate-500 md:order-2">
            © {year} ShopEase Technologies Pvt. Ltd. All rights reserved.
            Made with ♥ in India.
          </p>

          {/* Payment methods */}
          <div className="order-2 flex items-center gap-2 md:order-3">
            <PayBadge label="Visa" />
            <PayBadge label="MC" />
            <PayBadge label="RuPay" />
            <PayBadge label="UPI" />
            <PayBadge label="PayPal" />
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- helpers ---------- */

function FooterLinks({
  title,
  links,
  className = "",
}: {
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-slate-400 transition hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppBadge({ store }: { store: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-left ring-1 ring-white/10 transition hover:bg-white/10"
    >
      <Smartphone size={18} className="text-indigo-400" />
      <div className="leading-tight">
        <p className="text-[10px] uppercase text-slate-400">Get it on</p>
        <p className="text-xs font-semibold text-white">{store}</p>
      </div>
    </button>
  );
}

function PayBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex h-7 items-center rounded-md bg-white/90 px-2 text-[10px] font-bold tracking-wide text-slate-900">
      {label}
    </span>
  );
}
