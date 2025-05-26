"use client"

import { Button } from "@/components/ui/button"

export default function CycleCompletedBanner() {
    // Sample data - in a real app, this would come from props or an API
    const cycleData = {
        startDate: "Jan 1, 2025",
        endDate: "Feb 15, 2025",
        totalInvestment: 230000,
    }

    // Event handlers
    const handleManageProfits = () => {
        console.log("Navigate to manage profits page")
        // In a real app, you would navigate to the profits management page
    }

    const handleStartNewCycle = () => {
        console.log("Start new investment cycle")
        // In a real app, you would trigger the new cycle creation process
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="bg-blue-600 text-white rounded-lg p-8 shadow-lg">
                <div className="text-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Cycle Completed! Process ROI and Manage Investments</h1>
                    <p className="text-blue-100 text-sm md:text-base">
                        The current investment cycle has ended. Please review and take the necessary actions for investors.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
                    <div className="text-center md:text-right md:flex-1">
                        <span className="text-blue-100 text-sm">Cycle Period:</span>{" "}
                        <span className="font-medium">
                            {cycleData.startDate} - {cycleData.endDate}
                        </span>
                    </div>

                    <div className="text-center md:text-left md:flex-1">
                        <span className="text-blue-100 text-sm">Total Investment Amount:</span>{" "}
                        <span className="font-medium">${cycleData.totalInvestment.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button onClick={handleManageProfits} className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                        Manage Profits
                    </Button>

                    <Button
                        onClick={handleStartNewCycle}
                        variant="outline"
                        className="bg-transparent border-white text-white hover:bg-blue-700 hover:text-white"
                    >
                        Start New Cycle
                    </Button>
                </div>
            </div>
        </div>
    )
}
