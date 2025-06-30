"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import DashboardLayout from "@/layouts/Layout"
import { fetchData } from "@/redux/GetApiSlice/Index"
import { useDispatch, useSelector } from "react-redux"
import { resetData } from "@/redux/GetApiSlice/GetSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Media_BASE_URL } from "@/utils/media_Base_URL"

const investorsData = [
    {
        id: 1,
        name: "Liam Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "31 Mar 2025",
        status: "Withdraw",
        investment: "$10,500",
        type: "In-active",
        email: "liam.davis@email.com",
    },
    {
        id: 2,
        name: "James Martinez",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "16 Feb 2025",
        status: "Pending",
        investment: "$5,000",
        type: "In-active",
        email: "james.martinez@email.com",
    },
    {
        id: 3,
        name: "Olivia Miller",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "16 Feb 2025",
        status: "Requested",
        investment: "$7,325",
        type: "Active",
        email: "olivia.miller@email.com",
    },
    {
        id: 4,
        name: "Ava Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "16 Feb 2025",
        status: "Withdraw",
        investment: "$8,950",
        type: "Active",
        email: "ava.davis@email.com",
    },
    {
        id: 5,
        name: "Sophia Garcia",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "15 Apr 2025",
        status: "Withdraw",
        investment: "$12,410",
        type: "Active",
        email: "sophia.garcia@email.com",
    },
    {
        id: 6,
        name: "William Garcia",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "31 Mar 2025",
        status: "Withdraw",
        investment: "$1,430",
        type: "In-active",
        email: "william.garcia@email.com",
    },
    {
        id: 7,
        name: "Emma Miller",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "16 Feb 2025",
        status: "Pending",
        investment: "$1,500",
        type: "In-active",
        email: "emma.miller@email.com",
    },
    {
        id: 8,
        name: "Ava Garcia",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "16 Feb 2025",
        status: "Withdraw",
        investment: "$5,200",
        type: "Active",
        email: "ava.garcia@email.com",
    },
    // Additional data for pagination
    {
        id: 9,
        name: "Michael Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "20 Mar 2025",
        status: "Pending",
        investment: "$15,000",
        type: "Active",
        email: "michael.johnson@email.com",
    },
    {
        id: 10,
        name: "Sarah Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "25 Feb 2025",
        status: "Requested",
        investment: "$9,800",
        type: "In-active",
        email: "sarah.wilson@email.com",
    },
    {
        id: 11,
        name: "David Brown",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "10 Mar 2025",
        status: "Withdraw",
        investment: "$22,500",
        type: "Active",
        email: "david.brown@email.com",
    },
    {
        id: 12,
        name: "Lisa Anderson",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "05 Apr 2025",
        status: "Pending",
        investment: "$6,750",
        type: "In-active",
        email: "lisa.anderson@email.com",
    },
    {
        id: 13,
        name: "Robert Taylor",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "18 Feb 2025",
        status: "Requested",
        investment: "$18,200",
        type: "Active",
        email: "robert.taylor@email.com",
    },
    {
        id: 14,
        name: "Jennifer White",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "28 Mar 2025",
        status: "Withdraw",
        investment: "$4,300",
        type: "In-active",
        email: "jennifer.white@email.com",
    },
    {
        id: 15,
        name: "Christopher Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "12 Feb 2025",
        status: "Pending",
        investment: "$11,900",
        type: "Active",
        email: "christopher.lee@email.com",
    },
    {
        id: 16,
        name: "Amanda Clark",
        avatar: "/placeholder.svg?height=40&width=40",
        lastActiveCycle: "22 Mar 2025",
        status: "Requested",
        investment: "$7,650",
        type: "In-active",
        email: "amanda.clark@email.com",
    },
]

