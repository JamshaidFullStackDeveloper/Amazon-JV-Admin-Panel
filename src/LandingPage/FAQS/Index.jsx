import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";
import FAQSArrow from '../../assets/AmazonLandingPage/FAQS.png';

const FAQSection = () => {
    const [openItem, setOpenItem] = useState(null);

    const faqs = [
        {
            question: "What is the minimum amount required to start investing?",
            answer: "The minimum amount varies based on the investment plan you choose. Start with as little as $1-$5000.",
        },
        {
            question: "How can I track my investment performance?",
            answer: "You can track it through our dashboard with real-time analytics.",
        },
        {
            question: "Is my investment secure?",
            answer: "Yes, we use advanced security protocols to safeguard your investments.",
        },
        {
            question: "Can I withdraw my funds anytime?",
            answer: "Yes, withdrawals are processed instantly based on your plan’s conditions.",
        },
        {
            question: "How do I choose the best investment plan?",
            answer: "Consult our expert advisors or use our AI-based recommendation system.",
        },
        {
            question: "What is the expected return on investment?",
            answer: "Returns vary based on market conditions and the chosen investment plan.",
        },
    ];

    return (
        <section id="faq" className="py-12 px-28 bg-gray-100">
            <div className="container mx-auto grid md:grid-cols-2 gap-8 items-start">
                {/* Left Side */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-4xl font-bold">Have a question? Check out the FAQ</h2>
                    <p className="text-lg text-gray-600 mt-2">
                        Find answers to common questions about our investment platform.
                    </p>
                    <img src={FAQSArrow} className="h-64 w-80" />
                </div>

                {/* Right Side */}
                <div className="min-h-[400px]"> {/* Set a minimum height */}
                    <Accordion type="single" collapsible>
                        {faqs.map((faq, index) => (
                            <Card key={index} className="p-4 bg-white my-3">
                                <AccordionItem
                                    value={faq.question}
                                    className="border-b last:border-none cursor-pointer"
                                    onClick={() => setOpenItem(openItem === index ? null : index)}
                                >
                                    <div className="flex justify-between items-center font-semibold text-green-600">
                                        {faq.question}
                                        <ChevronDown className={`transition-transform ${openItem === index ? "rotate-180" : ""}`} />
                                    </div>
                                    <div
                                        className={`transition-all duration-300 overflow-hidden ${openItem === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <p className="text-gray-600 mt-2">{faq.answer}</p>
                                    </div>
                                </AccordionItem>
                            </Card>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
