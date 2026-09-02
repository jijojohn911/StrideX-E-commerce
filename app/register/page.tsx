"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show validation errors from Zod
        if (data.errors) {
          const firstError = Object.values(data.errors).flat()[0];

          setError(
            typeof firstError === "string"
              ? firstError
              : data.message || "Registration failed",
          );
        } else {
          setError(data.message || "Registration failed");
        }

        return;
      }

      // Registration successful
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Register error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-(--color-ivory) px-4 py-12">

    {/* Background decoration */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />

      <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-stone/10 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne/5 blur-3xl" />
    </div>

    {/* Floating Register Card */}
    <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-2xl border border-stone-light/50 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.12)]">

      {/*IMAGE */}
      <div className="relative hidden w-[42%] overflow-hidden bg-(--color-ink) md:block">

        <Image
          src="/images/lifestyle_shoe.png"
          alt="StrideX luxury footwear"
          fill
          priority
          className="object-cover"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-black/25" />

        {/* Logo */}
        <div className="absolute left-8 top-8 z-10">
          <Link
            href="/"
            className="font-display text-xl tracking-[0.3em] text-white"
          >
            STRIDEX
          </Link>
        </div>

        {/* Image text */}
        <div className="absolute bottom-8 left-8 right-8 z-10 text-white">
          <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-(--color-champagne)">
            StrideX Membership
          </p>

          <h2 className="font-display text-3xl leading-tight">
            Move with
            <br />
            distinction.
          </h2>

          <p className="mt-4 max-w-xs text-xs leading-5 text-white/70">
            Exclusive releases, refined essentials and a more personal
            StrideX experience.
          </p>
        </div>
      </div>

      {/*FORM */}
      <div className="w-full px-7 py-9 sm:px-10 sm:py-11 md:w-[58%] lg:px-14">

        {/* Mobile logo */}
        <Link
          href="/"
          className="mb-8 block font-display text-xl tracking-[0.3em] text-(--color-ink) md:hidden"
        >
          STRIDEX
        </Link>

        {/* Heading */}
        <div className="mb-7">
          <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-(--color-champagne)">
            Create your account
          </p>

          <h1 className="font-display text-3xl text-(--color-ink)">
            Join StrideX
          </h1>

          <p className="mt-2 max-w-md text-xs leading-5 text-(--color-stone)">
            Create your account and discover a more refined way to move.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* First + Last */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label
                htmlFor="firstName"
                className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.15em] text-(--color-ink)"
              >
                First Name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full border-b border-(--color-stone-light) bg-transparent px-0 py-2.5 text-sm text-(--color-ink) outline-none transition-colors placeholder:text-(--color-stone) focus:border-(--color-champagne)"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.15em] text-(--color-ink)"
              >
                Last Name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full border-b border-(--color-stone-light) bg-transparent px-0 py-2.5 text-sm text-(--color-ink) outline-none transition-colors placeholder:text-(--color-stone) focus:border-(--color-champagne)"
              />
            </div>

          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.15em] text-(--color-ink)"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              className="w-full border-b border-(--color-stone-light) bg-transparent px-0 py-2.5 text-sm text-(--color-ink) outline-none transition-colors placeholder:text-(--color-stone) focus:border-(--color-champagne)"
            />
          </div>

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
              className="w-full border-b border-(--color-stone-light) bg-transparent px-0 py-2.5 text-sm text-(--color-ink) outline-none transition-colors placeholder:text-(--color-stone) focus:border-(--color-champagne)"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.15em] text-(--color-ink)"
            >
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              required
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
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
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full border-b border-(--color-stone-light) bg-transparent px-0 py-2.5 pr-8 text-sm text-(--color-ink) outline-none transition-colors placeholder:text-(--color-stone) focus:border-(--color-champagne)"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-(--color-stone) hover:text-(--color-ink)"
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>

            </div>
          </div>

          {/* Terms */}
          <p className="pt-1 text-[10px] leading-4 text-(--color-stone)">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="text-(--color-ink) underline underline-offset-2 hover:text-(--color-champagne)"
            >
              Terms & Conditions
            </Link>
            .
          </p>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-(--color-ink) px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.25em] text-(--color-ivory) transition-all duration-300 hover:bg-(--color-champagne) hover:text-(--color-ink) disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {/* Login */}
        <p className="mt-6 text-center text-xs text-(--color-stone)">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-(--color-ink) underline underline-offset-4 hover:text-(--color-champagne)"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  </main>
);
}