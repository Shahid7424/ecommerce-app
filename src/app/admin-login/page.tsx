/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { signIn, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Mail, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If logged in: admin → /admin, customer → kick out + show error
  useEffect(() => {
    if (!session) return;
    const role = (session.user as any)?.role;
    if (role === "admin") {
      router.push("/admin");
    } else {
      setError("This account is not an admin. Please login as admin.");
      signOut({ redirect: false });
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
    }
    // success → useEffect handles role-check + redirect
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/40">
            <Shield className="text-indigo-400" size={22} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <h1 className="text-center text-2xl font-bold text-slate-900">
            Admin Login
          </h1>
          <p className="mt-1 text-center text-sm text-slate-500">
            Authorized personnel only
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-indigo-500 focus-within:bg-white">
              <Mail size={16} className="text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                autoComplete="email"
                required
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-indigo-500 focus-within:bg-white">
              <Lock size={16} className="text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 ring-1 ring-rose-200">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Need an admin account?{" "}
            <Link href="/admin-register" className="font-semibold text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-slate-400">
            Customer?{" "}
            <Link href="/login" className="hover:text-indigo-600 underline">
              Login here instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}