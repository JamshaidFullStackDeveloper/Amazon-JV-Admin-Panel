import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import DashboardLayout from "@/layouts/Layout";
import { ArrowUpRight } from "lucide-react";
// import { DatePicker } from "@/components/ui/datepicker";
import ArrowUp from '../../assets/Dashboard/ArrowIcon.svg';
import TotalInvestment from '../../assets/Dashboard/TI.svg';
import ROI from '../../assets/Dashboard/ROI.svg';
import IRequest from '../../assets/Dashboard/IR.svg';
import Pool from '../../assets/Dashboard/Pool.svg';

import TotalInvestmentIcon from '../../assets/Dashboard/TotalInvestmentIcon.svg';
import ROIIcon from '../../assets/Dashboard/ROIIcon.svg';
import IRequestIcon from '../../assets/Dashboard/IRIcon.svg';
import PoolIcon from '../../assets/Dashboard/PoolIcon.svg';
import InvestorsTable from "./Investors";
import CurrentCycleBanner from "./InvestmentCycle";
const data = [
    { cycle: "Previous Cycle", value: 45, fill: "#60A5FA" },
    { cycle: "Current Cycle", value: 20, fill: "#22C55E" },
    { cycle: "Next Cycle", value: 0, fill: "#000" },
];

const investors = [
    { name: "Smith Johnson", amount: "$10,500", days: 32, color: "#22C55E" },
    { name: "Timothy Russell", amount: "$3,250", days: 26, color: "#FACC15" },
    { name: "Lucas Willie", amount: "$8,750", days: 13, color: "#60A5FA" },
];

export default function Dashboard() {
    return (
        <DashboardLayout>
            <div className="p-6  md:px-12 grid gap-6">
                {/* Top Cards */}
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard title="Total Investments (5)" amount="$230,000" color="bg-blue-100" icon={TotalInvestment} bottomIcon={TotalInvestmentIcon} />
                    <StatCard title="Return on Investment" amount="$2,000" color="bg-green-100" icon={ROI} bottomIcon={ROIIcon} />
                    <StatCard title="Investment Requests (1)" amount="$25,000" color="bg-red-100" icon={IRequest} bottomIcon={IRequestIcon} />
                    <StatCard title="Pool Info" amount="3" color="bg-yellow-100" icon={Pool} bottomIcon={PoolIcon} />
                </div>

                <CurrentCycleBanner />
                {/* Cycle Progress Overview */}
                <div className="grid lg:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cycle Progress Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={data}>
                                    <XAxis dataKey="cycle" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    {/* Investors List */}
                    <InvestorsTable />
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ title, amount, icon, bottomIcon }) {
    return (
        <Card className="p-2 flex items-center justify-between bg-gray-100 shadow-sm rounded-xl">
            {/* Left Side */}
            <div className="flex flex-col items-left gap-6">
                <div className="flex gap-2 items-center  rounded-full">
                    <img src={icon} alt="Icon" className="w-9 h-9" />
                    <p className="text-gray-600 text-sm">{title}</p>
                </div>
                <div>
                    <p className="text-2xl font-bold">{amount}</p>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col items-center gap-6">
                <button className=" hover:bg-gray-300">
                    <img src={ArrowUp} className="w-8 h-8" />
                </button>
                <img src={bottomIcon} alt="Money Stack" className="w-10 h-10" />
            </div>
        </Card>
    );
}
