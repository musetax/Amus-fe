// app/dashboard/page.tsx
"use client";

import HeaderBar from "@/components/partials/header";
import { Assistant } from "@/app/assistant";

function Dashboard() {
  return (
    <>
      <HeaderBar />
      <Assistant />
    </>
  );
}

export default Dashboard;
