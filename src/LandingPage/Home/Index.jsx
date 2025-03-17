import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import LandingPageLayout from "../Layout";
import Footer from "../Footer/Index";
import HomeSection from "./Home";
import InvestmentSection from "../InvestmentSection/Index";
import FeatureTabs from "../FeatureSection/Index";
import FeaturesSection from "../FeatureSection/Feature";
import Testimonials from "../Testimation/Index";
import StatsSection from "../Testimation/StateSection";
import ServicesSection from "../Services/Index";
import FAQSection from "../FAQS/Index";
import CallToAction from "../ContactUS/CallToAction";
import ContactSection from "../ContactUS/Index";
import CustomModal from "@/components/OpenModal";
import MeetingBooking from "../BookMeeting";
// import CustomModal from "@/components/CustomModal"; // Import your modal component

const HomePage = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <LandingPageLayout>
            <div className="w-[90%] max-w-8xl mx-auto" id="home">
                <HomeSection />
                <InvestmentSection />
                <FeatureTabs />
                <FeaturesSection />
                <Testimonials />
                <StatsSection />
            </div>

            <ServicesSection />
            <div id="faqs">
                <FAQSection />
            </div>

            <CallToAction />

            <div className="w-[90%] max-w-8xl mx-auto" id="contact">
                <ContactSection />
            </div>

            <Footer />

            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
                >
                    <FaArrowUp size={20} />
                </button>
            )}

            {/* Floating Book Meeting Button */}
            <button
                className="fixed bottom-24 right-6 transform -translate-y-1/2 bg-[#0071E4] text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold 
          animate-bounce hover:animate-none hover:bg-[#0071E4] transition duration-1000"
                onClick={() => setIsModalOpen(true)}
            >
                Book Meeting
            </button>

            {/* Custom Modal */}
            {isModalOpen &&
                <CustomModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    Children={<MeetingBooking />}
                    width={"100%"}
                />
            }
        </LandingPageLayout>
    );
};

export default HomePage;
