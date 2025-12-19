import { redirect } from "next/navigation";
import { auth } from "@/lib/auth-config";

export default async function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/analyze");
  }
  
  return <>{children}</>;
}

