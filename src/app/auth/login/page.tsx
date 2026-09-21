"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl") || "/";
  let callbackUrl = "/";
  if (rawCallbackUrl.startsWith("/")) {
    callbackUrl = rawCallbackUrl;
  } else {
    try {
      const parsed = new URL(rawCallbackUrl);
      callbackUrl = `${parsed.pathname}${parsed.search}`;
    } catch {
      callbackUrl = "/";
    }
  }
  if (!callbackUrl.startsWith("/")) {
    callbackUrl = "/";
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-3xl font-bold tracking-widest text-accent">
            AUMIS
          </Link>
          <h1 className="mt-4 font-heading text-2xl font-bold text-text-main">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Sign in to your AUMIS luxury account
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-border-subtle bg-[#faf8f5] py-2.5 pl-10 pr-4 text-sm text-text-main placeholder-text-muted/60 transition focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-text-main">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border-subtle bg-[#faf8f5] py-2.5 pl-10 pr-4 text-sm text-text-main placeholder-text-muted/60 transition focus:border-accent focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-8 border-t border-border-subtle pt-6 text-center text-sm text-text-muted">
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/register" className="font-semibold text-accent hover:underline">
            Register here
          </Link>
        </div>

        <div className="mt-6 rounded-lg bg-primary/60 p-3 text-xs text-text-muted">
          <p className="font-semibold text-text-main">Demo Accounts:</p>
          <p className="mt-1">Admin: <span className="font-mono text-text-main">admin@aumisfragrance.com</span></p>
          <p>Seller: <span className="font-mono text-text-main">seller@aumisfragrance.com</span></p>
          <p>Buyer: <span className="font-mono text-text-main">buyer@aumisfragrance.com</span></p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
