import React from "react";
import { Card } from "@/components/ui/card";

const StatsSection = () => {
    return (
        <section id="stats" className="py-12">
            <div className="container mx-auto" data-aos="fade-up" data-aos-delay="100">
                <div className="flex flex-wrap justify-center gap-6">
                    <Card className="w-72 h-36 flex flex-col items-center justify-center text-center p-4">
                        <span className="text-4xl font-bold">232</span>
                        <p className="text-lg">Investors</p>
                    </Card>
                    <Card className="w-72 h-36 flex flex-col items-center justify-center text-center p-4">
                        <span className="text-4xl font-bold">152</span>
                        <p className="text-lg">Total Stores</p>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
