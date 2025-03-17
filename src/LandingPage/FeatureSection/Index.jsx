"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import FeatureImage from '../../assets/AmazonLandingPage/FeatureImage.png'
import DoubleCheckIcon from "@/SVG/LandingPage/DoubleCheckIcon";

const tabTitle = {
    "Real Insights": [
        "Gain Real - Time Investment Insights"
    ],
    "Secure Options": [
        "Secure Options - Time Investment Insights"
    ],
    "Expert Support": [
        "Expert Support - Time Investment Insights"
    ],
};

const tabData1 = {
    "Real Insights": [
        "Stay ahead in the market with accurate, up-to-date insights tailored to your portfolio. Make informed decisions with confidence."
    ],
    "Secure Options": [
        "Stay ahead in the market with accurate, up-to-date insights tailored to your portfolio. Make informed decisions with confidence."
    ],
    "Expert Support": [
        "Stay ahead in the market with accurate, up-to-date insights tailored to your portfolio. Make informed decisions with confidence."
    ],
};

const tabData = {
    "Real Insights": [
        "Live Market Updates – Get the latest market trends",
        "Performance Tracking – Monitor your investments easily",
        "Custom Analytics – Insights tailored to your goals",
        "Decision-Making Tools – Make smarter investment choices",
    ],
    "Secure Options": [
        "Robust Security Measures – Protect your investments",
        "Two-Factor Authentication – Extra layer of security",
        "Data Encryption – Keep your data safe",
        "Regulated Platforms – Trade with confidence",
    ],
    "Expert Support": [
        "24/7 Assistance – Get help anytime you need",
        "Market Experts – Insights from professionals",
        "Personalized Guidance – Tailored advice",
        "Community Support – Learn from peers",
    ],
};

export default function FeatureTabs() {
    const [selectedTab, setSelectedTab] = useState("Real Insights");

    return (
        <div className="w-full max-w-8xl mx-auto text-center">
            <h2 className="text-2xl font-bold">Our Features</h2>
            <p className="text-gray-500">Explore the tools that make investing effortless and rewarding.</p>

            <Tabs defaultValue="Real Insights" className="mt-6" onValueChange={setSelectedTab}>
                <TabsList className="flex justify-center space-x-2 w-[410px] h-12 mx-auto">
                    {Object.keys(tabData).map((tab) => (
                        <TabsTrigger key={tab} value={tab} className="px-4 py-2 min-w-fit inline-flex items-center justify-center transition-colors data-[state=active]:text-white  data-[state=active]:bg-[#0058EA] rounded-lg">
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <div className="mt-6 flex justify-between items-center">
                <div className="flex flex-col gap-8">
                    <div>
                        {tabTitle[selectedTab].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                                className="flex items-center space-x-2"
                            >
                                <h1 className="text-2xl font-bold">{item}</h1>
                            </motion.div>
                        ))}
                    </div>
                    <div className="w-[75%]">
                        {tabData1[selectedTab].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="flex space-x-2 text-left"
                            >
                                <h3 className="text-xl">{item}</h3>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-left space-y-3">
                        {tabData[selectedTab].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="flex items-center space-x-2"
                            >
                                <DoubleCheckIcon />
                                <p className="text-gray-700">{item}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* Right-Side Illustration (Placeholder) */}
                <motion.div
                    key={selectedTab}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-[50%]  bg-blue-100 rounded-xl flex items-center justify-center "
                >
                    <img src={FeatureImage} />
                </motion.div>
            </div>

        </div>
    );
}
