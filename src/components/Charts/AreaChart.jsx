"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {

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
        color: "#1A77F8",
    },
    mobile: {
        label: "Mobile",
        color: "#20E646",
    },
}

export function FileingAreaChart() {
    return (
        <Card className="border-0 shadow-none">
            <CardHeader>
                <CardTitle>Filings Over Time</CardTitle>
                <CardDescription>
                    It is a long established fact that a reader will distracted.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)} // Shortens the month name
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="mobile"
                            type="natural"
                            fill="var(--color-mobile)"
                            fillOpacity={1}
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="var(--color-desktop)"
                            fillOpacity={1}
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter> */}
            {/* <div className="flex w-full items-start gap-2 text-sm"> */}
            {/* <div className="grid gap-2"> */}
            {/* <div className="flex items-center gap-2 font-medium leading-none"> */}
            {/* Trending up by 5.2% this month <TrendingUp className="h-4 w-4" /> */}
            {/* </div> */}
            {/* <div className="flex items-center gap-2 leading-none text-muted-foreground"> */}
            {/* January - June 2024 */}
            {/* </div> */}
            {/* </div> */}
            {/* </div> */}
            {/* </CardFooter> */}
        </Card>
    )
}
