"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Clock, XCircle, CheckCircle, RefreshCw, Eye, User, Mail, DollarSign, Calendar, Activity } from "lucide-react"
import DashboardLayout from "@/layouts/Layout"

const chartData = [
    { month: "Jan", requests: 45 },
    { month: "Feb", requests: 52 },
    { month: "Mar", requests: 48 },
    { month: "Apr", requests: 61 },
    { month: "May", requests: 55 },
    { month: "Jun", requests: 100 },
    { month: "Jul", requests: 42 },
    { month: "Aug", requests: 38 },
    { month: "Sep", requests: 35 },
    { month: "Oct", requests: 40 },
    { month: "Nov", requests: 45 },
    { month: "Dec", requests: 50 },
]

const requestsData = [
    {
        id: "01",
        name: "Liam Davis",
        email: "lbeech@msn.com",
        investment: "$10,500",
        type: "Active",
        requestDate: "20 Apr 2021",
        status: "Approved",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, New York, NY 10001",
        requestType: "Investment Request",
        description: "Request for investment in technology portfolio with focus on AI and machine learning companies.",
    },
    {
        id: "02",
        name: "James Martinez",
        email: "kludge@comcast.net",
        investment: "$5,000",
        type: "In-active",
        requestDate: "20 Apr 2021",
        status: "Pending",
        phone: "+1 (555) 234-5678",
        address: "456 Oak Ave, Los Angeles, CA 90210",
        requestType: "Withdrawal Request",
        description: "Request for partial withdrawal from existing investment portfolio for personal use.",
    },
    {
        id: "03",
        name: "Olivia Miller",
        email: "improv@comcast.net",
        investment: "$7,325",
        type: "Active",
        requestDate: "20 Apr 2021",
        status: "Rejected",
        phone: "+1 (555) 345-6789",
        address: "789 Pine St, Chicago, IL 60601",
        requestType: "Re-investment Request",
        description: "Request for re-investment of dividends into growth-focused mutual funds.",
    },
    {
        id: "04",
        name: "Ava Davis",
        email: "Jesse@comcast.net",
        investment: "$8,950",
        type: "Active",
        requestDate: "20 Apr 2021",
        status: "Pending",
        phone: "+1 (555) 456-7890",
        address: "321 Elm St, Houston, TX 77001",
        requestType: "Investment Request",
        description: "New investment request for diversified portfolio including bonds and equities.",
    },
    {
        id: "05",
        name: "Sophia Garcia",
        email: "Gator@yahoo.ca",
        investment: "$12,410",
        type: "Active",
        requestDate: "20 Apr 2021",
        status: "Approved",
        phone: "+1 (555) 567-8901",
        address: "654 Maple Dr, Miami, FL 33101",
        requestType: "Investment Request",
        description: "Large investment request for international market exposure and cryptocurrency allocation.",
    },
    {
        id: "06",
        name: "William Garcia",
        email: "Sethbrown@live.com",
        investment: "$1,430",
        type: "In-active",
        requestDate: "20 Apr 2021",
        status: "Pending",
        phone: "+1 (555) 678-9012",
        address: "987 Cedar Ln, Seattle, WA 98101",
        requestType: "Withdrawal Request",
        description: "Emergency withdrawal request for medical expenses and urgent financial needs.",
    },
    {
        id: "07",
        name: "Emma Miller",
        email: "Sean@sbcglobal.net",
        investment: "$1,500",
        type: "In-active",
        requestDate: "20 Apr 2021",
        status: "Pending",
        phone: "+1 (555) 789-0123",
        address: "147 Birch St, Boston, MA 02101",
        requestType: "Investment Request",
        description: "Small investment request for retirement planning and long-term savings goals.",
    },
]

