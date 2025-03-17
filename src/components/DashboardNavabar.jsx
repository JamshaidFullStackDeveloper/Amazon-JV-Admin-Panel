import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import CompanyLogo from "../assets/AmazonLandingPage/Logo.svg";
import { useAuth } from "@/context/AuthContext";

const DashboardNavbar = () => {
  const [activeSection, setActiveSection] = useState("");
  const loction = useLocation();
  const { user } = useAuth();
  console.log(user);

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
    <Card className="bg-card p-4 border-0 flex items-center justify-between gap-6 w-[95%] max-w-8xl mx-auto rounded-2xl bg-[#07060D] fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* Company Logo */}
      <Link to="/" className="flex gap-2 text-center items-center">
        <h1 className="text-white font-bold">Amazon JV</h1>
      </Link>

      {/* Center Navigation Links */}
      <ul className="hidden md:flex items-center gap-8 text-white">
        {[
          { name: "Dashboard", path: "/dashboard" },
          { name: "Investors", path: "/investors" },
          { name: "Requests", path: "#" },
          { name: "Pools", path: "#" },
          { name: "Meeting Requests", path: "#" },
        ].map((item) => (
          <li key={item.name}>
            <Link
              to={item.path}
              className={`relative pb-2 ${location.pathname === item.path ? "text-[#09B96D] font-bold border-b-2 border-[#09B96D]" : "font-normal"
                }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right-Side Actions */}
      <div className="flex items-center">
        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <div className="relative hidden md:block">
            <Bell className="text-white h-6 w-6 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">2</span>
          </div>

          {/* Profile Section */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
              <img src={""} alt="Profile" className="h-8 w-8 rounded-full" />
              <span className="hidden md:inline-block text-white">Jamshaid Ali</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" >
              <DropdownMenuItem>
                <Link to="/#">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/#">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/#">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
                <Link to="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="#">Pools</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#">Meeting Requests</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="#">
                  <Button variant="secondary" className="w-full text-sm rounded-lg bg-[#0058EA] text-white hover:bg-blue-600">
                    Log Out
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

export default DashboardNavbar;
