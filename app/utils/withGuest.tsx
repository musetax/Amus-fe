"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "./auth"; // Ensure this returns a boolean
import type { ComponentType, JSX } from "react";

export function withGuest<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>
) {
  return function GuestOnlyComponent(props: P) {
    const router = useRouter();
    const isAuth = isAuthenticated();

    useEffect(() => {
      if (isAuth) {
        router.push("/dashboard"); // redirect logged-in users
      }
    }, [isAuth, router]);

    if (isAuth) return null; // or loading spinner

    return <Component {...props} />;
  };
}
