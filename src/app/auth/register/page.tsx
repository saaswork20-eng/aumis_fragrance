"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "../actions";
import { User, Mail, Lock, AlertCircle, CheckCircle, ArrowRight, Store } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"BUYER" | "SELLER">("BUYER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    const res = await registerUser(null, formData);

    setIsLoading(false);

    if (res.success) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } else {
      setError(res.error || "Registration failed");
      if (res.fieldErrors) setFieldErrors(res.fieldErrors);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-white p-8 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <Link href="/" className="font-heading text-3xl font-bold tracking-widest text-accent">
            AUMIS
          </Link>
          <h1 className="mt-4 font-heading text-2xl font-bold text-text-main">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Join the AUMIS luxury fragrance community
          </p>
        </div>

        {isSuccess ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <h3 className="mt-3 font-heading text-lg font-bold text-green-900">
              Account Created!
            </h3>
            <p className="mt-1 text-sm text-green-700">
              Redirecting you to the sign-in page...
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Type Selector */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-main">
                  Select Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("BUYER")}
                    className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-xs font-semibold transition ${
                      role === "BUYER"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border-subtle text-text-muted hover:border-accent"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Buyer / Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("SELLER")}
                    className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-xs font-semibold transition ${
                      role === "SELLER"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border-subtle text-text-muted hover:border-accent"
                    }`}
                  >
                    <Store className="h-4 w-4" />
                    Fragrance Seller
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                  Full Name {role === "SELLER" && "or Brand Name"}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "SELLER" ? "House of Fragrance" : "Your Name"}
                    className="w-full rounded-lg border border-border-subtle bg-[#faf8f5] py-2.5 pl-10 pr-4 text-sm text-text-main placeholder-text-muted/60 transition focus:border-accent focus:bg-white focus:outline-none"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.name[0]}</p>
                )}
              </div>

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
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                  Password (6+ characters)
                </label>
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
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.password[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-main">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <div className="mt-8 border-t border-border-subtle pt-6 text-center text-sm text-text-muted">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-accent hover:underline">
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
