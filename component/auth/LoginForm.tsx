"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors).flat()[0];

          setError(
            typeof firstError === "string"
              ? firstError
              : data.message || "Login failed",
          );
        } else {
          setError(data.message || "Login failed");
        }

        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error */}
      {error && (
        <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.15em] text-(--color-ink)"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full border-b border-(--color-stone-light) bg-transparent px-0 py-2.5 text-sm text-(--color-ink) outline-none transition-colors placeholder:text-(--color-stone) focus:border-(--color-champagne)"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.15em] text-(--color-ink)"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full border-b border-(--color-stone-light) bg-transparent px-0 py-2.5 pr-8 text-sm text-(--color-ink) outline-none transition-colors placeholder:text-(--color-stone) focus:border-(--color-champagne)"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-(--color-stone) transition-colors hover:text-(--color-ink)"
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end pt-1">
          <Link
            href="/forgot-password"
            className="text-[10px] text-(--color-stone) underline underline-offset-2 transition-colors hover:text-(--color-ink)"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full bg-(--color-ink) px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.25em] text-(--color-ivory) transition-all duration-300 hover:bg-(--color-champagne) hover:text-(--color-ink) disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Register */}
      <p className="mt-6 text-center text-xs text-(--color-stone)">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-(--color-ink) underline underline-offset-4 hover:text-(--color-champagne)"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}