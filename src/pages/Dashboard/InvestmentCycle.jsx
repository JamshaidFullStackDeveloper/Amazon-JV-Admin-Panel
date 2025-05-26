import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator" // Added separator component [^1]

// This is a React component using JSX syntax
function CurrentCycleBanner() {
    // Sample data - in a real app, this would come from props or state
    const investmentData = {
        daysElapsed: 18,
        totalDays: 28,
        cycleStartDate: "Jan 1 2023",
        daysRemaining: 10,
        totalInvestment: 230000,
        investorCount: 10,
    }

    // Calculate progress percentage
    const progressPercentage = (investmentData.daysElapsed / investmentData.totalDays) * 100

    // JSX allows us to write HTML-like markup directly in JavaScript
    return (
        <div className="w-full  mx-auto">
            {/* Card component from shadcn/ui */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Current Investment Cycle Progress</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Track the ongoing investment cycle in real time, monitor progress, and analyze key performance indicators to
                        ensure smooth management.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Progress Section - JSX allows us to embed expressions using curly braces */}
                        <div className="col-span-1 md:col-span-1">
                            <div className="mb-2">
                                <span className="text-2xl font-bold text-blue-600">{investmentData.daysElapsed} Days</span>
                            </div>
                            {/* Progress component with dynamic value */}
                            <Progress value={progressPercentage} className="h-2 mb-6" />
                        </div>

                        {/* Cycle Information */}
                        <div className="col-span-1 md:col-span-1 space-y-4">
                            <div>
                                <h3 className="text-sm font-medium">Cycle Start Date:</h3>
                                <p className="text-sm text-muted-foreground">({investmentData.cycleStartDate})</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium">Days Remaining</h3>
                                <p className="text-sm text-muted-foreground">({investmentData.daysRemaining} days left)</p>
                            </div>
                        </div>

                        {/* Investment Information */}
                        <div className="col-span-1 md:col-span-1 space-y-4">
                            <div>
                                <h3 className="text-sm font-medium">Total Investment in This Cycle:</h3>
                                <p className="text-sm text-muted-foreground">{investmentData.investorCount} Investors</p>
                                {/* JSX allows us to use JavaScript methods inside expressions */}
                                <p className="text-3xl font-bold mt-1">${investmentData.totalInvestment.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <Separator className="my-4" /> {/* Added visual separator [^1] */}
                    {/* Footer Description - JSX comments use this syntax */}
                    <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                            Total investments for the current cycle, actively managed for maximum returns. ROI is distributed based on
                            contributions and cycle performance, ensuring transparency and profitability.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CurrentCycleBanner
