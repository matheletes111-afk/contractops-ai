import { redirect } from "next/navigation";
import { auth } from "@/lib/auth-config";

export default async function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/results");
  }
  
  return <>{children}</>;
}

