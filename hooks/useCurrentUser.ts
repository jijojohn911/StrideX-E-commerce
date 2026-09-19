"use client";

import { useEffect, useState } from "react";

export interface CurrentUser {
  userId: string;
  email: string;
  role: "user" | "admin";
  username?: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.success) setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const displayName = user?.username || "Admin";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return { user, displayName, initials };
}