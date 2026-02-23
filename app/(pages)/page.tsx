"use client";

//   <Assistant /> i wnat this compoent to be served

import { Suspense } from "react";
import Assistant from "../assistant";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// app/%28pages%29/page.tsx
export default function Home() {
  return (
    <main
      className="flex  flex-col items-center justify-between p-24"
      style={{ backgroundColor: "#ECE8F8", minHeight: "100vh" }}
    >
      <Suspense fallback={<div />}>
        <Assistant />
      </Suspense>
    </main>
  );
}
