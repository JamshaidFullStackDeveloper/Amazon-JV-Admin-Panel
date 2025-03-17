import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CallToAction = () => {
    return (
        <section id="call-to-action-2" className="bg-gray-900 py-16 text-white text-center">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div data-aos="zoom-in" data-aos-delay="100">
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">
                            Invest in Amazon for Long-Term Growth <br />
                            Unlock the potential of one of the world's leading companies.
                        </h3>
                        <p className="text-lg text-gray-300 mb-6">
                            Join millions of investors who are building wealth with Amazon. Take advantage of
                            secure, high-return opportunities in the world’s most valuable company.
                        </p>
                        <Button className={cn("bg-[#0058EA] hover:bg-[#0079ea] text-white px-6 py-3 text-lg")}>Start Investing in Amazon</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
