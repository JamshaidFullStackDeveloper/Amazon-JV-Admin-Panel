import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
// import Image from "next/image";

const ServicesSection = () => {
    const services = [
        {
            title: "Investment Tracking",
            description:
                "Monitor your investments in real-time. Stay updated with live performance metrics to make informed decisions.",
            imgSrc: "/assets/img/icons/market.png",
            delay: 100,
        },
        {
            title: "Market Analysis",
            description:
                "Get detailed market insights and trends. Leverage data-driven analysis to guide your investment choices.",
            imgSrc: "/assets/img/icons/search.png",
            delay: 200,
        },
        {
            title: "Portfolio Management",
            description:
                "Easily manage your diverse investments. Optimize your portfolio for growth with personalized recommendations.",
            imgSrc: "/assets/img/icons/bag.png",
            delay: 300,
        },
        {
            title: "Financial Planning",
            description:
                "Plan your financial future with tailored strategies. Set goals and track progress for long-term wealth building.",
            imgSrc: "/assets/img/icons/money.png",
            delay: 400,
        },
    ];

    return (
        <section id="services" className="py-12 px-28 bg-gray-100">
            <div className="container mx-auto text-center mb-8" data-aos="fade-up">
                <h2 className="text-3xl font-bold">Services</h2>
                <p className="text-lg text-gray-600">
                    It is a long established fact that a reader will be distracted by the
                    readable content of a page.
                </p>
            </div>

            <div className="container mx-auto grid md:grid-cols-2 gap-6" data-aos="fade-up" data-aos-delay="100">
                {services.map((service, index) => (
                    <Card
                        key={index}
                        className="p-6 flex items-start space-x-4"
                        data-aos="fade-up"
                        data-aos-delay={service.delay}
                    >
                        <div className="w-10 h-10">
                            <Image src={service.imgSrc} alt={service.title} width={40} height={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                            <Button variant="link" className="p-0 mt-2">Read More →</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default ServicesSection;
