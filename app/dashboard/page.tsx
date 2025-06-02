// app/dashboard/page.tsx
"use client";

import HeaderBar from "@/components/partials/header";
import { Assistant } from "@/app/assistant";
import { withAuth } from "../utils/withAuth";

function Dashboard() {
  return (
    <>
      <HeaderBar />
      <Assistant />
    </>
  );
}

export default withAuth(Dashboard);
