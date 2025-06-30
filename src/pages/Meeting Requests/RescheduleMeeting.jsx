import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isBefore, startOfDay } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "@/redux/GetApiSlice/Index";
import { formatDateToDDMMYYYY } from "@/utils/formatDateToDDMMYYYY";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { postData, resetPostState } from "@/redux/PostApiSlice/Index";
import { useGlobalToast } from "@/context/ToastContext";
import { fetchGetData } from "@/redux/GetApiSlice/GetSlice";


const RescheduleMeeting = ({ onClose, id }) => {
    const dispatch = useDispatch();
    const { showToast } = useGlobalToast();
    const [date, setDate] = useState(new Date());
    const [openSlot, setOpenSlot] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(15);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [openSlotId, setOpenSlotId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const calendarRef = useRef(null);

    const [formdata, setFormdata] = useState({
        name: "",
        email: "",
        phone: "",
        additional_notes: "",
        slot_id: null,
        slot_start_time: "",
        slot_end_time: "",
        booking_date: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        selectedTime: ""
    });

    const { getdata, status, error, successMessage } = useSelector((state) => state.getapi);
    const { postStatus, postError, postSuccessMessage } = useSelector((state) => state.postApi);
    const data = getdata || [];
    const durations = [15, 30, 45]; // in minutes
    const formatted = formatDateToDDMMYYYY(date);

    useEffect(() => {
        dispatch(fetchGetData(`/time-slots?date=${formatted}`)).finally();
    }, [date]);

    useEffect(() => {
        if (postStatus == "succeeded") {
            onClose()
            dispatch(resetPostState())
            showToast(postSuccessMessage, "success")
        } else if (postStatus == "failed") {
            showToast(postError, "error")
            dispatch(resetPostState())
        }
    }, [postStatus])

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

    // Handle API response
    useEffect(() => {
        if (postStatus === 'fulfilled') {
            setIsSubmitting(false);
            // Reset form on successful submission
            setFormdata({

                slot_id: null,
                slot_start_time: "",
                slot_end_time: "",
                booking_date: ""
            });
            setSelectedTime(null);
            setErrors({

                selectedTime: ""
            });
        } else if (postStatus === 'rejected') {
            setIsSubmitting(false);
        }
    }, [postStatus]);

    // Validation functions


    // Handle input changes with real-time validation
    const handleInputChange = (field, value) => {
        setFormdata(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }

    };

    // Validate all fields
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
        if (!selectedTime) {
            newErrors.selectedTime = "Please select a time slot";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    // Utility to convert "HH:mm" to Date object
    const parseTime = (timeStr, baseDate) => {
        if (!timeStr || typeof timeStr !== "string" || !timeStr.includes(":")) return null;

        const [hours, minutes] = timeStr.split(":").map(Number);
        const dateCopy = new Date(baseDate);
        dateCopy.setHours(hours, minutes, 0, 0);
        return dateCopy;
    };

    const parseTimeString = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const formatTimeRange = (start, end) => {
        return `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`;
    };

    // Utility to check if two time ranges overlap
    const doTimesOverlap = (start1, end1, start2, end2) => {
        return start1 < end2 && start2 < end1;
    };

    // // Split large time ranges into chunks and filter out booked ones
    const generateTimeChunks = (slot, duration) => {
        const chunks = [];
        const fromTime = parseTime(slot?.from, date);
        const toTime = parseTime(slot?.to, date);

        if (!fromTime || !toTime) return chunks; // ⛔ skip invalid slots

        // Format selected date to match API format (YYYY-MM-DD)
        const selectedDateStr = format(date, "yyyy-MM-dd");

        let current = new Date(fromTime);
        while (current < toTime) {
            const end = new Date(current.getTime() + duration * 60000);
            if (end > toTime) break;

            console.log(data.data);

            // Check if this chunk is already booked on the selected date
            const isChunkBooked = data?.data?.booked_slots?.some((booked) => {
                // Only check booked slots for the same slot_id
                if (booked.slot_id !== slot.id) return false;

                // Only check booked slots for the same date
                if (booked.booking_date !== selectedDateStr) return false;

                // Parse booked slot times (format: "HH:mm:ss" or "HH:mm")
                const bookedStartStr = booked.slot_start_time.split(':').slice(0, 2).join(':');
                const bookedEndStr = booked.slot_end_time.split(':').slice(0, 2).join(':');

                const bookedStart = parseTime(bookedStartStr, date);
                const bookedEnd = parseTime(bookedEndStr, date);

                if (!bookedStart || !bookedEnd) return false;

                // Check if current chunk exactly matches or overlaps with booked slot
                return doTimesOverlap(current, end, bookedStart, bookedEnd);
            });
            console.log(isChunkBooked);


            // Only add chunk if it's NOT booked
            if (!isChunkBooked) {
                chunks.push({
                    id: `${slot.id}-${current.getTime()}`,
                    slotId: slot.id,
                    label: formatTimeRange(current, end),
                    start: current,
                    end: end,
                });
            }

            current = end;
        }

        return chunks;
    };

    const handelSelcetTime = (chunk, slot) => {
        setSelectedTime(chunk.label);
        setFormdata((prev) => ({
            ...prev,
            slot_id: slot.id,
            slot_start_time: format(chunk.start, "HH:mm"),
            slot_end_time: format(chunk.end, "HH:mm"),
        }));

        // Clear time selection error
        if (errors.selectedTime) {
            setErrors(prev => ({ ...prev, selectedTime: "" }));
        }
    };

    const handleDateSelect = (selectedDate) => {
        setDate(selectedDate);
        setIsCalendarOpen(false);
        setOpenSlotId(null); // Reset dropdowns on date change
        setSelectedTime(null); // Reset selected time
        setFormdata(prev => ({
            ...prev,
            slot_id: null,
            slot_start_time: "",
            slot_end_time: "",
        }));
    };

    const toggleSlotDropdown = (slotId) => {
        setOpenSlotId((prev) => (prev === slotId ? null : slotId));
    };

    const handelSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        const updatedFormData = {
            ...formdata,
            booking_date: format(date, "yyyy-MM-dd"), // required format for backend
        };

        try {
            const payload = {
                status: "reschedule",
                booking_date: format(date, "dd-MM-yyyy"),
                slot_id: openSlotId,
                request_id: id,
                slot_start_time: formdata.slot_start_time,
                slot_end_time: formdata.slot_end_time,
            }
            await dispatch(postData({ endpoint: `/bookings/status`, payload: payload })).finally(() => {
                onClose();

            });
        } catch (error) {
            console.error("Submission error:", error);
            setIsSubmitting(false);
        }

    };

    return (
        <Card className=" w-full md:w-[600px] md:max-w-5xl rounded-lg shadow-none border-none bg-white mt-6 md:mt-0  relative">

            <h2 className="text-lg font-semibold">Select Available Time Slot</h2>

            {/* Date Picker */}
            <div className="mt-4 relative" ref={calendarRef}>
                <Label>Choose a date</Label>
                <div
                    className="cursor-pointer p-3 border rounded-md bg-gray-100 hover:bg-gray-200"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                    {date ? format(date, "EEEE, MMMM dd, yyyy") : "Select a date"}
                </div>
                {isCalendarOpen && (
                    <div className="absolute left-0 mt-2 w-[auto] bg-white border rounded-md shadow-lg p-3 z-50">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            className="rounded-md"
                            disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
                        />
                    </div>
                )}
            </div>

            {/* Duration Tabs */}
            <div className="flex gap-2 mt-4">
                {durations.map((dur) => (
                    <Button
                        key={dur}
                        className={cn("w-full p-3 text-left border rounded-md transition", selectedDuration === dur ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-gray-100")}
                        variant={selectedDuration === dur ? "default" : "outline"}
                        onClick={() => setSelectedDuration(dur)}
                    >
                        {dur} mins
                    </Button>
                ))}
            </div>

            {/* Time Slot Selection */}
            <div className="mt-4">
                <Label>Select Time Slot <span className="text-red-500">*</span></Label>
                {errors.selectedTime && <p className="text-red-500 text-sm mt-1">{errors.selectedTime}</p>}
            </div>

            {/* Slot Dropdowns */}
            <div className="mt-2 space-y-4 max-h-72 overflow-auto pr-2">
                {data?.data?.slots?.length > 0 ? (
                    data?.data?.slots.map((slot) => (
                        <div key={slot.id} className="border border-gray-300 rounded-md">
                            <div onClick={() => toggleSlotDropdown(slot.id)} className="flex justify-between items-center w-full p-3 bg-gray-100 text-left">
                                <button className="w-full text-left px-4 py-2 bg-gray-100 rounded-t-md">
                                    {`${format(parseTimeString(slot.from), "hh:mm a")} - ${format(parseTimeString(slot.to), "hh:mm a")}`}
                                </button>
                                {openSlotId === slot.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                            {openSlotId === slot.id && (
                                <div className="p-2 space-y-2 max-h-48 overflow-y-auto">
                                    {generateTimeChunks(slot, selectedDuration).length > 0 ? (
                                        generateTimeChunks(slot, selectedDuration)?.map((chunk) => (
                                            <button
                                                key={chunk.id}
                                                className={cn(
                                                    "w-full p-2 text-left border rounded-md",
                                                    selectedTime === chunk.label
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-100"
                                                )}
                                                onClick={() => handelSelcetTime(chunk, slot)}
                                            >
                                                {chunk.label}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm">No available chunks.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm">No slots available for selected date.</p>
                )}
            </div>
            <Button onClick={() => handelSubmit()} className={"mt-10 bg-blue-500 hover:bg-blue-600"}> {postStatus === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rescheduling...
                </span>
            ) : (
                "Reschedule Meeting"
            )}</Button>
        </Card>

    );
};

export default RescheduleMeeting;