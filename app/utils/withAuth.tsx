"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "./auth";
import type { ComponentType, JSX } from "react";

export function withAuth<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const isAuth = isAuthenticated();

    useEffect(() => {
      if (!isAuth) {
        router.push("/login");
      }
    }, [isAuth, router]);

    if (!isAuth) return null; // or a loading spinner

    return <Component {...props} />;
  };
}
