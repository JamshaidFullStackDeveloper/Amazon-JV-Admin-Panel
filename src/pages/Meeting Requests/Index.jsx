"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, X, RotateCcw, Settings, Video, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Edit, Plus, XIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DashboardLayout from "@/layouts/Layout"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from "react-redux"
import { fetchGetData, resetData } from "@/redux/GetApiSlice/GetSlice"
import { postData, resetPostStatus } from "@/redux/PostApiSlice/Index"
import { deleteData } from "@/redux/DeleteApiSlice"
import { fetchData, resetFetchedData } from "@/redux/GetApiSlice/Index"
import { useLoader } from "@/context/LoaderContext"
import { useGlobalToast } from "@/context/ToastContext"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog"
import CustomModal from "@/components/OpenModal"
import RescheduleMeeting from "./RescheduleMeeting"

const meetingRequestsData = [
    {
        id: 1,
        date: "02 Jun 2024",
        time: "12:30 01:00 PM",
        requester: "Muneb Ali",
        description:
            "Post lorem ipsum served the same purpose for written content as stock photos do now. Post lorem ipsum served.",
        status: "pending",
        dateCreated: "2024-06-01",
        dateModified: "2024-06-02",
    },
    {
        id: 2,
        date: "01 Jun 2024",
        time: "10:15 11:00 AM",
        requester: "Ahmed Khan",
        description:
            "Post lorem ipsum served the same purpose for written content as stock photos do now. Post lorem ipsum served.",
        status: "rejected",
        dateCreated: "2024-05-30",
        dateModified: "2024-06-01",
    },
    {
        id: 3,
        date: "03 Jun 2024",
        time: "02:45 03:30 PM",
        requester: "Sarah Wilson",
        description:
            "Post lorem ipsum served the same purpose for written content as stock photos do now. Post lorem ipsum served.",
        status: "approved",
        dateCreated: "2024-06-02",
        dateModified: "2024-06-03",
    },
    {
        id: 4,
        date: "04 Jun 2024",
        time: "09:00 10:00 AM",
        requester: "John Smith",
        description:
            "Post lorem ipsum served the same purpose for written content as stock photos do now. Post lorem ipsum served.",
        status: "reschedule",
        dateCreated: "2024-06-03",
        dateModified: "2024-06-04",
    },
    {
        id: 5,
        date: "05 Jun 2024",
        time: "03:15 04:00 PM",
        requester: "Lisa Brown",
        description:
            "Post lorem ipsum served the same purpose for written content as stock photos do now. Post lorem ipsum served.",
        status: "pending",
        dateCreated: "2024-06-04",
        dateModified: "2024-06-05",
    },
    {
        id: 6,
        date: "06 Jun 2024",
        time: "11:30 12:15 PM",
        requester: "David Lee",
        description:
            "Post lorem ipsum served the same purpose for written content as stock photos do now. Post lorem ipsum served.",
        status: "pending",
        dateCreated: "2024-06-05",
        dateModified: "2024-06-06",
    },
]

