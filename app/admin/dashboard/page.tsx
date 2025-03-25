"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground hidden md:block">
            Logged in as: <span className="font-medium">{session?.user?.name}</span>
          </p>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/appointments" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>Manage customer appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <p>View, edit, and manage all bookings</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/customers" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>View and manage customer information</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access customer details and history</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/availability" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Manage blocked days and time slots</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Set unavailable days and time slots</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
