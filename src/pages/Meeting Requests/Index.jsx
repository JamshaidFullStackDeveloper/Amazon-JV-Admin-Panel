"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, X, RotateCcw, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Edit, Plus, XIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DashboardLayout from "@/layouts/Layout"

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

export default function MeetingRequests() {
    const [requests, setRequests] = useState(meetingRequestsData)
    const [sortBy, setSortBy] = useState("date-modified")
    const [showManageSlotsModal, setShowManageSlotsModal] = useState(false)
    const [slots, setSlots] = useState({
        Monday: [
            { id: 1, startHour: "9", startMinute: "00", startPeriod: "AM", endHour: "10", endMinute: "00", endPeriod: "AM" },
            { id: 2, startHour: "11", startMinute: "00", startPeriod: "AM", endHour: "11", endMinute: "30", endPeriod: "AM" },
            { id: 3, startHour: "11", startMinute: "30", startPeriod: "AM", endHour: "12", endMinute: "00", endPeriod: "PM" },
        ],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    })
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
        setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req)))
    }

    const handleReschedule = (id) => {
        setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "reschedule" } : req)))
    }

    const getStatusDisplay = (status) => {
        switch (status) {
            case "rejected":
                return (
                    <div className="flex items-center gap-2 text-red-600">
                        <X className="h-4 w-4" />
                        <span className="text-sm font-medium">Rejected</span>
                    </div>
                )
            case "approved":
                return (
                    <div className="flex items-center gap-2 text-green-600">
                        <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                        <span className="text-sm font-medium">Approved</span>
                    </div>
                )
            case "reschedule":
                return (
                    <div className="flex items-center gap-2 text-blue-600">
                        <RotateCcw className="h-4 w-4" />
                        <span className="text-sm font-medium">Reschedule</span>
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
        })
        setSlotErrors({})
    }

    const saveNewSlot = () => {
        const errors = validateSlotTime(
            newSlot.day,
            newSlot.startHour,
            newSlot.startMinute,
            newSlot.startPeriod,
            newSlot.endHour,
            newSlot.endMinute,
            newSlot.endPeriod,
        )
        if (Object.keys(errors).length > 0) {
            setSlotErrors(errors)
            return
        }

        const newSlotData = {
            id: Date.now(),
            startHour: newSlot.startHour,
            startMinute: newSlot.startMinute,
            startPeriod: newSlot.startPeriod,
            endHour: newSlot.endHour,
            endMinute: newSlot.endMinute,
            endPeriod: newSlot.endPeriod,
        }

        setSlots((prev) => ({
            ...prev,
            [newSlot.day]: [...(prev[newSlot.day] || []), newSlotData],
        }))

        setNewSlot({
            day: "",
            startHour: "",
            startMinute: "",
            startPeriod: "AM",
            endHour: "",
            endMinute: "",
            endPeriod: "AM",
        })
        setSlotErrors({})
    }

    const handleEditSlot = (day, slot) => {
        setEditingSlot({ ...slot, day })
        setSlotErrors({})
    }

    const saveEditSlot = () => {
        const errors = validateSlotTime(
            editingSlot.day,
            editingSlot.startHour,
            editingSlot.startMinute,
            editingSlot.startPeriod,
            editingSlot.endHour,
            editingSlot.endMinute,
            editingSlot.endPeriod,
            editingSlot.id,
        )
        if (Object.keys(errors).length > 0) {
            setSlotErrors(errors)
            return
        }

        setSlots((prev) => ({
            ...prev,
            [editingSlot.day]: prev[editingSlot.day].map((slot) => (slot.id === editingSlot.id ? editingSlot : slot)),
        }))

        setEditingSlot(null)
        setSlotErrors({})
    }

    const handleDeleteSlot = (day, slotId) => {
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
    const sortRequests = (requests, sortBy) => {
        return [...requests].sort((a, b) => {
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

    const allRequests = sortRequests(requests, sortBy)
    const newlyRequests = requests.filter((req) => req.status === "pending")
    const filteredAllRequests = allRequests.filter((request) => {
        if (statusFilter === "all") return true
        return request.status === statusFilter
    })

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
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* All Requests Section */}
                        <div className="xl:col-span-9 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h2 className="text-lg font-semibold text-gray-900">All Requests ({filteredAllRequests.length})</h2>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-full sm:w-[140px]">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                            <SelectItem value="reschedule">Reschedule</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date-modified">Date Modified</SelectItem>
                                            <SelectItem value="date-created">Date Created</SelectItem>
                                            <SelectItem value="name">Name</SelectItem>
                                            <SelectItem value="status">Status</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* All Requests Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredAllRequests.map((request) => (
                                    <Card key={request.id} className="h-fit">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{request.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                <Clock className="h-4 w-4" />
                                                <span>{request.time}</span>
                                            </div>
                                            <CardTitle className="text-base font-semibold text-gray-900">{request.requester}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-3">
                                                {request.description}
                                            </CardDescription>

                                            {/* Status or Action Buttons */}
                                            <div className="flex items-center justify-between">
                                                {request.status === "pending" ? (
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
                                                            className="flex-1 h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                                                            onClick={() => handleReschedule(request.id)}
                                                        >
                                                            <RotateCcw className="h-3 w-3 mr-1" />
                                                            Reschedule
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    getStatusDisplay(request.status)
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Newly Requests Section */}
                        <div className="xl:col-span-3 space-y-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-gray-900">Newly Requests</h2>
                                {newlyRequests.length > 0 && (
                                    <Badge variant="destructive" className="bg-red-500 text-white">
                                        {newlyRequests.length}
                                    </Badge>
                                )}
                            </div>

                            {/* Newly Requests Grid */}
                            <div className="space-y-4 max-h-screen overflow-auto border-2 border-gray-200 p-2 shadow-md rounded-md">
                                {newlyRequests.map((request) => (
                                    <Card key={`new-${request.id}`} className="border-l-4 border-l-blue-500">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <Calendar className="h-4 w-4" />
                                                <span>{request.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                <Clock className="h-4 w-4" />
                                                <span>{request.time}</span>
                                            </div>
                                            <CardTitle className="text-base font-semibold text-blue-600">{request.requester}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {request.description}
                                            </CardDescription>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
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
                                                    className="flex-1 h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleReschedule(request.id)}
                                                >
                                                    <RotateCcw className="h-3 w-3 mr-1" />
                                                    Reschedule
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {newlyRequests.length === 0 && (
                                    <Card className="border-dashed border-2 border-gray-200">
                                        <CardContent className="flex items-center justify-center py-8">
                                            <p className="text-gray-500 text-sm">No new requests</p>
                                        </CardContent>
                                    </Card>
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
                            {Object.keys(slots).map((day) => (
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
                                                    <Button size="sm" onClick={saveNewSlot}>
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
                            ))}
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button variant="outline" onClick={() => setShowManageSlotsModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}
