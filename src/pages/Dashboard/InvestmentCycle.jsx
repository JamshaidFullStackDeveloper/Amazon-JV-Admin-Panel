"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "lucide-react"
import StartCycleDialog from "./start-cycle-dialog"
import { useDispatch, useSelector } from "react-redux"
import { postData, resetPostStatus } from "@/redux/PostApiSlice/Index"
import { useLoader } from "@/context/LoaderContext"
import { useGlobalToast } from "@/context/ToastContext"

export default function InvestmentCycleProgress({ CycleDetiles }) {
    const dispatch = useDispatch()
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useGlobalToast();

    const [dialogOpen, setDialogOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [autoCreatingCycle, setAutoCreatingCycle] = useState(false)

    const cycleStartDate = CycleDetiles?.start_date
    const cycleEndDate = CycleDetiles?.end_date

    const { postStatus, postError, postSuccessMessage } = useSelector((state) => state.postApi);
    const { data, error, successMessage } = useSelector((state) => state.api);

    // Helper function to parse date string (handles dd-mm-yy format)
    const parseDate = (dateString) => {
        if (!dateString) return null;

        // Handle dd-mm-yy format
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
            let year = parseInt(parts[2], 10);

            // Convert 2-digit year to 4-digit year
            if (year < 50) {
                year += 2000;
            } else if (year < 100) {
                year += 1900;
            }

            return new Date(year, month, day);
        }

        return new Date(dateString);
    };

    // Helper function to format date to dd-mm-yy
    const formatDateToAPI = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return `${day}-${month}-${year}`;
    };

    // Helper function to add days to a date
    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // Calculate progress based on actual dates
    const calculateProgress = () => {
        if (!cycleStartDate || !cycleEndDate) return { daysPassed: 0, totalDays: 0, daysRemaining: 0, progressPercent: 0 };

        const startDate = parseDate(cycleStartDate);
        const endDate = parseDate(cycleEndDate);
        const currentDate = new Date();

        if (!startDate || !endDate) return { daysPassed: 0, totalDays: 0, daysRemaining: 0, progressPercent: 0 };

        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const daysPassed = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(0, totalDays - daysPassed);
        const progressPercent = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

        return { daysPassed: Math.max(0, daysPassed), totalDays, daysRemaining, progressPercent };
    };

    const { daysPassed, totalDays, daysRemaining, progressPercent } = calculateProgress();

    // Check if current cycle has ended and auto-create new cycle
    useEffect(() => {
        const checkAndCreateNewCycle = async () => {
            if (!CycleDetiles || !cycleEndDate || autoCreatingCycle) return;

            const endDate = parseDate(cycleEndDate);
            const currentDate = new Date();

            // dispatch(postData({ endpoint: `/cycles/${CycleDetiles.id}`, status: "completed" }))
            // Check if current date is past the end date
            if (currentDate > endDate && CycleDetiles.status === "Active") {
                setAutoCreatingCycle(true);

                // Calculate new cycle dates
                // const newStartDate = addDays(endDate, 1); // Next day after current cycle ends
                // const newEndDate = addDays(newStartDate, 45); // 45 days later

                try {
                    // 1. Mark current cycle as completed
                    await dispatch(postData({
                        endpoint: `/cycles/${CycleDetiles.id}`,
                        payload: { status: "Completed" },
                    })).unwrap();
                    await dispatch(resetPostStatus());

                    // 2. Create new cycle
                    const newStartDate = addDays(endDate, 1);
                    const newEndDate = addDays(newStartDate, 45);

                    const payload = {
                        start_date: formatDateToAPI(newStartDate),
                        end_date: formatDateToAPI(newEndDate),
                    };

                    await dispatch(postData({
                        endpoint: `/cycles`,
                        payload,
                    }));
                    await dispatch(resetPostStatus())
                    console.log("Auto-created new cycle:", payload);
                } catch (error) {
                    console.error("Error auto-creating cycle:", error);
                } finally {
                    setAutoCreatingCycle(false);
                }
            }
        };

        checkAndCreateNewCycle();
    }, [CycleDetiles, cycleEndDate, autoCreatingCycle,]);

    // Handle API responses
    useEffect(() => {
        if (postStatus === "succeeded") {
            dispatch(resetPostStatus());

            if (autoCreatingCycle) {
                showToast(postSuccessMessage, "success");
                setAutoCreatingCycle(false);
            } else {
                showToast(postSuccessMessage, "success");
            }

            setDialogOpen(false);
        } else if (postStatus === "failed") {
            dispatch(resetPostStatus());
            showToast(postError, "error");

            if (autoCreatingCycle) {
                setAutoCreatingCycle(false);
            }
        }
    }, [postStatus, autoCreatingCycle, dispatch, showToast, postSuccessMessage, postError]);

    const handleStartNewCycle = () => {
        setIsEditMode(false)
        setDialogOpen(true)
    }

    const handleChangeEndDate = () => {
        setIsEditMode(true)
        setDialogOpen(true)
    }

    const handleSubmit = (start, end) => {
        const formatDate = (date) => {
            return date.toISOString().split("T")[0]; // Converts to yyyy-mm-dd
        };

        const Payload = {
            start_date: formatDate(start),
            end_date: formatDate(end),
        };

        if (isEditMode) {
            dispatch(postData({ endpoint: `/cycles/${CycleDetiles.id}`, payload: Payload }));
        } else {
            dispatch(postData({ endpoint: `/cycles`, payload: Payload }));
        }
    };

    return (
        <>
            <Card className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">Current Investment Cycle Progress</h2>
                    {autoCreatingCycle && (
                        <p className="text-sm text-blue-600 mt-1">Creating new cycle automatically...</p>
                    )}
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Left: Progress */}
                    <div className="flex flex-col gap-5">
                        <p className="text-gray-600 text-sm mt-1">
                            Track the ongoing investment cycle in real time, monitor progress, and analyze key performance indicators
                            to ensure smooth management.
                        </p>

                        <div>
                            <Button variant="outline" className="text-sm flex gap-2" onClick={handleChangeEndDate}>
                                <Calendar className="w-4 h-4" />
                                Change End Date
                            </Button>
                        </div>

                        <div>
                            <p className="text-blue-600 font-bold text-3xl">{daysPassed} Days</p>
                            <Progress value={progressPercent} className="h-2 mt-2" />
                        </div>
                    </div>

                    {/* Right: Cycle Info */}
                    <div className="flex flex-col gap-5">
                        <div className="bg-gray-50 border rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <p className="text-gray-700 font-medium">Cycle Start–End Date:</p>
                                <p className="text-gray-600">{cycleStartDate} - {cycleEndDate}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-700 font-medium">Days Remaining:</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">
                                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Cycle ended'}
                                    </span>
                                    {CycleDetiles?.status !== "Active" && (
                                        <Button size="sm" onClick={handleStartNewCycle}>
                                            Start New Cycle
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Total investments for the current cycle, actively managed for maximum returns. ROI is distributed based on
                            contributions and cycle performance, ensuring transparency and profitability.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Start / Edit Cycle Dialog */}
            <StartCycleDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                isEdit={isEditMode}
                defaultStartDate={cycleStartDate}
                defaultEndDate={cycleEndDate}
                onSubmit={handleSubmit}
                status={postStatus}
            />
        </>
    )
}