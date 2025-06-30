"use client"

import { useState, useEffect } from "react"
import { format, parse } from "date-fns"
import { CalendarIcon, X, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useSelector } from "react-redux"

export default function StartCycleDialog({ open, onOpenChange, isEdit, defaultStartDate, defaultEndDate, onSubmit, status }) {
    const [startDate, setStartDate] = useState(defaultStartDate)
    const [endDate, setEndDate] = useState(defaultEndDate)
    const [showStartCalendar, setShowStartCalendar] = useState(false)
    const [showEndCalendar, setShowEndCalendar] = useState(false)
    const [durationError, setDurationError] = useState("");
    const { postStatus, postError, postSuccessMessage } = useSelector((state) => state.postApi);
    // Reset dates when dialog opens

    console.log(endDate);

    useEffect(() => {
        if (open) {
            if (isEdit) {
                const parsedStart = typeof defaultStartDate === "string"
                    ? parse(defaultStartDate, "dd-MM-yyyy", new Date())
                    : defaultStartDate;

                const parsedEnd = typeof defaultEndDate === "string"
                    ? parse(defaultEndDate, "dd-MM-yyyy", new Date())
                    : defaultEndDate;

                setStartDate(parsedStart);
                setEndDate(parsedEnd);
            }
            else {
                // For new cycle, set start date to today and end date to 45 days later
                const today = new Date()
                const defaultEnd = new Date(today)
                defaultEnd.setDate(today.getDate() + 45)
                setStartDate(today)
                setEndDate(defaultEnd)
            }
            // Close any open calendars when dialog opens
            setShowStartCalendar(false)
            setShowEndCalendar(false)
        }
    }, [open, isEdit, defaultStartDate, defaultEndDate])

    const handleSubmit = () => {
        setDurationError(""); // Reset any previous error

        if (!startDate || !endDate) return;

        if (!isEdit) {
            const differenceInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
            if (differenceInDays < 45) {
                setDurationError("Cycle duration must be at least 45 days.");
                return;
            }
        }

        onSubmit(startDate, endDate);
    };

    const handleCancel = () => {
        onOpenChange(false)
    }

    const handleStartDateClick = () => {
        if (!isEdit) {
            setShowStartCalendar(!showStartCalendar)
            setShowEndCalendar(false)
        }
    }

    const handleEndDateClick = () => {
        setShowEndCalendar(!showEndCalendar)
        setShowStartCalendar(false)
    }

    const handleStartDateSelect = (date) => {
        setStartDate(date)
        setShowStartCalendar(false)
        // Auto-adjust end date if it becomes invalid
        if (date && endDate && endDate < date) {
            const newEndDate = new Date(date)
            newEndDate.setDate(date.getDate() + 45)
            setEndDate(newEndDate)
        }
    }

    const handleEndDateSelect = (date) => {
        setEndDate(date)
        setShowEndCalendar(false)
    }

    // Validation: end date should not be less than start date
    const isEndDateValid = !startDate || !endDate || endDate >= startDate

    // Get minimum date for end date picker (start date or today, whichever is later)
    const getMinEndDate = () => {
        const today = new Date()
        if (!startDate) return today
        return startDate > today ? startDate : today
    }

    // Get minimum date for start date picker (today)
    const getMinStartDate = () => new Date()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] h-96 overflow-y-auto">
                <DialogHeader className="p-6 pb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold">
                            {isEdit ? "Change End Date" : "Start New Investment Cycle"}
                        </DialogTitle>

                    </div>
                </DialogHeader>

                <div className="px-6 pb-6">
                    <p className="text-sm text-muted-foreground mb-6">
                        {isEdit
                            ? "Update the end date for the current investment cycle."
                            : "Define the duration of the new investment cycle. You can set your own start and end dates or use the default 45-day period."}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Start Date */}
                        <div className="space-y-2">
                            <Label htmlFor="start-date" className="text-sm font-medium text-muted-foreground">
                                Start Date
                            </Label>
                            <div className="relative">
                                <Button
                                    id="start-date"
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between text-left font-normal",
                                        !startDate && "text-muted-foreground",
                                        isEdit && "opacity-50 cursor-not-allowed",
                                    )}
                                    disabled={isEdit}
                                    onClick={handleStartDateClick}
                                >
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>{startDate ? format(startDate, "dd-MM-yyyy") : "Select date"}</span>

                                        {!isEdit && !startDate && <span className="text-xs text-blue-600">(Default)</span>}
                                    </div>
                                    {!isEdit && <ChevronDown className="h-4 w-4" />}
                                </Button>

                                {/* Inline Start Date Calendar */}
                                {showStartCalendar && !isEdit && (
                                    <div className="absolute top-full left-0 z-50 mt-2 bg-white border rounded-lg shadow-lg">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={handleStartDateSelect}
                                            disabled={(date) => date < getMinStartDate()}
                                            initialFocus
                                            className="rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <Label htmlFor="end-date" className="text-sm font-medium text-muted-foreground">
                                End Date
                            </Label>
                            <div className="relative">
                                <Button
                                    id="end-date"
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between text-left font-normal",
                                        !endDate && "text-muted-foreground",
                                        !isEndDateValid && "border-red-500",
                                    )}
                                    onClick={handleEndDateClick}
                                >
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>{endDate ? format(endDate, "dd-MM-yyyy") : "Select date"}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>

                                {/* Inline End Date Calendar */}
                                {showEndCalendar && (
                                    <div className="absolute top-full left-0 z-50 mt-2 bg-white border rounded-lg shadow-lg">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={handleEndDateSelect}
                                            disabled={(date) => date < getMinEndDate()}
                                            initialFocus
                                            className="rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                            {!isEndDateValid && <p className="text-xs text-red-500">End date must be after start date</p>}
                            {durationError && <p className="text-xs text-red-500">{durationError}</p>}
                        </div>
                    </div>

                    {/* Info message for edit mode */}
                    {isEdit && (
                        <div className="mb-6">
                            <p className="text-xs text-blue-600">Because last cycle's end date was updated</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!startDate || !endDate || !isEndDateValid || postStatus === "loading"}
                        >
                            {status === "loading" ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {isEdit ? "Updating..." : "Starting..."}
                                </span>
                            ) : (
                                isEdit ? "Update End Date" : "Start Cycle"
                            )}
                        </Button>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
