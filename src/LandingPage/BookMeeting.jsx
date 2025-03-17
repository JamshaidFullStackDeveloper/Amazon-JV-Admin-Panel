import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const timeSlots = [
    "12:30 PM - 01:00 PM",
    "01:00 PM - 01:30 PM",
    "01:30 PM - 02:00 PM",
    "02:00 PM - 02:30 PM",
    "02:30 PM - 03:00 PM",
];

const MeetingBooking = () => {
    const [date, setDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const calendarRef = useRef(null);

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDateSelect = (selectedDate) => {
        setDate(selectedDate);
        setIsCalendarOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center  p-6 ">
            {/* Left Section: Form */}
            <Card className="p-6 w-full md:w-1/2 rounded-lg shadow-lg bg-white">
                <h2 className="text-xl font-semibold">Schedule Your Investment Consultation</h2>
                <p className="text-gray-500">Book a one-on-one meeting with our investment advisor</p>

                <div className="mt-4">
                    <Label>Full Name</Label>
                    <Input placeholder="Enter your full name" />
                </div>

                <div className="mt-4">
                    <Label>Email Address</Label>
                    <Input placeholder="Enter your email address" />
                </div>

                <div className="mt-4">
                    <Label>Phone Number</Label>
                    <Input placeholder="Enter phone number" />
                </div>

                <div className="mt-4">
                    <Label>Additional Notes</Label>
                    <Input placeholder="Enter any additional information or questions" />
                </div>

                <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700">Book Meeting</Button>
            </Card>

            {/* Right Section: Date & Time Selection */}
            <Card className="p-6 w-full md:w-1/2 rounded-lg shadow-lg bg-white mt-6 md:mt-0 md:ml-6 relative">
                <h2 className="text-lg font-semibold">Select Your Time Slot</h2>

                <div className="mt-4 relative" ref={calendarRef}>
                    <Label>Choose a date</Label>

                    {/* Date Picker (Click to Open Calendar) */}
                    <div
                        className="cursor-pointer p-3 border rounded-md bg-gray-100 hover:bg-gray-200"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    >
                        {date ? format(date, "EEEE, MMMM dd, yyyy") : "Select a date"}
                    </div>

                    {/* Calendar Modal Below Date Picker */}
                    {isCalendarOpen && (
                        <div className="absolute left-0 mt-2 w-[auto] bg-white border rounded-md shadow-lg p-3 z-50">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateSelect}
                                className="rounded-md"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-4 space-y-2">
                    {timeSlots.map((slot, index) => (
                        <button
                            key={index}
                            className={cn(
                                "w-full p-3 text-left border rounded-md transition",
                                selectedTime === slot ? "bg-blue-600 text-white" : "bg-gray-100"
                            )}
                            onClick={() => setSelectedTime(slot)}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default MeetingBooking;