export default function Requests() {
    const [requests, setRequests] = useState(requestsData)
    const [showRejectDialog, setShowRejectDialog] = useState(false)
    const [showViewDialog, setShowViewDialog] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [viewRequest, setViewRequest] = useState(null)
    const [statusFilter, setStatusFilter] = useState("all-requests")

    const handleApprove = (id) => {
        setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: "Approved" } : req)))
    }

    const handleReject = (id) => {
        setSelectedRequest(id)
        setShowRejectDialog(true)
    }

    const handleView = (request) => {
        setViewRequest(request)
        setShowViewDialog(true)
    }

    const confirmReject = () => {
        if (selectedRequest) {
            setRequests((prev) => prev.map((req) => (req.id === selectedRequest ? { ...req, status: "Rejected" } : req)))
        }
        setShowRejectDialog(false)
        setSelectedRequest(null)
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "Approved":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Approved</Badge>
            case "Pending":
                return <Badge variant="secondary">Pending</Badge>
            case "Rejected":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getTypeBadge = (type) => {
        return type === "Active" ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
        ) : (
            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">In-active</Badge>
        )
    }

    // Filter requests based on selected status
    const filteredRequests = requests.filter((request) => {
        if (statusFilter === "all-requests") return true
        return request.status.toLowerCase() === statusFilter.toLowerCase()
    })

    // Calculate stats based on current requests
    const stats = {
        pending: requests.filter((req) => req.status === "Pending").length,
        rejected: requests.filter((req) => req.status === "Rejected").length,
        approved: requests.filter((req) => req.status === "Approved").length,
        reinvest: requests.filter(
            (req) => req.requestType && (req.requestType.includes("Re-investment") || req.requestType.includes("Withdrawal")),
        ).length,
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6  md:px-12 mx-auto py-6">
                <div className="  space-y-6">
                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Requests</h1>
                        <p className="text-gray-600">Manage all request information, sort, and take actions efficiently.</p>
                    </div>

                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Newly Pending Requests</CardTitle>
                                <Clock className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.pending}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Rejected Requests</CardTitle>
                                <XCircle className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.rejected}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Approved Requests</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.approved}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Re-Invest or Withdrawal Requests</CardTitle>
                                <RefreshCw className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.reinvest}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart Section */}
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-semibold">Requests Received</CardTitle>
                                <CardDescription>Shows the percentage of requests received compared to the target.</CardDescription>
                            </div>
                            <Select defaultValue="last-6-months">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                                    <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                                    <SelectItem value="this-year">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-sm">
                                <div>
                                    <p className="text-gray-600">Total Requests:</p>
                                    <p className="font-semibold">265</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Target:</p>
                                    <p className="font-semibold">300</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Approved:</p>
                                    <p className="font-semibold text-green-600">{stats.approved}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Rejected:</p>
                                    <p className="font-semibold text-red-600">{stats.rejected}</p>
                                </div>
                            </div>
                            <ChartContainer
                                config={{
                                    requests: {
                                        label: "Requests",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                                className="h-[300px] w-full"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Requests Table */}
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-semibold">All Requests</CardTitle>
                                <CardDescription>
                                    Browse the complete list of all requests with detailed status and actions available.
                                </CardDescription>
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter requests" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all-requests">All Requests</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">S.L</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="hidden sm:table-cell">Email</TableHead>
                                            <TableHead>Investment</TableHead>
                                            <TableHead className="hidden md:table-cell">Type</TableHead>
                                            <TableHead className="hidden lg:table-cell">Request Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRequests.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell className="font-medium">{request.id}</TableCell>
                                                <TableCell className="font-medium">{request.name}</TableCell>
                                                <TableCell className="hidden sm:table-cell text-gray-600">{request.email}</TableCell>
                                                <TableCell className="font-semibold">{request.investment}</TableCell>
                                                <TableCell className="hidden md:table-cell">{getTypeBadge(request.type)}</TableCell>
                                                <TableCell className="hidden lg:table-cell text-gray-600">{request.requestDate}</TableCell>
                                                <TableCell>{getStatusBadge(request.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleView(request)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        {request.status === "Pending" && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
                                                                    onClick={() => handleApprove(request.id)}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="h-8"
                                                                    onClick={() => handleReject(request.id)}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {filteredRequests.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">No requests found for the selected filter.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* View Request Details Dialog */}
                <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Request Details
                            </DialogTitle>
                            <DialogDescription>Complete information about the selected request.</DialogDescription>
                        </DialogHeader>
                        {viewRequest && (
                            <div className="space-y-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Full Name</p>
                                                <p className="font-medium">{viewRequest.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Email Address</p>
                                                <p className="font-medium">{viewRequest.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Activity className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phone Number</p>
                                                <p className="font-medium">{viewRequest.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Request Date</p>
                                                <p className="font-medium">{viewRequest.requestDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Activity className="h-4 w-4 text-gray-500 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="font-medium">{viewRequest.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Request Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Request Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Investment Amount</p>
                                                <p className="font-medium text-lg">{viewRequest.investment}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Activity className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Account Type</p>
                                                <div>{getTypeBadge(viewRequest.type)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Activity className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Request Type</p>
                                                <p className="font-medium">{viewRequest.requestType}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Activity className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Current Status</p>
                                                <div>{getStatusBadge(viewRequest.status)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Request Description</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700 leading-relaxed">{viewRequest.description}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {viewRequest.status === "Pending" && (
                                    <div className="flex gap-3 pt-4 border-t">
                                        <Button
                                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                                            onClick={() => {
                                                handleApprove(viewRequest.id)
                                                setShowViewDialog(false)
                                            }}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve Request
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => {
                                                setShowViewDialog(false)
                                                handleReject(viewRequest.id)
                                            }}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Reject Request
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Reject Confirmation Dialog */}
                <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Reject Request</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to reject this request? This action cannot be undone and the user will be notified
                                of the rejection.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmReject} className="bg-red-600 hover:bg-red-700">
                                Reject Request
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardLayout>
    )
}
