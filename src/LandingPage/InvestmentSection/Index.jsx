import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Clock, Briefcase, TrendingUp, Image } from "lucide-react";
// import Image from "next/image";
import GrowthIcon from '../../assets/AmazonLandingPage/ProfitIcon.png';
import SecureIcon from '../../assets/AmazonLandingPage/Secure Portfolio.png';
import AccessIcon from '../../assets/AmazonLandingPage/Quick Access.png';
import SafeInvestIcon from '../../assets/AmazonLandingPage/Safe Investments.png';
import InvestImage from '../../assets/AmazonLandingPage/InvestImage.png';
import ProfilePic from '../../assets/AmazonLandingPage/ProfilePic.png'
import CheckIcon from "@/SVG/LandingPage/CheckIcon";
export default function InvestmentSection() {
    return (
        <section className="bg-white py-12 px-6">
            {/* Top Features Section */}
            <div className="bg-black text-white rounded-xl py-6 px-4 flex flex-wrap justify-between items-center">
                <Feature icon={<img src={GrowthIcon} alt="Profit Growth" className="w-14" />} title="Profit Growth" description="Maximize returns with strategic investments." />
                <Feature icon={<img src={SecureIcon} alt="Profit Growth" className="w-14" />} title="Secure Portfolio" description="Build a stable and diversified portfolio." />
                <Feature icon={<img src={AccessIcon} alt="Profit Growth" className="w-14" />} title="Quick Access" description="Manage investments anytime, anywhere." />
                <Feature icon={<img src={SafeInvestIcon} alt="Profit Growth" className="w-14" />} title="Safe Investments" description="Your funds are protected with us." />
            </div>

            {/* Main Content Section */}
            <div className="flex flex-col lg:flex-row items-center justify-between mt-12 gap-8">
                {/* Left Content */}
                <div className="lg:w-1/2 space-y-6">
                    <Badge className="bg-green-100 text-[#09B96D] text-lg hover:bg-green-200 px-3 py-1 rounded-xl">
                        Invest
                    </Badge>
                    <h2 className="text-4xl font-bold text-gray-900">Why Invest Today</h2>
                    <p className="text-gray-600 text-lg w-3/4">
                        Investing is the key to growing your wealth and securing your future. Start now to achieve your financial dreams with ease and confidence.
                    </p>

                    {/* Checkmark List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CheckItem text="High Returns" />
                        <CheckItem text="User-Friendly Platform" />
                        <CheckItem text="Diversified Plans" />
                        <CheckItem text="24/7 Support" />
                        <CheckItem text="Expert Guidance" />
                        <CheckItem text="Secure Transactions" />
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-center gap-4 mt-6">
                        <img src={ProfilePic} className="w-12 h-12 rounded-full" />
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900">Umair Nasir</h4>
                            <p className="text-green-600 text-sm">CEO & Founder</p>
                        </div>
                    </div>
                </div>

                {/* Right Content (Amazon Image) */}
                <div className="relative w-full lg:w-1/2">
                    <img
                        src={InvestImage}
                        alt="Amazon Investment"
                        width={600}
                        height={350}
                        className="rounded-lg"
                    />

                </div>
            </div>
        </section>
    );
}

/* Feature Card */
function Feature({ icon, title, description }) {
    return (
        <div className="flex items-start gap-4 text-left max-w-xs">
            <div className=" bg-gray-800 rounded-full">{icon}</div>
            <div>
                <h4 className="text-lg font-semibold text-green-400">{title}</h4>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
        </div>
    );
}

/* Checkmark List Item */
function CheckItem({ text }) {
    return (
        <div className="flex items-center gap-2 text-gray-800">
            <CheckIcon />
            <p>{text}</p>
        </div>
    );
}
