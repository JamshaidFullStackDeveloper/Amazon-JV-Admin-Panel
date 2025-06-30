"use client"

import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Bell, ChevronDown, ChevronUp, Menu } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import NotificationPanel from "./Notification-panel"
import Cookies from "js-cookie"

const DashboardNavbar = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("")
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const location = useLocation()
  const user = JSON.parse(Cookies.get("user") || "{}");
  const { logout } = useAuth()

  const unreadCount = 2 // You can make this dynamic based on your notification state

  useEffect(() => {
    const sections = ["home", "faqs", "contact", "about"]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1, // Adjust this value based on when you want highlighting to occur
      },
    )

    sections.forEach((id) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })

    return () => {
      sections.forEach((id) => {
        const section = document.getElementById(id)
        if (section) observer.unobserve(section)
      })
    }
  }, [])

  // ✅ Scroll handler for navbar position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20) // Adjust 20px as needed
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setShowLogoutDialog(false); // hide dialog regardless
    }
  };


  const handleLogoutCancel = () => {
    setShowLogoutDialog(false)
  }

  return (
    <>
      <Card className={`bg-card p-4 border-0 flex items-center justify-between gap-6 w-[95%] max-w-8xl mx-auto rounded-2xl bg-[#07060D] fixed z-50 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${isScrolled ? "top-0 shadow-lg" : "top-4"
        }`}>
        {/* Company Logo */}
        <Link to="/" className="flex gap-2 text-center items-center">
          <h1 className="text-white font-bold">Amazon JV</h1>
        </Link>

        {/* Center Navigation Links */}
        <ul className="hidden md:flex items-center gap-8 text-white">
          {[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Investors", path: "/investors" },
            { name: "Requests", path: "/requests" },
            // { name: "Pools", path: "/pools" },
            { name: "Meeting Requests", path: "/meetingRequest" },
            { name: "Graveyard Investors", path: "/graveyardInvestors" },
            { name: "FAQ", path: "/faqs" },
            { name: "Support", path: "/support" },


          ].map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`relative pb-2 ${location.pathname === item.path
                  ? "text-[#09B96D] font-bold border-b-2 border-[#09B96D]"
                  : "font-normal hover:text-[#09B96D] transition-colors"
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
              <Button
                variant="ghost"
                size="sm"
                className="relative text-white p-2"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-6 w-6 cursor-pointer" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Profile Section */}
            <DropdownMenu onOpenChange={(open) => setMenuOpen(open)}>
              <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition-colors">
                {/* <img */}
                {/* src={user?.data?.avatar || "/placeholder.svg?height=32&width=32"} */}
                {/* alt="Profile" */}
                {/* className="h-8 w-8 rounded-full object-cover" */}
                {/* onError={(e) => { */}
                {/* // e.target.src = "/placeholder.svg?height=32&width=32" */}
                {/* }} */}
                {/* /> */}
                <span className="hidden md:inline-block text-white">{user?.name || "Jamshaid Ali"}</span>
                {menuOpen ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/manageBankDetiles" className="w-full">
                    Manage Bank Accounts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogoutClick}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Dropdown Menu for Smaller Screens */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Notification Icon */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-white hover:bg-gray-800 p-2"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/dashboard" className="w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/investors" className="w-full">
                    Investors
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/requests" className="w-full">
                    Requests
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/pools" className="w-full">
                    Pools
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/meetingRequest" className="w-full">
                    Meeting Requests
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/graveyardInvestors" className="w-full">
                    Graveyard Investors
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link to="/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogoutClick}>
                  <Button
                    variant="secondary"
                    className="w-full text-sm rounded-lg bg-[#0058EA] text-white hover:bg-blue-600"

                  >
                    Log Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Notification Panel */}
      <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogoutCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutConfirm} className="bg-red-600 hover:bg-red-700">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DashboardNavbar