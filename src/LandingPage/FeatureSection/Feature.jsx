import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaChartBar, FaShieldAlt, FaGlobe, FaCogs, FaLightbulb } from "react-icons/fa";
import AmazonFature from '../../assets/AmazonLandingPage/AmazonImg.png'
import { Image } from "lucide-react";
const features = [
    {
        title: "Only Halal Product",
        description:
            "Manage your investments from anywhere. Access real-time data on your mobile device for seamless control.",
        icon: "/assets/img/icons/mobile.png",
        delay: 200,
        align: "right",
    },
    {
        title: "Smart Insights",
        description:
            "Get actionable insights tailored to your investment preferences, helping you make smarter decisions for growth.",
        icon: "/assets/img/icons/bulb.png",
        delay: 300,
        align: "right",
    },
    {
        title: "Global Reach",
        description:
            "Invest globally and access diverse opportunities in markets around the world, right from your device.",
        icon: "/assets/img/icons/key.png",
        delay: 400,
        align: "right",
    },
    {
        title: "Custom Settings",
        description:
            "Personalize your experience with customized notifications, alerts, and reporting options to fit your needs.",
        icon: "/assets/img/icons/globe.png",
        delay: 200,
        align: "left",
    },
    {
        title: "Investment Analytics",
        description:
            "Visualize your portfolio's performance with in-depth analytics, allowing you to track your growth over time.",
        icon: "/assets/img/icons/setting.png",
        delay: 300,
        align: "left",
    },
    {
        title: "Expert Support",
        description:
            "Get professional guidance and support around the clock. Your success is our priority.",
        icon: "/assets/img/icons/market.png",
        delay: 400,
        align: "left",
    },
];

export default function FeaturePage() {
    return (
        <div className="flex flex-col items-center gap-10 p-10">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["FBA", "FBM", "Wholesale"].map((category, index) => (
                    <Card key={index} className="p-5 text-white bg-gray-900">
                        <CardContent>
                            <h3 className="text-lg font-semibold">{category}</h3>
                            <ul className="mt-2 text-sm space-y-1">
                                <li>• High growth potential</li>
                                <li>• Diversified markets</li>
                                <li>• Strategic investment</li>
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Middle Section */}
            <section id="features-2" className="py-16">
                <div className="container mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        {/* Left Features */}
                        <div className="space-y-6">
                            {features
                                .filter((feature) => feature.align === "right")
                                .map((feature, index) => (
                                    <Card
                                        key={index}
                                        className="p-4 flex items-center justify-end gap-4 text-right"
                                        data-aos="fade-right"
                                        data-aos-delay={feature.delay}
                                    >
                                        <div>
                                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                                            <p className="text-sm text-gray-600">{feature.description}</p>
                                        </div>
                                        <Image
                                            src={feature.icon}
                                            alt={feature.title}
                                            width={30}
                                            height={30}
                                            className="shrink-0"
                                        />
                                    </Card>
                                ))}
                        </div>

                        {/* Center Mockup */}
                        <div className="flex justify-center" data-aos="zoom-in" data-aos-delay="200">
                            <img src={AmazonFature} className="h-[500px] w-72" />
                        </div>

                        {/* Right Features */}
                        <div className="space-y-6">
                            {features
                                .filter((feature) => feature.align === "left")
                                .map((feature, index) => (
                                    <Card
                                        key={index}
                                        className="p-4 flex items-center gap-4"
                                        data-aos="fade-left"
                                        data-aos-delay={feature.delay}
                                    >
                                        <Image
                                            src={feature.icon}
                                            alt={feature.title}
                                            width={30}
                                            height={30}
                                            className="shrink-0"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                                            <p className="text-sm text-gray-600">{feature.description}</p>
                                        </div>
                                    </Card>
                                ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* Call to Action */}
            <div className="bg-gray-900 text-white p-10 rounded-xl text-center max-w-auto">
                <h2 className="text-xl font-bold">Start Building Your Wealth with Smart, Secure Investments Today!</h2>
                <p className="mt-2 text-gray-400">Join thousands of successful investors and begin your wealth-building journey today.</p>
                <Button className="mt-5 bg-blue-500 hover:bg-blue-600">Get Started Now</Button>
            </div>
        </div>
    );
}
