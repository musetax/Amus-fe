
'use client';

//   <Assistant /> i wnat this compoent to be served

import { Suspense } from "react";
import Assistant from "../assistant";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// app/%28pages%29/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <Assistant/>
      </Suspense>
    </main>
  );
}