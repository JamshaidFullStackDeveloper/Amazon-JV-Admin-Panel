"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function StartCycleDialogSheet({
    open,
    onOpenChange,
    isEdit,
    defaultStartDate,
    defaultEndDate,
    onSubmit,
}) {
    const [startDate, setStartDate] = useState(defaultStartDate)
    const [endDate, setEndDate] = useState(defaultEndDate)
    const [activeCalendar, setActiveCalendar] = useState(null)

    // Reset dates when dialog opens
    useEffect(() => {
        if (open) {
            if (isEdit) {
                setStartDate(defaultStartDate)
                setEndDate(defaultEndDate)
            } else {
                // For new cycle, set start date to today and end date to 45 days later
                const today = new Date()
                const defaultEnd = new Date(today)
                defaultEnd.setDate(today.getDate() + 45)
                setStartDate(today)
                setEndDate(defaultEnd)
            }
            setActiveCalendar(null)
        }
    }, [open, isEdit, defaultStartDate, defaultEndDate])

    const handleSubmit = () => {
        if (startDate && endDate) {
            onSubmit(startDate, endDate)
            onOpenChange(false)
        }
    }

    const handleCancel = () => {
        onOpenChange(false)
    }

    const handleStartDateClick = () => {
        if (!isEdit) {
            setActiveCalendar(activeCalendar === "start" ? null : "start")
        }
    }

    const handleEndDateClick = () => {
        setActiveCalendar(activeCalendar === "end" ? null : "end")
    }

    const handleStartDateSelect = (date) => {
        setStartDate(date)
        setActiveCalendar(null)
        // Auto-adjust end date if it becomes invalid
        if (date && endDate && endDate < date) {
            const newEndDate = new Date(date)
            newEndDate.setDate(date.getDate() + 45)
            setEndDate(newEndDate)
        }
    }

    const handleEndDateSelect = (date) => {
        setEndDate(date)
        setActiveCalendar(null)
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
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-[500px] overflow-y-auto">
                <SheetHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl font-semibold">
                            {isEdit ? "Change End Date" : "Start New Investment Cycle"}
                        </SheetTitle>
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-6 w-6">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </SheetHeader>

                <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                        {isEdit
                            ? "Update the end date for the current investment cycle."
                            : "Define the duration of the new investment cycle. You can set your own start and end dates or use the default 45-day period."}
                    </p>

                    {/* Date Selection */}
                    <div className="space-y-4">
                        {/* Start Date */}
                        <div className="space-y-2">
                            <Label htmlFor="start-date" className="text-sm font-medium text-muted-foreground">
                                Start Date
                            </Label>
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
                                    <span>{startDate ? format(startDate, "MMM dd, yyyy") : "Select date"}</span>
                                    {!isEdit && !startDate && <span className="text-xs text-blue-600">(Default)</span>}
                                </div>
                                {!isEdit && <ChevronDown className="h-4 w-4" />}
                            </Button>
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <Label htmlFor="end-date" className="text-sm font-medium text-muted-foreground">
                                End Date
                            </Label>
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
                                    <span>{endDate ? format(endDate, "MMM dd, yyyy") : "Select date"}</span>
                                </div>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                            {!isEndDateValid && <p className="text-xs text-red-500">End date must be after start date</p>}
                        </div>
                    </div>

                    {/* Calendar Display */}
                    {activeCalendar === "start" && !isEdit && (
                        <div className="border rounded-lg p-2">
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

                    {activeCalendar === "end" && (
                        <div className="border rounded-lg p-2">
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

                    {/* Info message for edit mode */}
                    {isEdit && (
                        <div>
                            <p className="text-xs text-blue-600">Because last cycle's end date was updated</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={!startDate || !endDate || !isEndDateValid}>
                            {isEdit ? "Update End Date" : "Start Cycle"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
