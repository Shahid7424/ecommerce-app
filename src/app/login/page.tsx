/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, ShoppingBag, CheckCircle2 } from "lucide-react";

type Tab = "login" | "register";

function AuthContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const initialTab = (searchParams.get("tab") as Tab) || "login";

  const [tab, setTab] = useState<Tab>(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Already-logged-in customer? Send back. If admin lands here, send to /admin.
  useEffect(() => {
    if (!session) return;
    const role = (session.user as any)?.role;
    if (role === "admin") router.push("/admin");
    else router.push(callbackUrl);
  }, [session, router, callbackUrl]);

  const resetForm = () => {
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };
  const switchTab = (t: Tab) => {
    setTab(t);
    resetForm();
  };

  // ───── LOGIN ─────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      // Session updates → useEffect handles redirect (with role check)
    }
  };

  // ───── REGISTER (customer only) ─────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "customer", // ✅ Customer page always sends "customer"
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess("Account created! Signing you in...");
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError("Account created. Please login to continue.");
        setTab("login");
        setLoading(false);
      }
      // success → useEffect redirects
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-fuchsia-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-500 shadow-lg">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">
                ShopEase
              </span>
            </span>
          </div>
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/60">
          <div className="grid grid-cols-2 bg-slate-100">
            <button
              onClick={() => switchTab("login")}
              className={`py-4 text-sm font-semibold transition ${
                tab === "login"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchTab("register")}
              className={`py-4 text-sm font-semibold transition ${
                tab === "register"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {tab === "login"
                ? "Sign in to continue shopping"
                : "Join ShopEase in under a minute"}
            </p>

            <form
              onSubmit={tab === "login" ? handleLogin : handleRegister}
              className="mt-6 space-y-4"
            >
              {tab === "register" && (
                <FieldWrap icon={<User size={16} />} label="Full name">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    autoComplete="name"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </FieldWrap>
              )}

              <FieldWrap icon={<Mail size={16} />} label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </FieldWrap>

              <FieldWrap icon={<Lock size={16} />} label="Password">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === "register" ? "Minimum 6 characters" : "••••••••"}
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="ml-2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </FieldWrap>

              {tab === "register" && (
                <FieldWrap icon={<Lock size={16} />} label="Confirm password">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </FieldWrap>
              )}

              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 ring-1 ring-rose-200">
                  {error}
                </p>
              )}
              {success && (
                <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-emerald-200">
                  <CheckCircle2 size={16} />
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
              >
                {loading
                  ? tab === "login" ? "Signing in..." : "Creating account..."
                  : tab === "login" ? "Login" : "Create Account"}
              </button>

              {tab === "register" && (
                <p className="text-center text-[11px] text-slate-500">
                  By signing up you agree to our{" "}
                  <Link href="/terms" className="text-indigo-600 hover:underline">Terms</Link>
                  {" and "}
                  <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
                </p>
              )}
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              {tab === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button onClick={() => switchTab("register")} className="font-semibold text-indigo-600 hover:text-indigo-700">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => switchTab("login")} className="font-semibold text-indigo-600 hover:text-indigo-700">
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          ← <Link href="/" className="hover:text-indigo-600">Back to shopping</Link>
        </p>
      </div>
    </div>
  );
}

function FieldWrap({
  icon, label, children,
}: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-200">
        <span className="text-slate-400">{icon}</span>
        {children}
      </div>
    </label>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading…</div>}>
      <AuthContent />
    </Suspense>
  );
}