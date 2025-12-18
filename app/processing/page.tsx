"use client";

// This page is kept for potential future use
// Currently, processing happens on the upload page
// and then redirects directly to results

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProcessingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if someone lands here directly
    router.push("/");
  }, [router]);

  return null;
}
