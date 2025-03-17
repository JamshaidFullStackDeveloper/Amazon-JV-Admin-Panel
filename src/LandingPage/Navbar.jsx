import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import CompanyLogo from "../assets/AmazonLandingPage/Logo.svg";

const Navbar = () => {
    const [activeSection, setActiveSection] = useState("");
    const loction = useLocation();
    useEffect(() => {
        const sections = ["home", "faqs", "contact", "about"];


        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.1, // Adjust this value based on when you want highlighting to occur
            }
        );

        sections.forEach((id) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => {
            sections.forEach((id) => {
                const section = document.getElementById(id);
                if (section) observer.unobserve(section);
            });
        };
    }, []);

    return (
        <Card className="bg-card px-4 border-0 flex items-center justify-between gap-6 w-[90%] max-w-8xl mx-auto rounded-2xl bg-[#07060D] fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            {/* Company Logo */}
            <Link to="/" className="flex gap-2 text-center items-center">
                <img src={CompanyLogo} />
            </Link>

            {/* Center Navigation Links */}
            <ul className="hidden md:flex-grow md:flex items-center justify-center gap-10 text-card-foreground text-white">
                <li
                    className={activeSection === "home" ? "text-[#09B96D] font-bold" : "font-normal"}
                    onClick={() => document.getElementById("home").scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                    <Link to="/">   Home </Link>
                </li>
                <li className={location.pathname === "/calculator" ? "text-[#09B96D] font-bold" : "font-normal"}>
                    <Link to="/calculator">Investment Plans</Link>
                </li>
                <li
                    className={activeSection === "about" ? "text-[#09B96D] font-bold" : "font-normal"}
                    onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth", block: "center" })}
                >
                    <Link to="#">About Us</Link>

                </li>
                <li
                    className={activeSection === "faqs" ? "text-[#09B96D] font-bold" : "font-normal"}
                    onClick={() => document.getElementById("faqs").scrollIntoView({ behavior: "smooth", block: "center" })}
                >
                    FAQs
                </li>
                <li
                    className={activeSection === "contact" ? "text-[#09B96D] font-bold" : "font-normal"}
                    onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth", block: "center" })}
                >
                    Contact Us
                </li>
            </ul>

            {/* Right-Side Actions */}
            <div className="flex items-center">
                {/* Login Button (Visible on larger screens) */}
                <Link to="/login" className=" cursor-pointer">
                    <Button variant="secondary" className="hidden md:block px-2 rounded-lg bg-[#0058EA] text-white hover:bg-blue-600 cursor-pointer">
                        Invest Now
                    </Button>
                </Link>

                {/* Dropdown Menu for Smaller Screens */}
                <div className="flex md:hidden items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Link to="/">Home</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to="#">Investment Plans</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <a href="#">About Us</a>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to="#">
                                    <Button variant="secondary" className="w-full text-sm rounded-lg bg-[#0058EA] text-white hover:bg-blue-600">
                                        Invest Now
                                    </Button>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Card>
    );
};

export default Navbar;
