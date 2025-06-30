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
import InvestmentCycleProgress from "./InvestmentCycle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLoader } from "@/context/LoaderContext";
import { useGlobalToast } from "@/context/ToastContext";
import { fetchData, resetFetchedData } from "@/redux/GetApiSlice/Index";


export default function Dashboard() {
    const dispatch = useDispatch();
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useGlobalToast();
    const { postStatus, postError, postSuccessMessage } = useSelector((state) => state.postApi);
    const { data, error, successMessage } = useSelector((state) => state.api);
    console.log(data?.data);
    const DashboardData = data?.data;
    const CycleDetiles = data?.data?.user_cycle

    useEffect(() => {
        // if (postStatus === "succeeded") {
        showLoader();
        dispatch(resetFetchedData())
        dispatch(fetchData(`/admin/dashboard`)).finally(hideLoader);
        // }
    }, [dispatch, postSuccessMessage,]);

    return (
        <DashboardLayout>
            <div className="p-6  md:px-12 grid gap-6">
                {/* Top Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    <StatCard
                        title="Total Investments"
                        amount={`$ ${DashboardData?.capital_amount}`}
                        color="bg-blue-100"
                        icon={TotalInvestment}
                        bottomIcon={TotalInvestmentIcon}
                    />

                    <StatCard
                        title="Expected ROI"
                        amount={
                            DashboardData?.capital_amount
                                ? `$${(
                                    DashboardData.capital_amount * 0.02
                                ).toFixed(0)} - $${(DashboardData.capital_amount * 0.06).toFixed(0)}`
                                : "$0"
                        }
                        color="bg-green-100"
                        icon={ROI}
                        bottomIcon={ROIIcon}
                    />

                    <StatCard
                        title="Meeting Requests"
                        amount={DashboardData?.pending_meeting_requests}
                        color="bg-red-100"
                        icon={IRequest}
                        bottomIcon={IRequestIcon}
                    />
                </div>


                <InvestmentCycleProgress CycleDetiles={CycleDetiles} />
                {/* Cycle Progress Overview */}
                <div className="grid lg:grid-cols-1 gap-4">
                    {/* <Card> */}
                    {/* <CardHeader> */}
                    {/* <CardTitle>Cycle Progress Overview</CardTitle> */}
                    {/* </CardHeader> */}
                    {/* <CardContent> */}
                    {/* <ResponsiveContainer width="100%" height={400}> */}
                    {/* <BarChart data={data}> */}
                    {/* <XAxis dataKey="cycle" /> */}
                    {/* <YAxis /> */}
                    {/* <Tooltip /> */}
                    {/* <Bar dataKey="value" fill="#8884d8" /> */}
                    {/* </BarChart> */}
                    {/* </ResponsiveContainer> */}
                    {/* </CardContent> */}
                    {/* </Card> */}
                    {/* Investors List */}
                    <InvestorsTable Dashboarddata={DashboardData} />
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatCard({ title, amount, icon, bottomIcon }) {
    return (
        <Card className="p-6 flex items-center justify-between bg-gray-100 shadow-sm rounded-xl">
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
