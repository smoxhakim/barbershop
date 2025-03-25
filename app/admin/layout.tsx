"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminProtectedLayout>{children}</AdminProtectedLayout>
      <Toaster position="top-right" />
    </SessionProvider>
  );
}

function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If the user is not authenticated and not on the login page, redirect to login
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else if (status === "authenticated" && pathname === "/admin/login") {
      // If the user is authenticated and on the login page, redirect to dashboard
      router.push("/admin/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [status, router, pathname]);

  // Show nothing while loading or redirecting
  if (isLoading && status !== "authenticated" && pathname !== "/admin/login") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access to login page without authentication
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Only render children if authenticated or on the login page
  return status === "authenticated" ? <>{children}</> : null;
}
