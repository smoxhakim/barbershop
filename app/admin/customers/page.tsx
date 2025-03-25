"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowLeft, User, Mail, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import { Toaster } from "sonner";
// Define Customer interface for client-side usage
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  appointmentCount?: number;
}

export default function CustomersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Placeholder data for development
    const mockCustomers: Customer[] = [
      {
        id: "c1",
        name: "John Doe",
        email: "john@example.com",
        phone: "555-123-4567",
        appointmentCount: 3
      },
      {
        id: "c2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "555-987-6543",
        appointmentCount: 1
      },
      {
        id: "c3",
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "555-456-7890",
        appointmentCount: 2
      },
      {
        id: "c4",
        name: "Sarah Williams",
        email: "sarah@example.com",
        phone: "555-789-0123",
        appointmentCount: 0
      }
    ];
    
    setCustomers(mockCustomers);
    filterCustomers(mockCustomers, searchTerm);
    setIsLoading(false);
  }, []);

  const filterCustomers = (custs: Customer[], search: string) => {
    if (!search) {
      setFilteredCustomers(custs);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = custs.filter(
      (cust) =>
        cust.name.toLowerCase().includes(searchLower) ||
        cust.email.toLowerCase().includes(searchLower) ||
        cust.phone.toLowerCase().includes(searchLower)
    );

    setFilteredCustomers(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterCustomers(customers, value);
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
          <h1 className="text-2xl font-bold">Customer Management</h1>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, email, or phone..."
              className="w-full md:w-[300px] pl-9"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No customers found</p>
              <p className="text-muted-foreground text-center mt-1">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Customers will appear here once they make appointments"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Appointments</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {customer.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <a 
                          href={`tel:${customer.phone}`} 
                          className="flex items-center hover:text-primary transition-colors group"
                          data-component-name="CustomersPage"
                        >
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary" />
                          <span className="underline-offset-4 group-hover:underline">{customer.phone}</span>
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {customer.appointmentCount || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Filter appointments for this customer
                            const searchParam = encodeURIComponent(customer.email);
                            router.push(`/admin/appointments?search=${searchParam}`);
                          }}
                        >
                          View Appointments
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <Toaster position="top-right" />
    </div>
  );
}