function formatTime(hour, minute, period) {
    let h = parseInt(hour);
    if (period === "PM" && h < 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${minute}`;
}

function calculateDuration(start, end) {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
}


const parseTime = (timeStr) => {
    const [hourStr, minuteStr] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const period = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return { hour: hour.toString(), minute, period };
};

export default function MeetingRequests() {
    const dispatch = useDispatch()
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useGlobalToast();
    const [requests, setRequests] = useState(meetingRequestsData)
    const [showManageSlotsModal, setShowManageSlotsModal] = useState(false)
    const [SelectedRequestId, setSelectedRequestId] = useState(null);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [openReshaduleMeeing, setOpenResheduleMeeting] = useState(false)
    const [rescheduleId, setRescheduleId] = useState(null)
    const { postStatus, postError, postSuccessMessage } = useSelector((state) => state.postApi);
    const { getdata, status, error, successMessage } = useSelector((state) => state.getapi);
    const { data } = useSelector((state) => state.api);

    const [approvingId, setApprovingId] = useState(null);
    const [meetingLink, setMeetingLink] = useState(getdata?.data?.meeting_link)
    const [eventName, setEventName] = useState(getdata?.data?.event_name)
    const [loading, setIsLoading] = useState(false)
    const AllRequest = Array.isArray(data?.data) ? data.data : [];

    useEffect(() => {
        showLoader()
        dispatch(resetData())
        dispatch(fetchGetData("/time-slots")).finally(hideLoader)
    }, [dispatch, postSuccessMessage])
    useEffect(() => {
        dispatch(resetFetchedData())
        dispatch(fetchData("/meeting-requests"))
    }, [postSuccessMessage])

    const [slots, setSlots] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    });

    const apiSlots = getdata?.data?.slots;

    useEffect(() => {
        const updatedSlots = { ...slots };

        apiSlots?.forEach(slot => {
            const { hour: startHour, minute: startMinute, period: startPeriod } = parseTime(slot.from);
            const { hour: endHour, minute: endMinute, period: endPeriod } = parseTime(slot.to);

            const slotData = {
                id: slot.id,
                startHour,
                startMinute,
                startPeriod,
                endHour,
                endMinute,
                endPeriod,
            };

            // Only add if the slot with this ID doesn't already exist
            if (updatedSlots[slot.day_name]) {
                const alreadyExists = updatedSlots[slot.day_name].some(existingSlot => existingSlot.id === slot.id);
                if (!alreadyExists) {
                    updatedSlots[slot.day_name].push(slotData);
                }
            }
        });

        setSlots(updatedSlots);
    }, [apiSlots]);

    const [editingSlot, setEditingSlot] = useState(null)
    const [newSlot, setNewSlot] = useState({
        day: "",
        startHour: "",
        startMinute: "",
        startPeriod: "AM",
        endHour: "",
        endMinute: "",
        endPeriod: "AM",
    })
    const [slotErrors, setSlotErrors] = useState({})
    const [statusFilter, setStatusFilter] = useState("all")

    // Generate hours (1-12)
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString())

    // Generate minutes (00, 15, 30, 45)
    const minutes = ["00", "15", "30", "45"]

    // Periods
    const periods = ["AM", "PM"]

    const handleReject = (id) => {
        setSelectedRequestId(id)
        setShowRejectDialog(true)
    }

    const confirmReject = () => {
        const payload = {
            request_id: SelectedRequestId,
            status: "rejected"
        }
        dispatch(postData({ endpoint: `/bookings/status`, payload })).unwrap();
    }

    const handleApprove = (id) => {
        setApprovingId(id);
        const payload = {
            request_id: id,
            status: "approved"
        }
        dispatch(postData({ endpoint: `/bookings/status`, payload })).finally(setApprovingId(null));

    }


    const handleReschedule = (id) => {
        setOpenResheduleMeeting(true);
        setRescheduleId(id);
    }

    const getStatusDisplay = (status) => {
        switch (status) {
            case "rejected":
                return (
                    <div className="flex items-center gap-2 text-red-600 h-10">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">Rejected</span>
                    </div>
                )

            default:
                return null
        }
    }

    const convertTimeToMinutes = (hour, minute, period) => {
        let totalMinutes = Number.parseInt(hour) * 60 + Number.parseInt(minute)
        if (period === "PM" && hour !== "12") totalMinutes += 12 * 60
        if (period === "AM" && hour === "12") totalMinutes -= 12 * 60
        return totalMinutes
    }

    const formatTimeDisplay = (hour, minute, period) => {
        return `${hour}:${minute} ${period}`
    }

    const validateSlotTime = (
        day,
        startHour,
        startMinute,
        startPeriod,
        endHour,
        endMinute,
        endPeriod,
        excludeId = null,
    ) => {
        const errors = {}

        if (!startHour || !startMinute || !endHour || !endMinute) {
            errors.time = "All time fields are required"
            return errors
        }

        const startMinutes = convertTimeToMinutes(startHour, startMinute, startPeriod)
        const endMinutes = convertTimeToMinutes(endHour, endMinute, endPeriod)

        if (startMinutes >= endMinutes) {
            errors.time = "Start time must be before end time"
            return errors
        }

        // Check for overlapping slots
        const daySlots = slots[day] || []
        const overlapping = daySlots.find((slot) => {
            if (excludeId && slot.id === excludeId) return false
            const slotStart = convertTimeToMinutes(slot.startHour, slot.startMinute, slot.startPeriod)
            const slotEnd = convertTimeToMinutes(slot.endHour, slot.endMinute, slot.endPeriod)
            return startMinutes < slotEnd && endMinutes > slotStart
        })

        if (overlapping) {
            const overlapDisplay =
                formatTimeDisplay(overlapping.startHour, overlapping.startMinute, overlapping.startPeriod) +
                " - " +
                formatTimeDisplay(overlapping.endHour, overlapping.endMinute, overlapping.endPeriod)
            errors.overlap = `This slot overlaps with existing slot: ${overlapDisplay}`
        }

        return errors
    }

    const handleAddSlot = (day) => {
        setNewSlot({
            day,
            startHour: "",
            startMinute: "",
            startPeriod: "AM",
            endHour: "",
            endMinute: "",
            endPeriod: "AM",
        });
    };


    const saveNewSlot = async () => {
        // Validate time input
        if (!newSlot.startHour || !newSlot.endHour || !newSlot.startMinute || !newSlot.endMinute) {
            setSlotErrors({ time: "Please fill out all time fields." });
            return;
        }

        // Convert to 24-hour format
        const to24Hour = (hour, minute, period) => {
            let h = parseInt(hour);
            if (period === "PM" && h !== 12) h += 12;
            if (period === "AM" && h === 12) h = 0;
            return `${String(h).padStart(2, "0")}:${minute}`;
        };

        const from = to24Hour(newSlot.startHour, newSlot.startMinute, newSlot.startPeriod);
        const to = to24Hour(newSlot.endHour, newSlot.endMinute, newSlot.endPeriod);

        // Optional: Basic time range validation
        if (from >= to) {
            setSlotErrors({ time: "Start time must be before end time." });
            return;
        }
        const start = formatTime(newSlot.startHour, newSlot.startMinute, newSlot.startPeriod); // e.g., "13:00"
        const end = formatTime(newSlot.endHour, newSlot.endMinute, newSlot.endPeriod);         // e.g., "15:00"
        const duration = calculateDuration(start, end);

        // Optional: find correct day_of_week (0=Sunday, 1=Monday, ..., 6=Saturday)
        const dayMap = {
            Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
            Thursday: 4, Friday: 5, Saturday: 6
        };
        const day_of_week = dayMap[newSlot.day];

        // Final slot object
        const slotToSend = {
            [`slots[0][day_of_week]`]: day_of_week,
            [`slots[0][from]`]: start,
            [`slots[0][to]`]: end,
            [`slots[0][duration]`]: duration,
            // Only include `id` if you're updating an existing slot
            // `id` can be left out or set to null for a new slot
            // [`slots[0][id]`]: newSlot.id || "",
        };
        // Prepare payload
        const payload = {
            day_name: newSlot.day, // e.g., "Monday"
            from,
            to,
            // is_active: true,
        };

        try {
            const response = dispatch(postData({ endpoint: `/time-slots`, payload: slotToSend }))

            // if (!response.ok) throw new Error("Failed to add slot");
            setNewSlot({
                day: "",
                startHour: "",
                startMinute: "",
                startPeriod: "AM",
                endHour: "",
                endMinute: "",
                endPeriod: "AM",
            });
            setSlotErrors({});

            const savedSlot = await response.json(); // expects the same shape as your API's GET response

            // Add to local state in 12-hour format
            const parseTime = (timeStr) => {
                const [hourStr, minute] = timeStr.split(":");
                let hour = parseInt(hourStr);
                const period = hour >= 12 ? "PM" : "AM";
                if (hour > 12) hour -= 12;
                if (hour === 0) hour = 12;
                return { hour: hour.toString(), minute, period };
            };

            const start = parseTime(savedSlot.from);
            const end = parseTime(savedSlot.to);

            const newFormattedSlot = {
                id: savedSlot.id,
                startHour: start.hour,
                startMinute: start.minute,
                startPeriod: start.period,
                endHour: end.hour,
                endMinute: end.minute,
                endPeriod: end.period,
            };

            setSlots((prevSlots) => ({
                ...prevSlots,
                [newSlot.day]: [...prevSlots[newSlot.day], newFormattedSlot],
            }));

            // Reset state
            setNewSlot({
                day: "",
                startHour: "",
                startMinute: "",
                startPeriod: "AM",
                endHour: "",
                endMinute: "",
                endPeriod: "AM",
            });
            setSlotErrors({});
        } catch (error) {
            setSlotErrors({ time: postError });
            console.error(error);
        }
    };


    const handleEditSlot = (day, slot) => {
        setEditingSlot({ ...slot, day })
        setSlotErrors({})
    }

    const saveEditSlot = async () => {

        const start = formatTime(editingSlot.startHour, editingSlot.startMinute, editingSlot.startPeriod); // e.g., "13:00"
        const end = formatTime(editingSlot.endHour, editingSlot.endMinute, editingSlot.endPeriod);         // e.g., "15:00"
        const duration = calculateDuration(start, end);
        const dayMap = {
            Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
            Thursday: 4, Friday: 5, Saturday: 6
        };
        const day_of_week = dayMap[editingSlot.day];
        const slotToSend = {
            [`slots[0][day_of_week]`]: day_of_week,
            [`slots[0][from]`]: start,
            [`slots[0][to]`]: end,
            [`slots[0][duration]`]: duration,
            [`slots[0][id]`]: editingSlot.id || "",
        };

        try {
            const response = dispatch(postData({ endpoint: `/update-time-slots`, payload: slotToSend }))

            // if (!response.ok) throw new Error("Failed to add slot");
            setEditingSlot(null)
            setSlotErrors({})
        } catch (error) {
            setSlotErrors({ time: postError });
            console.error(error);
        }

    }

    const handleDeleteSlot = (day, slotId) => {
        console.log(slotId);
        dispatch(deleteData({ endpoint: `/time-slots?slot_ids${[]}=${[slotId]}` }))
        setSlots((prev) => ({
            ...prev,
            [day]: prev[day].filter((slot) => slot.id !== slotId),
        }))
    }

    const getDayInitial = (day) => {
        const initials = {
            Monday: "M",
            Tuesday: "T",
            Wednesday: "W",
            Thursday: "T",
            Friday: "F",
            Saturday: "S",
            Sunday: "S",
        }
        return initials[day]
    }

    const getDayColor = (day) => {
        const colors = {
            Monday: "bg-blue-500",
            Tuesday: "bg-blue-500",
            Wednesday: "bg-blue-500",
            Thursday: "bg-blue-500",
            Friday: "bg-blue-500",
            Saturday: "bg-blue-500",
            Sunday: "bg-blue-500",
        }
        return colors[day]
    }

    // Sorting function
    const sortRequests = (AllRequest, sortBy) => {
        console.log(AllRequest);

        return [...AllRequest].sort((a, b) => {
            switch (sortBy) {
                case "date-modified":
                    return new Date(b.dateModified) - new Date(a.dateModified)
                case "date-created":
                    return new Date(b.dateCreated) - new Date(a.dateCreated)
                case "name":
                    return a.requester.localeCompare(b.requester)
                case "status":
                    return a.status.localeCompare(b.status)
                default:
                    return 0
            }
        })
    }
    const handelUpdate = () => {


        const payload = {
            event_name: String(eventName || "").trim(),
            meeting_link: String(meetingLink || "").trim(),
        };

        setIsLoading(true)
        dispatch(postData({ endpoint: `/update-time-slots`, payload }))
            .finally(() => {
                dispatch(resetPostStatus());
                // setShowManageSlotsModal(false);
                setIsLoading(false)
            });
        setIsLoading(false)
    };


    // const allRequests = sortRequests(AllRequest, sortBy)
    const newlyRequests = requests.filter((req) => req.status === "pending")
    const filteredAllRequests = AllRequest?.filter((request) => {
        if (statusFilter === "all") return true
        return request.request.status === statusFilter
    })

    // console.log(filteredAllRequests);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6  md:px-12 mx-auto py-6">
                <div className=" mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Meeting Requests</h1>
                            <p className="text-gray-600 text-sm md:text-base">
                                View and manage the slots that users have booked. Admin can also add, modify, or remove available slots
                                for meetings.
                            </p>
                        </div>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white self-start sm:self-auto"
                            onClick={() => setShowManageSlotsModal(true)}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Manage Meeting Slots
                        </Button>
                    </div>

                    {/* Main Content */}
                    <div className="">
                        {/* All Requests Section */}
                        <div className=" space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h2 className="text-lg font-semibold text-gray-900">All Requests ({filteredAllRequests?.length})</h2>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-full sm:w-[140px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            {/* <SelectItem value="approved">Approved</SelectItem> */}
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="reschedule">Reschedule</SelectItem>
                                        </SelectContent>
                                    </Select>

                                </div>
                            </div>

                            {/* All Requests Grid */}
                            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> */}
                            {/* {filteredAllRequests && filteredAllRequests.length > 0 ? ( */}
                            {/* filteredAllRequests.map((request) => ( */}
                            {/* <Card key={request.id} className="h-fit"> */}
                            {/* <CardHeader className="pb-3"> */}
                            {/* <div className="flex items-center gap-2 text-sm text-gray-500 mb-2"> */}
                            {/* <Calendar className="h-4 w-4" /> */}
                            {/* <span>{new Date(request.booking_date).toLocaleDateString()}</span> */}
                            {/* </div> */}
                            {/* <div className="flex items-center gap-2 text-sm text-gray-500 mb-3"> */}
                            {/* <Clock className="h-4 w-4" /> */}
                            {/* <span>{request.slot_start_time} - {request.slot_end_time}</span> */}
                            {/* </div> */}
                            {/* <CardTitle className="text-base font-semibold text-gray-900"> */}
                            {/* {request?.request?.name} */}
                            {/* </CardTitle> */}
                            {/* </CardHeader> */}
                            {/* <CardContent className="pt-0"> */}
                            {/* <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-3"> */}
                            {/* {request?.request?.notes} */}
                            {/* </CardDescription> */}
                            {/*  */}
                            {/* <div className="flex items-center justify-between"> */}
                            {/* {request?.request?.status === "pending" ? */}
                            {/* ( */}
                            {/* <div className="flex gap-2 w-full"> */}
                            {/* <Button */}
                            {/* variant="destructive" */}
                            {/* size="sm" */}
                            {/* className="flex-1 h-8 text-xs" */}
                            {/* onClick={() => handleReject(request.id)} */}
                            {/* > */}
                            {/* <X className="h-3 w-3 mr-1" /> */}
                            {/* Reject */}
                            {/* </Button> */}
                            {/* <Button */}
                            {/* variant="outline" */}
                            {/* size="sm" */}
                            {/* className="flex-1 h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50" */}
                            {/* onClick={() => handleReschedule(request.id)} */}
                            {/* > */}
                            {/* <RotateCcw className="h-3 w-3 mr-1" /> */}
                            {/* Reschedule */}
                            {/* </Button> */}
                            {/* </div> */}
                            {/* ) : ( */}
                            {/* getStatusDisplay(request?.request?.status) */}
                            {/* )} */}
                            {/* </div> */}
                            {/* </CardContent> */}
                            {/* </Card> */}
                            {/* )) */}
                            {/* ) : ( */}
                            {/* <div className="col-span-full text-center py-10 text-gray-500"> */}
                            {/* <div className="flex flex-col items-center justify-center gap-2"> */}
                            {/* <X className="w-8 h-8 text-gray-400" /> */}
                            {/* <p className="text-sm">No booking requests found</p> */}
                            {/* </div> */}
                            {/* </div> */}
                            {/* )} */}
                            {/* </div> */}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredAllRequests && filteredAllRequests.length > 0 ? (
                                    filteredAllRequests.map((request) => {
                                        const status = request?.request?.status;
                                        const startTime = new Date(`${request.booking_date}T${request.slot_start_time}`);
                                        const currentTime = new Date();
                                        const timeDiffMs = startTime - currentTime;
                                        const timeDiffMins = timeDiffMs / 1000 / 60;

                                        const slotDurationMins = (new Date(`1970-01-01T${request.slot_end_time}`) - new Date(`1970-01-01T${request.slot_start_time}`)) / 60000;
                                        const disableReschedule = timeDiffMins <= slotDurationMins * 2;

                                        return (
                                            <Card key={request.id} className="h-fit">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{request.booking_date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{request.slot_start_time} - {request.slot_end_time}</span>
                                                    </div>
                                                    <CardTitle className="text-base font-semibold text-gray-900">
                                                        {request?.request?.name}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-3">
                                                        {request?.request?.notes}
                                                    </CardDescription>

                                                    <div className="flex flex-col gap-2">
                                                        {status === "pending" && (
                                                            <div className="flex gap-2 w-full">
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="flex-1 h-8 text-xs"
                                                                    onClick={() => handleReject(request.id)}
                                                                >
                                                                    <X className="h-3 w-3 mr-1" />
                                                                    Reject
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex-1 h-8 text-xs border-green-200 text-green-600 hover:bg-green-50"
                                                                    onClick={() => handleApprove(request.id)}
                                                                >
                                                                    <Check className="h-3 w-3 mr-1" />
                                                                    Approve
                                                                </Button>
                                                            </div>
                                                        )}

                                                        {(status === "approved" || status === "reschedule") && (
                                                            <div className="flex gap-2 w-full">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="flex-1 h-8 text-xs border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                                                                    disabled={disableReschedule}
                                                                    onClick={() => handleReschedule(request.id)}
                                                                >
                                                                    <RotateCcw className="h-3 w-3 mr-1" />
                                                                    Reschedule
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                                                    onClick={() => window.open(request?.meeting_link, "_blank")}
                                                                >
                                                                    <Video className="h-3 w-3 mr-1" />
                                                                    Start Meeting
                                                                </Button>
                                                            </div>
                                                        )}

                                                        {status !== "pending" && status !== "approved" && (
                                                            <div className="text-xs text-gray-500">
                                                                {getStatusDisplay(request?.request?.status)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full text-center py-10 text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <X className="w-8 h-8 text-gray-400" />
                                            <p className="text-sm">No booking requests found</p>
                                        </div>
                                    </div>
                                )}
                            </div>


                        </div>

                    </div>
                </div>

                {/* Manage Meeting Slots Modal */}
                <Dialog open={showManageSlotsModal} onOpenChange={setShowManageSlotsModal}>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                Manage Meeting Slots
                                {/* <Button variant="ghost" size="sm" onClick={() => setShowManageSlotsModal(false)} className="h-6 w-6 p-0"> */}
                                {/* <XIcon className="h-4 w-4" /> */}
                                {/* </Button> */}
                            </DialogTitle>
                            <DialogDescription>
                                Add, remove, or edit available slots for meetings. Choose a date, time, and duration for users to book.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">

                            {/* Event Name */}
                            <div className="space-y-1">
                                <Label htmlFor="eventName" className="text-sm font-medium">Event Name</Label>
                                <Input
                                    id="eventName"
                                    placeholder="Enter event name"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    className={slotErrors.eventName ? "border-red-500" : ""}
                                />

                            </div>

                            {/* Google Email */}
                            <div className="space-y-1">
                                <Label htmlFor="googleEmail" className="text-sm font-medium">Meeting Link</Label>
                                <Input
                                    id="googleEmail"
                                    type="email"
                                    placeholder="Enter Google email"
                                    value={meetingLink}
                                    onChange={(e) => setMeetingLink(e.target.value)}
                                    className={slotErrors.googleEmail ? "border-red-500" : ""}
                                />
                            </div>

                            <Button className="bg-red-500 text-white hover:bg-red-600 hover:text-white" onClick={() => handelUpdate()}>
                                Update
                            </Button>

                            {Object.keys(slots).map((day) => {


                                return (
                                    <div key={day} className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-full ${getDayColor(day)} flex items-center justify-center text-white font-semibold text-sm`}
                                            >
                                                {getDayInitial(day)}
                                            </div>
                                            <h3 className="font-medium text-gray-900">{day}</h3>
                                        </div>

                                        <div className="ml-11 space-y-2">
                                            {slots[day].map((slot) => (
                                                <div key={slot.id} className="flex items-center gap-2 p-3 border rounded-lg">
                                                    {editingSlot && editingSlot.id === slot.id ? (
                                                        <div className="flex-1 space-y-3">
                                                            {/* Start Time */}
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium w-12">Start:</span>
                                                                <Select
                                                                    value={editingSlot.startHour}
                                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, startHour: value }))}
                                                                >
                                                                    <SelectTrigger className="w-16">
                                                                        <SelectValue placeholder="Hr" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {hours.map((hour) => (
                                                                            <SelectItem key={hour} value={hour}>
                                                                                {hour}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <span>:</span>
                                                                <Select
                                                                    value={editingSlot.startMinute}
                                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, startMinute: value }))}
                                                                >
                                                                    <SelectTrigger className="w-16">
                                                                        <SelectValue placeholder="Min" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {minutes.map((minute) => (
                                                                            <SelectItem key={minute} value={minute}>
                                                                                {minute}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Select
                                                                    value={editingSlot.startPeriod}
                                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, startPeriod: value }))}
                                                                >
                                                                    <SelectTrigger className="w-16">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {periods.map((period) => (
                                                                            <SelectItem key={period} value={period}>
                                                                                {period}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            {/* End Time */}
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-medium w-12">End:</span>
                                                                <Select
                                                                    value={editingSlot.endHour}
                                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, endHour: value }))}
                                                                >
                                                                    <SelectTrigger className="w-16">
                                                                        <SelectValue placeholder="Hr" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {hours.map((hour) => (
                                                                            <SelectItem key={hour} value={hour}>
                                                                                {hour}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <span>:</span>
                                                                <Select
                                                                    value={editingSlot.endMinute}
                                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, endMinute: value }))}
                                                                >
                                                                    <SelectTrigger className="w-16">
                                                                        <SelectValue placeholder="Min" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {minutes.map((minute) => (
                                                                            <SelectItem key={minute} value={minute}>
                                                                                {minute}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Select
                                                                    value={editingSlot.endPeriod}
                                                                    onValueChange={(value) => setEditingSlot((prev) => ({ ...prev, endPeriod: value }))}
                                                                >
                                                                    <SelectTrigger className="w-16">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {periods.map((period) => (
                                                                            <SelectItem key={period} value={period}>
                                                                                {period}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex gap-2">
                                                                <Button size="sm" onClick={saveEditSlot}>
                                                                    Save
                                                                </Button>
                                                                <Button size="sm" variant="outline" onClick={() => setEditingSlot(null)}>
                                                                    Cancel
                                                                </Button>
                                                            </div>

                                                            {/* Error Messages */}
                                                            {(slotErrors.time || slotErrors.overlap) && (
                                                                <Alert variant="destructive">
                                                                    <AlertDescription>{slotErrors.time || slotErrors.overlap}</AlertDescription>
                                                                </Alert>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex-1 flex items-center gap-2">
                                                                <span className="text-sm">
                                                                    {formatTimeDisplay(slot.startHour, slot.startMinute, slot.startPeriod)}
                                                                </span>
                                                                <span>-</span>
                                                                <span className="text-sm">
                                                                    {formatTimeDisplay(slot.endHour, slot.endMinute, slot.endPeriod)}
                                                                </span>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditSlot(day, slot)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteSlot(day, slot.id)}
                                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            ))}

                                            {newSlot.day === day ? (
                                                <div className="p-3 border-2 border-dashed border-gray-300 rounded-lg space-y-3">
                                                    {/* Start Time */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium w-12">Start:</span>
                                                        <Select
                                                            value={newSlot.startHour}
                                                            onValueChange={(value) => setNewSlot((prev) => ({ ...prev, startHour: value }))}
                                                        >
                                                            <SelectTrigger className="w-16">
                                                                <SelectValue placeholder="Hr" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {hours.map((hour) => (
                                                                    <SelectItem key={hour} value={hour}>
                                                                        {hour}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <span>:</span>
                                                        <Select
                                                            value={newSlot.startMinute}
                                                            onValueChange={(value) => setNewSlot((prev) => ({ ...prev, startMinute: value }))}
                                                        >
                                                            <SelectTrigger className="w-16">
                                                                <SelectValue placeholder="Min" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {minutes.map((minute) => (
                                                                    <SelectItem key={minute} value={minute}>
                                                                        {minute}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <Select
                                                            value={newSlot.startPeriod}
                                                            onValueChange={(value) => setNewSlot((prev) => ({ ...prev, startPeriod: value }))}
                                                        >
                                                            <SelectTrigger className="w-16">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {periods.map((period) => (
                                                                    <SelectItem key={period} value={period}>
                                                                        {period}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* End Time */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium w-12">End:</span>
                                                        <Select
                                                            value={newSlot.endHour}
                                                            onValueChange={(value) => setNewSlot((prev) => ({ ...prev, endHour: value }))}
                                                        >
                                                            <SelectTrigger className="w-16">
                                                                <SelectValue placeholder="Hr" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {hours.map((hour) => (
                                                                    <SelectItem key={hour} value={hour}>
                                                                        {hour}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <span>:</span>
                                                        <Select
                                                            value={newSlot.endMinute}
                                                            onValueChange={(value) => setNewSlot((prev) => ({ ...prev, endMinute: value }))}
                                                        >
                                                            <SelectTrigger className="w-16">
                                                                <SelectValue placeholder="Min" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {minutes.map((minute) => (
                                                                    <SelectItem key={minute} value={minute}>
                                                                        {minute}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <Select
                                                            value={newSlot.endPeriod}
                                                            onValueChange={(value) => setNewSlot((prev) => ({ ...prev, endPeriod: value }))}
                                                        >
                                                            <SelectTrigger className="w-16">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {periods.map((period) => (
                                                                    <SelectItem key={period} value={period}>
                                                                        {period}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => saveNewSlot()}>
                                                            Add
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                setNewSlot({
                                                                    day: "",
                                                                    startHour: "",
                                                                    startMinute: "",
                                                                    startPeriod: "AM",
                                                                    endHour: "",
                                                                    endMinute: "",
                                                                    endPeriod: "AM",
                                                                })
                                                            }
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>

                                                    {/* Error Messages */}
                                                    {(slotErrors.time || slotErrors.overlap) && (
                                                        <Alert variant="destructive">
                                                            <AlertDescription>{slotErrors.time || slotErrors.overlap}</AlertDescription>
                                                        </Alert>
                                                    )}
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAddSlot(day)}
                                                    className="w-full border-dashed"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add slot
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex justify-end pt-4 border-t gap-2">
                            <Button variant="outline" onClick={() => setShowManageSlotsModal(false)}>
                                Cancel
                            </Button>


                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Reject Confirmation Dialog */}
            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Request</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject this request? This action cannot be undone and the user will be notified
                            of the rejection.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmReject} className="bg-red-600 hover:bg-red-700">
                            Reject Request
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <CustomModal
                isOpen={openReshaduleMeeing}
                onClose={() => setOpenResheduleMeeting(false)}
                Children={<RescheduleMeeting onClose={() => setOpenResheduleMeeting(true)} id={rescheduleId} />}
            />
        </DashboardLayout>
    )
}
