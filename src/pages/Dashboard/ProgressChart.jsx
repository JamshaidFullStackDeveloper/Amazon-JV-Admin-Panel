import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const data = [
    {
        name: "Previous Cycle",
        value: 42,
        color: "#A7CEFC",
        startDate: "Jan 1",
        endDate: "Feb 15",
    },
    {
        name: "Current Cycle",
        value: 20,
        color: "#28A745",
        startDate: "Feb 16",
        endDate: "Mar 31",
    },
    {
        name: "Next Cycle",
        value: 0,
        color: "#000",
        startDate: "Apr 1",
        endDate: "May 15",
    },
];

const tooltipData = {
    "Previous Cycle": {
        totalInvestments: "$250,000",
        investors: 50,
        roiPaid: "$15,000",
        withdrawalRequests: 5,
        completedCycles: 10,
    },
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && tooltipData[label]) {
        const { totalInvestments, investors, roiPaid, withdrawalRequests, completedCycles } = tooltipData[label];
        return (
            <div className="bg-white p-3 border rounded shadow-md text-sm">
                <p className="font-semibold">Total Investments Yet: <span className="font-bold">{totalInvestments}</span></p>
                <p>Number of Investors: {investors}</p>
                <p>ROI Paid: <span className="font-bold">{roiPaid}</span></p>
                <p>Requests for Withdrawal: <span className="text-red-500">{withdrawalRequests}</span></p>
                <p>Completed Cycles: <span className="font-bold">{completedCycles}</span></p>
            </div>
        );
    }
    return null;
};

export default function CycleProgressChart() {
    return (
        <Card className="p-6">
            <h2 className="text-lg font-bold">Cycle Progress Overview</h2>
            <p className="text-sm text-gray-500">Visualize the current cycle's progress, including start and end dates, alongside the growth trend of previous and upcoming cycles.</p>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill={data[0].color} />
                    </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    {data.map((item) => (
                        <div key={item.name} className="text-center">
                            <p>{item.name}</p>
                            <p>Start: {item.startDate}</p>
                            <p>End: {item.endDate}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
