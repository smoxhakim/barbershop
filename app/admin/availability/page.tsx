"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Clock, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AvailabilityPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("days");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [blockedDays, setBlockedDays] = useState<Date[]>([]);
  const [blockedTimeSlots, setBlockedTimeSlots] = useState<{date: string; time: string; reason: string}[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | undefined>(undefined);
  const [modalTime, setModalTime] = useState("");
  const [modalReason, setModalReason] = useState("");
  
  // Available time slots
  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", 
    "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
  ];
  
  // Placeholder data for development
  useEffect(() => {
    // Set some example blocked days
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    setBlockedDays([tomorrow, nextWeek]);
    
    // Set some example blocked time slots
    setBlockedTimeSlots([
      {
        date: format(today, "yyyy-MM-dd"),
        time: "12:00 PM",
        reason: "Lunch break"
      },
      {
        date: format(tomorrow, "yyyy-MM-dd"),
        time: "2:00 PM",
        reason: "Staff meeting"
      }
    ]);
    
    setIsLoading(false);
  }, []);
  
  const handleDayClick = (day: Date) => {
    // Toggle the day's blocked status
    if (isDateBlocked(day)) {
      setBlockedDays(blockedDays.filter(d => 
        d.getDate() !== day.getDate() || 
        d.getMonth() !== day.getMonth() || 
        d.getFullYear() !== day.getFullYear()
      ));
    } else {
      setBlockedDays([...blockedDays, day]);
    }
  };
  
  const isDateBlocked = (date: Date): boolean => {
    return blockedDays.some(d => 
      d.getDate() === date.getDate() && 
      d.getMonth() === date.getMonth() && 
      d.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center mb-6">
        <Link href="/admin/dashboard">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Availability Management</h1>
      </div>

      <Tabs defaultValue="days" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="days">Blocked Days</TabsTrigger>
          <TabsTrigger value="times">Blocked Time Slots</TabsTrigger>
        </TabsList>

        <TabsContent value="days" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Blocked Days</CardTitle>
              <CardDescription>
                Block entire days when the barbershop will be closed (holidays, days off, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-4">Click on a day to toggle its blocked status</p>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) handleDayClick(date);
                  }}
                  modifiers={{
                    blocked: blockedDays
                  }}
                  modifiersStyles={{
                    blocked: { 
                      backgroundColor: '#FEE2E2', 
                      color: '#EF4444',
                      textDecoration: 'line-through' 
                    }
                  }}
                  className="border rounded-md p-2"
                />
                <div className="mt-4 flex items-center justify-center">
                  <div className="flex items-center mr-4">
                    <div className="w-4 h-4 bg-[#FEE2E2] rounded-full mr-2"></div>
                    <span className="text-sm">Blocked</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-white border rounded-full mr-2"></div>
                    <span className="text-sm">Available</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="times" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Blocked Time Slots</CardTitle>
              <CardDescription>
                Block specific time slots on specific days (lunch breaks, meetings, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col p-6">
                <div className="text-center mb-6">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Time Slot Management</p>
                  <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                    This feature allows you to block specific time slots on specific days.
                    Select a date and then choose which time slots to block.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setIsModalOpen(true)} data-component-name="_c">
                      Block New Time Slot
                    </Button>
                  </div>
                </div>
                
                {blockedTimeSlots.length > 0 ? (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Currently Blocked Time Slots</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {blockedTimeSlots.map((slot, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{slot.time}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{new Date(slot.date).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{slot.reason}</p>
                              <div className="pt-2 flex justify-end">
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => {
                                    setBlockedTimeSlots(blockedTimeSlots.filter((_, i) => i !== index));
                                    toast.success("Time slot unblocked");
                                  }}
                                >
                                  Unblock
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center mt-6 p-8 border rounded-lg">
                    <p className="text-muted-foreground">No blocked time slots yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Time Slot Blocking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Block a Time Slot</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <div className="border rounded-md p-2">
                  <DayPicker
                    mode="single"
                    selected={modalDate}
                    onSelect={setModalDate}
                    className="mx-auto"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Select Time Slot</Label>
                <Select value={modalTime} onValueChange={setModalTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Input
                  id="reason"
                  value={modalReason}
                  onChange={(e) => setModalReason(e.target.value)}
                  placeholder="e.g., Lunch break, Staff meeting"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (!modalDate || !modalTime) {
                    toast.error("Please select both date and time");
                    return;
                  }
                  
                  const newSlot = {
                    date: format(modalDate, "yyyy-MM-dd"),
                    time: modalTime,
                    reason: modalReason || "Not available"
                  };
                  
                  // Check if this slot is already blocked
                  const isAlreadyBlocked = blockedTimeSlots.some(
                    slot => slot.date === newSlot.date && slot.time === newSlot.time
                  );
                  
                  if (isAlreadyBlocked) {
                    toast.error("This time slot is already blocked");
                    return;
                  }
                  
                  setBlockedTimeSlots([...blockedTimeSlots, newSlot]);
                  setIsModalOpen(false);
                  setModalDate(undefined);
                  setModalTime("");
                  setModalReason("");
                  toast.success("Time slot blocked successfully");
                }}
              >
                Block Time Slot
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Toaster position="top-right" />
    </div>
  );
}
