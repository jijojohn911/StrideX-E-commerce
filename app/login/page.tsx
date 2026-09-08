import Link from "next/link";
import Image from "next/image";
import LoginForm from "@/component/auth/LoginForm";

const LoginPage = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-(--color-ivory) px-4 py-12">

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-champagne/10 blur-3xl" />

        <div className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-stone/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-champagne/5 blur-3xl" />

      </div>

      {/* Floating Login Card */}
      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-2xl border border-stone-light/50 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.12)]">

        {/* IMAGE */}
        <div className="relative hidden min-h-140 w-[42%] overflow-hidden bg-(--color-ink) md:block">

          <Image
            src="/images/lifestyle_shoe.png"
            alt="StrideX luxury footwear"
            fill
            priority
            sizes="(max-width: 768px) 0px, 42vw"
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

        {/* FORM SECTION */}
        <div className="w-full px-7 py-9 sm:px-10 sm:py-11 md:w-[58%] lg:px-14">

          {/* Mobile Logo */}
          <Link
            href="/"
            className="mb-8 block font-display text-xl tracking-[0.3em] text-(--color-ink) md:hidden"
          >
            STRIDEX
          </Link>

          {/* Heading */}
          <div className="mb-7">

            <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-(--color-champagne)">
              Welcome Back
            </p>

            <h1 className="font-display text-3xl text-(--color-ink)">
              Welcome to StrideX
            </h1>

            <p className="mt-2 max-w-md text-xs leading-5 text-(--color-stone)">
              Sign in to continue your refined StrideX experience.
            </p>

          </div>

          {/* Login Form */}
          <LoginForm />

        </div>

      </div>

    </main>
  );
};

export default LoginPage;