export default function GraveyardInvestors() {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [dateRange, setDateRange] = useState("Feb 15 - Mar 31")
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data } = useSelector((state) => state.api);
    const itemsPerPage = 10
    const totalItems = data?.data?.length // Simulated total count


    const handleViewDetail = (user) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };


    useEffect(() => {
        dispatch(resetData());
        dispatch(fetchData("/graveyard/investors"))
    }, [])


    const getTypeBadge = (type) => {
        return type === "Active" ? (
            <Badge className="bg-blue-500 text-white hover:bg-blue-500">Active</Badge>
        ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                In-active
            </Badge>
        )
    }
    // Filter and search logic
    const filteredInvestors = data?.data?.filter((investor) => {
        const matchesSearch =
            investor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            investor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            investor.id?.toString().includes(searchTerm)

        const matchesType = typeFilter === "all" || investor.type.toLowerCase() === typeFilter.toLowerCase()
        const matchesStatus = statusFilter === "all" || investor.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesType && matchesStatus
    })

    // Pagination logic
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentInvestors = filteredInvestors?.slice(startIndex, endIndex)
    const showingCount = Math.min(endIndex, filteredInvestors?.length)

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const renderPaginationButtons = () => {
        const buttons = []
        const maxVisiblePages = 5

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i)}
                    className={`w-8 h-8 p-0 ${currentPage === i ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    {i}
                </Button>,
            )
        }

        return buttons
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6  md:px-12 mx-auto py-6">
                <div className=" mx-auto space-y-6">
                    {/* Header */}
                    <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Graveyard Investors</h1>
                                <p className="text-gray-600 text-sm md:text-base mt-1">
                                    This section contains investors who have been disabled. They can no longer participate in investment
                                    cycles but their details are retained for reference.
                                </p>
                            </div>
                            {/* <div className="flex items-center gap-2 text-sm text-gray-600"> */}
                            {/* <Calendar className="h-4 w-4" /> */}
                            {/* <span className="font-medium">Select Cycle:</span> */}
                            {/* <Select value={dateRange} onValueChange={setDateRange}> */}
                            {/* <SelectTrigger className="w-[140px] h-8"> */}
                            {/* <SelectValue /> */}
                            {/* </SelectTrigger> */}
                            {/* <SelectContent> */}
                            {/* <SelectItem value="Feb 15 - Mar 31">Feb 15 - Mar 31</SelectItem> */}
                            {/* <SelectItem value="Jan 1 - Feb 14">Jan 1 - Feb 14</SelectItem> */}
                            {/* <SelectItem value="Mar 1 - Apr 15">Mar 1 - Apr 15</SelectItem> */}
                            {/* <SelectItem value="Apr 16 - May 31">Apr 16 - May 31</SelectItem> */}
                            {/* </SelectContent> */}
                            {/* </Select> */}
                            {/* </div> */}
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                {/* Search Bar */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search investors by name, email, or investment ID to quickly find specific entries"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {/* Search Button */}
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">Search</Button>

                                {/* Type Filter */}
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-full lg:w-[140px]">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="in-active">In-active</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Investors Table */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b">
                                            <TableHead className="text-left font-semibold text-gray-900 py-4 px-6">Name</TableHead>
                                            {/* <TableHead className="text-left font-semibold text-gray-900 py-4 px-6">Last Active Cycle</TableHead> */}
                                            {/* <TableHead className="text-left font-semibold text-gray-900 py-4 px-6">Status</TableHead> */}
                                            <TableHead className="text-left font-semibold text-gray-900 py-4 px-6">Investment</TableHead>
                                            <TableHead className="text-left font-semibold text-gray-900 py-4 px-6">Type</TableHead>
                                            <TableHead className="text-left font-semibold text-gray-900 py-4 px-6">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentInvestors && currentInvestors.length > 0 ? (
                                            currentInvestors.map((investor) => (
                                                <TableRow key={investor.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <TableCell className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-medium text-gray-900">{investor.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4 px-6 font-semibold text-gray-900">{investor.amount}</TableCell>
                                                    <TableCell className="py-4 px-6">{getTypeBadge(investor.type)}</TableCell>
                                                    <TableCell className="py-4 px-6">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                            onClick={() => handleViewDetail(investor)}
                                                        >
                                                            View detail
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                                    No investors available.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>

                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            Showing {Math.min(startIndex + 1, filteredInvestors?.length)} to {showingCount} from {totalItems} data
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 text-gray-600 hover:bg-gray-100"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            <div className="flex items-center gap-1">{renderPaginationButtons()}</div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-1 text-gray-600 hover:bg-gray-100"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Investor Details</DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-3 text-sm">
                            <p><strong>Name:</strong> {selectedUser.name}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone || "N/A"}</p>
                            <p><strong>CNIC No:</strong> {selectedUser.cnic_no}</p>
                            <p><strong>Investment Amount:</strong> ${selectedUser.amount}</p>
                            <p><strong>Type:</strong> {selectedUser.type}</p>
                            <p><strong>Status:</strong> {selectedUser.status}</p>
                            <p><strong>Role:</strong> {selectedUser.role}</p>
                            {selectedUser.cnic_front && (
                                <div>
                                    <strong>CNIC Front:</strong>
                                    <img
                                        src={`${Media_BASE_URL}/${selectedUser.cnic_front}`}
                                        alt="CNIC Front"
                                        className="mt-1 rounded border max-w-full h-auto"
                                    />
                                </div>
                            )}
                            {selectedUser.cnic_back && (
                                <div>
                                    <strong>CNIC Back:</strong>
                                    <img
                                        src={`${Media_BASE_URL}/${selectedUser.cnic_back}`}
                                        alt="CNIC Back"
                                        className="mt-1 rounded border max-w-full h-auto"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </DashboardLayout>
    )
}
