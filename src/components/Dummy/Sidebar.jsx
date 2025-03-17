import React, { useEffect, useState } from "react";
import {
    HomeIcon,
    Settings2Icon,
    UserIcon,
    ChevronDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import CompanyLogo from "@/SVG/CompanyLogo";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";


const Sidebar = ({ children }) => {
    const location = useLocation();
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const menuItems = [
        { name: "Patent", icon: <HomeIcon />, link: "/Dashboard" },
        { name: "Profile", icon: <UserIcon />, link: "/profile" },
        { name: "Settings", icon: <Settings2Icon />, link: "/settings" },
    ];
    useEffect(() => {
        console.log("Pathname changed:", location.pathname);
    }, []);

    const productItems = [
        {
            name: "IP Search",
            options: ["Search 1", "Search 2"],
        },
        {
            name: "Reports",
            options: ["Report 3", "Report 4"],
        },
    ];



    return (
        <div className="flex h-screen w-full ">
            <div className="hidden lg:block lg:w-64 lg:shrink-0 lg:border-r lg:bg-gray-100  bg-white rounded-lg border-2 mt-4" style={{ height: 'calc(100vh - 34px)' }}>
                <div className="flex h-full flex-col justify-between py-6 px-4">
                    <div className="space-y-6">
                        <Link href="#" className="flex items-center gap-2 font-bold  border-gray-200 border-2 rounded-lg p-4 m-1" prefetch={false}>
                            <CompanyLogo />
                            <div >
                                <h1 className="text-lg font-bold text-[#1A77F8]">IP Station</h1>
                                {/* <p>Tracker</p> */}
                            </div>
                        </Link>
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.link}
                                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${location.pathname === item.link
                                        ? "bg-[#1A77F8] text-white"
                                        : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                                        }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}
                            {/* Reports Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsReportsOpen(!isReportsOpen)}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50"
                                >
                                    <ChevronDownIcon className={`h-5 w-5 transform ${isReportsOpen ? 'rotate-180' : ''}`} />
                                    Reports
                                </button>
                                {isReportsOpen && (
                                    <div className="absolute left-0 w-full bg-white shadow-lg rounded-md mt-2">
                                        {productItems[1].options.map((option, index) => (
                                            <Link
                                                key={index}
                                                href="#"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                            >
                                                {option}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </nav>
                    </div>
                    <div className="space-y-4">
                        <Button variant="outline" size="sm" className="w-full">
                            Upgrade to Pro
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <GlobeIcon className="h-5 w-5" />
                            <span>English</span>
                        </div>
                    </div>
                </div>
            </div >
            <div className="flex-1">
                <header className="sticky top-0 z-10 border-b bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 lg:hidden">
                    <div className="flex items-center justify-between">
                        <Link href="#" className="flex items-center gap-2 font-bold" prefetch={false}>
                            <CompanyLogo />
                            <span className="text-lg font-bold text-[#1A77F8]">IP Station</span>
                        </Link>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <MenuIcon className="h-6 w-6" />
                                    <span className="sr-only">Toggle navigation</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64">
                                <div className="flex h-full flex-col justify-between py-6 px-4">
                                    <div className="space-y-6">
                                        {/* <nav className="space-y-1"> */}
                                        {/* <!~~ <Link ~~> */}
                                        {/* <!~~ href="dashboard" ~~> */}
                                        {/* <!~~ className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${location.pathname === item.link ~~> */}
                                        {/* <!~~ ? "bg-gray-200 text-gray-900" ~~> */}
                                        {/* <!~~ : "text-gray-700 hover:bg-gray-200 hover:text-gray-900" ~~> */}
                                        {/* <!~~ }`} ~~> */}
                                        {/* <!~~ prefetch={false} ~~> */}
                                        {/* <!~~ > ~~> */}
                                        {/* <!~~ <HomeIcon className="h-5 w-5" /> ~~> */}
                                        {/* <!~~ Home ~~> */}
                                        {/* <!~~ </Link> ~~> */}
                                        {/* <!~~ <Link ~~> */}
                                        {/* <!~~ href="/" ~~> */}
                                        {/* <!~~ className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50" ~~> */}
                                        {/* <!~~ prefetch={false} ~~> */}
                                        {/* <!~~ > ~~> */}
                                        {/* <!~~ <LayoutGridIcon className="h-5 w-5" /> ~~> */}
                                        {/* <!~~ Products ~~> */}
                                        {/* <!~~ </Link> ~~> */}
                                        {/* <!~~ <Link ~~> */}
                                        {/* <!~~ href="#" ~~> */}
                                        {/* <!~~ className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50" ~~> */}
                                        {/* <!~~ prefetch={false} ~~> */}
                                        {/* <!~~ > ~~> */}
                                        {/* <!~~ <UsersIcon className="h-5 w-5" /> ~~> */}
                                        {/* <!~~ Customers ~~> */}
                                        {/* <!~~ </Link> ~~> */}
                                        {/* <!~~ <Link ~~> */}
                                        {/* <!~~ href="#" ~~> */}
                                        {/* <!~~ className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50" ~~> */}
                                        {/* <!~~ prefetch={false} ~~> */}
                                        {/* <!~~ > ~~> */}
                                        {/* <!~~ <ActivityIcon className="h-5 w-5" /> ~~> */}
                                        {/* <!~~ Analytics ~~> */}
                                        {/* <!~~ </Link> ~~> */}
                                        {/* <!~~ Reports Dropdown ~~> */}
                                        {/* <div className="relative"> */}
                                        {/* <button */}
                                        {/* onClick={() => setIsReportsOpen(!isReportsOpen)} */}
                                        {/* className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50" */}
                                        {/* > */}
                                        {/* <ChevronDownIcon className={`h-5 w-5 transform ${isReportsOpen ? 'rotate-180' : ''}`} /> */}
                                        {/* Reports */}
                                        {/* </button> */}
                                        {/* {isReportsOpen && ( */}
                                        {/* <div className="absolute left-0 w-full bg-white shadow-lg rounded-md mt-2"> */}
                                        {/* {productItems[1].options.map((option, index) => ( */}
                                        {/* <Link */}
                                        {/* key={index} */}
                                        {/* href="#" */}
                                        {/* className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200" */}
                                        {/* > */}
                                        {/* {option} */}
                                        {/* </Link> */}
                                        {/* ))} */}
                                        {/* </div> */}
                                        {/* )} */}
                                        {/* </div> */}
                                        {/* </nav> */}
                                        <nav className="space-y-1">
                                            {menuItems.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    to={item.link}
                                                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${location.pathname === item.link
                                                        ? "bg-[#1A77F8] text-white"
                                                        : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                                                        }`}
                                                >
                                                    {item.icon}
                                                    {item.name}
                                                </Link>
                                            ))}
                                            {/* Reports Dropdown */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setIsReportsOpen(!isReportsOpen)}
                                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-50"
                                                >
                                                    <ChevronDownIcon className={`h-5 w-5 transform ${isReportsOpen ? 'rotate-180' : ''}`} />
                                                    Reports
                                                </button>
                                                {isReportsOpen && (
                                                    <div className="absolute left-0 w-full bg-white shadow-lg rounded-md mt-2">
                                                        {productItems[1].options.map((option, index) => (
                                                            <Link
                                                                key={index}
                                                                href="#"
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                                            >
                                                                {option}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                        </nav>
                                    </div>
                                    <div className="space-y-4">
                                        <Button variant="outline" size="sm" className="w-full">
                                            Upgrade to Pro
                                        </Button>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <GlobeIcon className="h-5 w-5" />
                                            <span>English</span>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </header>
                <main className=" lg:p-4">

                    {/* <h1 className="text-2xl font-bold">Dashboard</h1> */}
                    {/* <p className="text-gray-500 dark:text-gray-400"> */}
                    {/* Welcome to your dashboard. Here you can manage your products, customers, and analytics. */}
                    {/* </p> */}
                    {/* <div className="mt-8"> */}
                    {/* <Card> */}
                    {/* <CardHeader> */}
                    {/* <CardTitle>Link in Bio</CardTitle> */}
                    {/* <CardDescription>Add a link to your social media profiles.</CardDescription> */}
                    {/* </CardHeader> */}
                    {/* <CardContent> */}
                    {/* <form> */}
                    {/* <div className="grid gap-4"> */}
                    {/* <Input label="Link" placeholder="Enter your link" width="100%" /> */}
                    {/* <Button type="submit" className="w-full"> */}
                    {/* Save */}
                    {/* </Button> */}
                    {/* </div> */}
                    {/* </form> */}
                    {/* </CardContent> */}
                    {/* </Card> */}
                    {/* </div> */}
                    {children}
                </main>
            </div>
        </div >
    );
};

export default Sidebar;

function GlobeIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
        </svg>
    )
}


// function HomeIcon(props) {
//     return (
//         <svg
//             {...props}
//             xmlns="http://www.w3.org/2000/svg"
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//             <polyline points="9 22 9 12 15 12 15 22" />
//         </svg>
//     )
// }

function ActivityIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
        </svg>
    )
}


function LayoutGridIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
    )
}


function MenuIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    )
}


function MountainIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    )
}


function UsersIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}