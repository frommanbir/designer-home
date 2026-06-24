"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Also store in a cookie so Next.js middleware can protect /admin routes
      document.cookie = `auth_token=${data.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 p-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1"
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" 
                  size={18} 
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@admin.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-neutral-100 dark:bg-neutral-900 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-950 outline-none transition-all text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label 
                  htmlFor="password" 
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Password
                </label>
                <Link 
                  href="#" 
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" 
                  size={18} 
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-neutral-100 dark:bg-neutral-900 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-950 outline-none transition-all text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-1">
            <input 
              id="remember" 
              type="checkbox" 
              className="w-4 h-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="remember" className="text-sm text-neutral-500 cursor-pointer select-none">
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 transform transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Sign In
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-sm text-neutral-500">
            Don't have an account?{" "}
            <Link 
              href="#" 
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
