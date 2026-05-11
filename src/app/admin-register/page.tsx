"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, User, Mail, Lock } from "lucide-react";

export default function AdminRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
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
          role: "admin", // ✅ Admin page always sends "admin"
        }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      alert("Admin account created. Please login.");
      router.push("/admin-login");
    } catch {
      setLoading(false);
      setError("Server error. Please try again.");
    }
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
            Create Admin Account
          </h1>
          <p className="mt-1 text-center text-sm text-slate-500">
            For store managers only
          </p>

          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <FieldWrap icon={<User size={16} />}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </FieldWrap>
            <FieldWrap icon={<Mail size={16} />}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </FieldWrap>
            <FieldWrap icon={<Lock size={16} />}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                autoComplete="new-password"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </FieldWrap>

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
              {loading ? "Creating..." : "Create Admin Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/admin-login" className="font-semibold text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function FieldWrap({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-indigo-500 focus-within:bg-white">
      <span className="text-slate-400">{icon}</span>
      {children}
    </div>
  );
}