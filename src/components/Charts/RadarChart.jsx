"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    // ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#FFC107",
    },
    mobile: {
        label: "Mobile",
        color: "#1A77F8",
    },
}

export function RadarChartComponent() {
    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="items-center pb-1">
                <CardTitle>Multiple</CardTitle>
                <CardDescription>
                    Showing total visitors for the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[240px]"
                >
                    <RadarChart data={chartData}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <PolarAngleAxis dataKey="month" />
                        <PolarGrid />
                        <Radar
                            dataKey="desktop"
                            fill="var(--color-desktop)"
                            fillOpacity={1}
                        />
                        <Radar dataKey="mobile" fill="var(--color-mobile)" />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-sm"> */}
            {/* <div className="flex items-center gap-2 font-medium leading-none"> */}
            {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
            {/* </div> */}
            {/* <div className="flex items-center gap-2 leading-none text-muted-foreground"> */}
            {/* January - June 2024 */}
            {/* </div> */}
            {/* </CardFooter> */}
        </Card>
    )
}
