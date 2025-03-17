import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Search, Plus, Trash2, Pencil } from "lucide-react";
import DashboardLayout from "@/layouts/Layout";
import { PaginationItem } from "@/components/ui/pagination";
import { PaginationNext } from "@/components/ui/pagination";
import { PaginationLink } from "@/components/ui/pagination";
import { PaginationContent } from "@/components/ui/pagination";
import { PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { clearMessages, fetchData } from "@/redux/GetApiSlice/InvestorsList";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "@/components/OpenModal";
import AddInvestors from "./AddInvestors";

const investors = [
    { name: "Liam Davis", email: "Lbecchi@msn.com", investment: "$10,500", type: "Active", status: "Withdraw" },
    { name: "James Martinez", email: "Kludge@comcast.net", investment: "$5,000", type: "In-active", status: "Withdraw" },
    { name: "Olivia Miller", email: "Improv@comcast.net", investment: "$7,325", type: "Active", status: "Pending" },
    { name: "Ava Davis", email: "Jesse@comcast.net", investment: "$8,950", type: "Active", status: "Pending" },
    { name: "Sophia Garcia", email: "Gator@yahoo.ca", investment: "$12,410", type: "Active", status: "Requested" },
    { name: "William Garcia", email: "Sethbrown@live.com", investment: "$1,430", type: "In-active", status: "Requested" },
    { name: "Emma Miller", email: "Seanoq@sbcglobal.net", investment: "$1,500", type: "In-active", status: "Requested" },
    { name: "Ava Garcia", email: "Nasarius@outlook.com", investment: "$5,200", type: "Active", status: "Pending" },
    { name: "Liam Davis", email: "Lbecchi@msn.com", investment: "$10,500", type: "Active", status: "Withdraw" },
    { name: "James Martinez", email: "Kludge@comcast.net", investment: "$5,000", type: "In-active", status: "Withdraw" },
    { name: "Olivia Miller", email: "Improv@comcast.net", investment: "$7,325", type: "Active", status: "Pending" },
    { name: "Ava Davis", email: "Jesse@comcast.net", investment: "$8,950", type: "Active", status: "Pending" },
    { name: "Sophia Garcia", email: "Gator@yahoo.ca", investment: "$12,410", type: "Active", status: "Requested" },
    { name: "William Garcia", email: "Sethbrown@live.com", investment: "$1,430", type: "In-active", status: "Requested" },
    { name: "Emma Miller", email: "Seanoq@sbcglobal.net", investment: "$1,500", type: "In-active", status: "Requested" },
    { name: "Ava Garcia", email: "Nasarius@outlook.com", investment: "$5,200", type: "Active", status: "Pending" },
    { name: "Ava Davis", email: "Jesse@comcast.net", investment: "$8,950", type: "Active", status: "Pending" },
    { name: "Sophia Garcia", email: "Gator@yahoo.ca", investment: "$12,410", type: "Active", status: "Requested" },
    { name: "William Garcia", email: "Sethbrown@live.com", investment: "$1,430", type: "In-active", status: "Requested" },
];

const statusColors = {
    Withdraw: "bg-blue-500",
    Pending: "bg-gray-400",
    Requested: "bg-red-500",
};

const ROWS_PER_PAGE = 8;
const Investors = () => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterType, setFilterType] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, status, error, successMessage } = useSelector((state) => state.api);

    console.log(data);


    useEffect(() => {
        // Only dispatch if the status is 'idle' (no request in progress)
        if (status === 'idle') {
            dispatch(fetchData('/users'));
        }
    }, [])

    // Optionally clear messages after some time
    useEffect(() => {
        if (status === 'succeeded' || status === 'failed') {
            const timeout = setTimeout(() => {
                dispatch(clearMessages());
            }, 5000);
            return () => clearTimeout(timeout); // Clear timeout on unmount
        }
    }, [status, dispatch]);


    const filteredInvestors = investors?.filter((investor) => {


        return (
            (searchQuery === "" ||
                investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                investor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                investor.investment.includes(searchQuery) ||
                investor.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                investor.type.toLowerCase().includes(searchQuery.toLowerCase())) &&
            // (filterStatus === "all" || investor.status === filterStatus)
            // && // Updated condition
            (filterType === "" || filterType === "all" || investor.type === filterType) // Updated condition
        );
    });

    console.log(filteredInvestors);

    // Ensure current page is within bounds after filtering
    useEffect(() => {
        if (currentPage > Math.ceil(filteredInvestors.length / ROWS_PER_PAGE)) {
            setCurrentPage(1); // Reset to first page if out of range
        }
    }, [filteredInvestors?.length]);
    // Function to filter investors based on search and filters

    const totalPages = Math.ceil(investors?.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const displayedInvestors = filteredInvestors?.slice(startIndex, startIndex + ROWS_PER_PAGE);
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const highlightMatch = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, "gi");
        return text.split(regex).map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={i} className="bg-yellow-300 text-gray-700">{part}</span>
            ) : (
                part
            )
        );
    };

    return (
        <DashboardLayout>
            <div className="p-6 md:px-12  ">
                <h2 className="text-2xl font-semibold">Investors</h2>
                <p className="text-gray-500">Manage and oversee detailed profiles, investments, and activities of all registered investors efficiently.</p>

                {/* Search & Filter Section */}
                <div className="flex flex-wrap justify-between mt-4 space-x-2">
                    <Input
                        placeholder="Search by name, email, amount, status or type"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                    />
                    <Select onValueChange={setFilterType} value={filterType}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="In-active">In-active</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* <Select onValueChange={setFilterStatus} value={filterStatus}> */}
                    {/* <SelectTrigger className="w-48"> */}
                    {/* <SelectValue placeholder="Filter by Status" /> */}
                    {/* </SelectTrigger> */}
                    {/* <SelectContent> */}
                    {/* <SelectItem value="all">All</SelectItem> */}
                    {/* <SelectItem value="Withdraw">Withdraw</SelectItem> */}
                    {/* <SelectItem value="Pending">Pending</SelectItem> */}
                    {/* <SelectItem value="Requested">Requested</SelectItem> */}
                    {/* </SelectContent> */}
                    {/* </Select> */}
                    <Button className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="w-4 h-4 mr-2 bg-white text-blue-500 font-bold rounded-sm" /> Add New
                    </Button>
                </div>


                <Table className="mt-6 bg-white rounded-lg shadow-sm">
                    <TableHeader className="">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Investment</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayedInvestors?.length > 0 ? (displayedInvestors.map((investor, index) => (
                            <TableRow key={index}>
                                <TableCell>{highlightMatch(investor.name, searchQuery)}</TableCell>
                                <TableCell>{highlightMatch(investor.email, searchQuery)}</TableCell>
                                <TableCell>{highlightMatch(investor.investment, searchQuery)}</TableCell>
                                <TableCell>
                                    <Badge variant={investor.type === "Active" ? "default" : "secondary"}>
                                        {highlightMatch(investor.type, searchQuery)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${statusColors[investor.status]} text-white`}>
                                        {highlightMatch(investor.status, searchQuery)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="icon">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline">View Detail</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                                    No investors found
                                </TableCell>
                            </TableRow>
                        )
                        }
                    </TableBody>
                </Table>


                {/* Pagination */}
                <div className="flex justify-between  mt-4 ">
                    <p className="text-gray-500 whitespace-nowrap">Showing {startIndex + 1} to {Math.min(startIndex + ROWS_PER_PAGE, investors.length)} of {investors.length} data</p>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                                    className={"text-blue-500"}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        onClick={() => handlePageChange(index + 1)}
                                        isActive={index + 1 === currentPage}
                                        className={`px-4 py-2 rounded-md ${index + 1 === currentPage ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white" : "bg-white hover:bg-blue-700 hover:text-white"
                                            }`}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
            {/* Custom Modal */}
            {isModalOpen &&
                <CustomModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    Children={<AddInvestors />}
                    width={"70%"}
                />
            }
        </DashboardLayout>
    );
};

export default Investors;
