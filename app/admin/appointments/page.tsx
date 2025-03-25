"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Toaster } from "sonner";

interface Appointment {
  id: string;
  customerId: string;
  date: string;
  time: string;
  status: 'booked' | 'completed' | 'cancelled';
  notes?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function AppointmentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");

  // Placeholder data for development
  useEffect(() => {
    // In a real implementation, this would fetch from your API
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        customerId: "c1",
        date: "2025-03-25",
        time: "10:00 AM",
        status: "booked",
        customer: {
          name: "John Doe",
          email: "john@example.com",
          phone: "555-123-4567"
        }
      },
      {
        id: "2",
        customerId: "c2",
        date: "2025-03-23",
        time: "2:00 PM",
        status: "booked",
        customer: {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "555-987-6543"
        }
      },
      {
        id: "3",
        customerId: "c3",
        date: "2025-03-20",
        time: "4:30 PM",
        status: "completed",
        customer: {
          name: "Mike Johnson",
          email: "mike@example.com",
          phone: "555-456-7890"
        }
      }
    ];
    
    setAppointments(mockAppointments);
    filterAppointments(mockAppointments, activeTab, searchTerm);
    setIsLoading(false);
  }, []);

  const filterAppointments = (
    appts: Appointment[],
    tab: string,
    search: string
  ) => {
    const now = new Date();
    let filtered = [...appts];

    // Filter by tab
    if (tab === "upcoming") {
      filtered = filtered.filter(
        (appt) => new Date(appt.date) >= now && appt.status !== "cancelled"
      );
    } else if (tab === "past") {
      filtered = filtered.filter(
        (appt) => new Date(appt.date) < now || appt.status === "completed"
      );
    } else if (tab === "cancelled") {
      filtered = filtered.filter((appt) => appt.status === "cancelled");
    }

    // Filter by search term
    if (search && search.length > 0) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (appt) =>
          appt.customer?.name.toLowerCase().includes(searchLower) ||
          appt.customer?.email.toLowerCase().includes(searchLower) ||
          appt.customer?.phone.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return tab === "past" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

    setFilteredAppointments(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterAppointments(appointments, activeTab, value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filterAppointments(appointments, value, searchTerm);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Appointment Management</h1>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by customer name, email, or phone..."
              className="w-full md:w-[300px] pl-9"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="upcoming" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No upcoming appointments found</p>
                <p className="text-muted-foreground text-center mt-1">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "All upcoming appointments will appear here"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between">
                      <span>{appointment.time}</span>
                      <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {appointment.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.customer?.name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.customer?.email}</p>
                        <a 
                          href={`tel:${appointment.customer?.phone}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                          data-component-name="CustomersPage"
                        >
                          <span className="underline-offset-4 group-hover:underline">{appointment.customer?.phone}</span>
                        </a>
                      </div>
                      <div className="pt-2 flex justify-end space-x-2">
                        <Button size="sm" variant="outline">Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No past appointments found</p>
                <p className="text-muted-foreground text-center mt-1">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "All past appointments will appear here"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between">
                      <span>{appointment.time}</span>
                      <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {appointment.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.customer?.name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.customer?.email}</p>
                        <a 
                          href={`tel:${appointment.customer?.phone}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                          data-component-name="CustomersPage"
                        >
                          <span className="underline-offset-4 group-hover:underline">{appointment.customer?.phone}</span>
                        </a>
                      </div>
                      <div className="pt-2 flex justify-end space-x-2">
                        <Button size="sm" variant="outline">Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No cancelled appointments found</p>
                <p className="text-muted-foreground text-center mt-1">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "All cancelled appointments will appear here"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between">
                      <span>{appointment.time}</span>
                      <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {appointment.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{appointment.customer?.name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.customer?.email}</p>
                        <a 
                          href={`tel:${appointment.customer?.phone}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                          data-component-name="CustomersPage"
                        >
                          <span className="underline-offset-4 group-hover:underline">{appointment.customer?.phone}</span>
                        </a>
                      </div>
                      <div className="pt-2 flex justify-end space-x-2">
                        <Button size="sm" variant="outline">Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <Toaster position="top-right" />
    </div>
  );
}
