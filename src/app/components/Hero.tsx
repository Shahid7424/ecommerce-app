"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  cta: { label: string; href: string };
  badge?: string;
  // Tailwind classes — keeps it portable, no external images required
  gradient: string;
  accent: string;
}

const SLIDES: Slide[] = [
  {
    eyebrow: "New season",
    title: "Festive deals on",
    highlight: "Electronics & more",
    description:
      "Up to 70% off premium phones, laptops and audio. Free express delivery on orders over ₹500.",
    cta: { label: "Shop Electronics", href: "/products?cat=electronics" },
    badge: "Limited time",
    gradient:
      "from-indigo-600 via-violet-600 to-fuchsia-600",
    accent: "from-amber-200 to-yellow-100",
  },
  {
    eyebrow: "Curated for you",
    title: "Fashion that",
    highlight: "fits your story",
    description:
      "Discover the season's most-wanted styles, hand-picked from 500+ trusted brands.",
    cta: { label: "Explore Fashion", href: "/products?cat=fashion" },
    badge: "Trending now",
    gradient: "from-rose-500 via-pink-500 to-orange-400",
    accent: "from-rose-100 to-amber-100",
  },
  {
    eyebrow: "Smart home",
    title: "Upgrade your",
    highlight: "everyday space",
    description:
      "Kitchen, decor, and living essentials from the brands you love — at prices you'll love more.",
    cta: { label: "Shop Home", href: "/products?cat=home" },
    badge: "Bestsellers",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    accent: "from-emerald-100 to-teal-100",
  },
];

const CATEGORIES = [
  { name: "Electronics", emoji: "📱", href: "/products?cat=electronics" },
  { name: "Fashion", emoji: "👗", href: "/products?cat=fashion" },
  { name: "Home", emoji: "🛋️", href: "/products?cat=home" },
  { name: "Beauty", emoji: "💄", href: "/products?cat=beauty" },
  { name: "Sports", emoji: "⚽", href: "/products?cat=sports" },
  { name: "Books", emoji: "📚", href: "/products?cat=books" },
  { name: "Toys", emoji: "🧸", href: "/products?cat=toys" },
  { name: "Deals", emoji: "🔥", href: "/deals" },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      {/* Main hero card */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${slide.gradient} shadow-2xl transition-[background] duration-700`}
      >
        {/* Decorative blurred orbs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-black/20 blur-3xl" />

        {/* Subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative grid items-center gap-8 px-6 py-12 md:grid-cols-2 md:px-12 md:py-16 lg:py-20">
          {/* Copy */}
          <div className="text-white">
            {slide.badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm ring-1 ring-white/20">
                <Sparkles size={12} />
                {slide.badge}
              </span>
            )}
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
              {slide.eyebrow}
            </p>
            <h1 className="mt-2 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {slide.title}
              <br />
              <span
                className={`bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent`}
              >
                {slide.highlight}
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base text-white/85 sm:text-lg">
              {slide.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={slide.cta.href}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:scale-105 hover:shadow-xl"
              >
                {slide.cta.label}
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur-sm transition hover:bg-white/20"
              >
                Browse all
              </Link>
            </div>
          </div>

          {/* Visual side — geometric stack of cards (no external image needed) */}
          <div className="relative hidden h-80 md:block">
            <div className="absolute right-8 top-4 h-56 w-44 rotate-6 rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/30 shadow-2xl" />
            <div className="absolute right-24 top-12 h-56 w-44 -rotate-3 rounded-2xl bg-white/25 backdrop-blur-md ring-1 ring-white/40 shadow-2xl" />
            <div className="absolute right-44 top-20 h-56 w-44 rotate-2 rounded-2xl bg-white/40 backdrop-blur-md ring-1 ring-white/50 shadow-2xl flex items-center justify-center">
              <span className="text-7xl">🛍️</span>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3">
          <button
            onClick={() =>
              setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
            }
            aria-label="Previous slide"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
            aria-label="Next slide"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Category tiles row */}
      <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-8">
        {CATEGORIES.map((c) => (
          <Link
            key={c.name}
            href={c.href}
            className="group flex flex-col items-center gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-indigo-300"
          >
            <span className="text-3xl transition group-hover:scale-110">
              {c.emoji}
            </span>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}