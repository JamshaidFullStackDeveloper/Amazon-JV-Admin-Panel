"use client"

import { useEffect, useState } from "react"
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
import { useDispatch, useSelector } from "react-redux"
import { useLoader } from "@/context/LoaderContext"
import { useGlobalToast } from "@/context/ToastContext"
import { fetchData } from "@/redux/GetApiSlice/Index"
import { postData, resetPostStatus } from "@/redux/PostApiSlice/Index"

export default function Requests() {
    const dispatch = useDispatch()
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useGlobalToast();
    const [requests, setRequests] = useState()

    const [showRejectConfirm, setShowRejectConfirm] = useState(false);
    const [rejectingRequestId, setRejectingRequestId] = useState(null);
    const [approvedRequestId, setApprovedRequestId] = useState(null);

    const [showApproveConfirm, setShowApproveConfirm] = useState(false);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    const [selectedRequest, setSelectedRequest] = useState(null)
    const [viewRequest, setViewRequest] = useState(null)
    const [statusFilter, setStatusFilter] = useState("all-requests")
    const { data, } = useSelector((state) => state.api);
    const { postStatus, postError, postSuccessMessage, } = useSelector((state) => state.postApi);
    const AllRequest = data?.data?.requests;

    useEffect(() => {
        showLoader();
        dispatch(fetchData('/requests')).finally(hideLoader)
    }, [postStatus]);
    const handleApprove = (id) => {
        const payload = { status: "approved" }
        dispatch(postData({ endpoint: `/request/${approvedRequestId}`, payload })).unwrap();
    }
    useEffect(() => {
        if (postStatus === "succeeded") {
            dispatch(resetPostStatus());
            showToast(postSuccessMessage, "success");
            setShowRejectDialog(false);
            setShowApproveDialog(false);
        } else if (postStatus === "failed") {
            dispatch(resetPostStatus());
            showToast(postError, "error");
        }
    }, [postStatus])

    const handleReject = (id) => {
        setSelectedRequest(id)
        setShowRejectDialog(true)
    }

    const confirmReject = () => {
        const payload = { status: "rejected" }
        dispatch(postData({ endpoint: `/request/${selectedRequest}`, payload })).unwrap();
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
    const filteredRequests = AllRequest?.filter((request) => {
        if (statusFilter === "all-requests") return true
        return request.status.toLowerCase() === statusFilter.toLowerCase()
    })


    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 p-6  md:px-12 mx-auto py-6">
                <div className="  space-y-6">
                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Requests</h1>
                        <p className="text-gray-600">Manage all request information, sort, and take actions efficiently.</p>
                    </div>
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
                                    {/* <SelectItem value="pending">Pending</SelectItem> */}
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
                                            {/* <TableHead className="w-12">S.L</TableHead> */}
                                            <TableHead>Name</TableHead>
                                            <TableHead className="hidden sm:table-cell">Email</TableHead>
                                            <TableHead>Investment</TableHead>
                                            {/* <TableHead className="hidden md:table-cell">Type</TableHead> */}
                                            <TableHead className="hidden lg:table-cell">Request Date</TableHead>
                                            <TableHead>Request Type</TableHead>
                                            <TableHead >Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRequests?.map((request) => (
                                            <TableRow key={request.id}>
                                                {/* <TableCell className="font-medium">{request.id}</TableCell> */}
                                                <TableCell className="font-medium">{request.user.name}</TableCell>
                                                <TableCell className="hidden sm:table-cell text-gray-600">{request.user.email}</TableCell>
                                                <TableCell className="font-semibold">${request.amount}</TableCell>
                                                {/* <TableCell className="hidden md:table-cell">{getTypeBadge(request.type)}</TableCell> */}
                                                <TableCell className="hidden lg:table-cell text-gray-600">  {new Date(request.created_at).toLocaleDateString("en-GB")}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(request.request_type)}</TableCell>

                                                <TableCell >
                                                    <Select
                                                        value={request.status}
                                                        // onValueChange={setStatusFilter}
                                                        onValueChange={(value) => {
                                                            if (value === "approved") {
                                                                setSelectedRequest(request);
                                                                setApprovedRequestId(request.id)
                                                                setShowApproveDialog(true);
                                                            } else if (value === "rejected") {
                                                                setSelectedRequest(request.id);
                                                                setShowRejectDialog(true);
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="">
                                                            <SelectValue placeholder="Update Request" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="approved">Approved</SelectItem>
                                                            <SelectItem value="rejected">Rejected</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {filteredRequests?.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">No requests found for the selected filter.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* View Request Details Dialog */}
                <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Approve Withdrawal Request</DialogTitle>
                            <DialogDescription>
                                Review the investor's bank details and withdrawal summary before accepting the request. Please verify the information carefully.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedRequest && (
                            <div className="space-y-6">
                                {/* Investor Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold">Investor Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                                        <div className="font-medium text-gray-600">Investor Name</div>
                                        <div>{selectedRequest.user?.name}</div>
                                        <div className="font-medium text-gray-600">Email Address</div>
                                        <div>{selectedRequest.user?.email}</div>
                                        <div className="font-medium text-gray-600">Requested Date</div>
                                        <div>{selectedRequest.requestDate}</div>
                                        <div className="font-medium text-gray-600">Status</div>
                                        <div>{selectedRequest.status}</div>
                                    </CardContent>
                                </Card>

                                {/* Withdrawal Summary */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold">Withdrawal Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                                        <div className="font-medium text-gray-600">Withdrawal Type</div>
                                        <div>{selectedRequest.withdrawalType || 'Capital / ROI / Both'}</div>
                                        <div className="font-medium text-gray-600">Amount Requested</div>
                                        <div>${selectedRequest.amount}</div>
                                        <div className="font-medium text-gray-600">Investment Cycle</div>
                                        <div>{selectedRequest.investmentCycle || 'Jan 1 – Feb 15, 2025'}</div>
                                    </CardContent>
                                </Card>

                                {/* Bank Account Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold">Bank Account Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                                        <div className="font-medium text-gray-600">Bank Name</div>
                                        <div>{selectedRequest?.user_bank?.bank_name}</div>
                                        <div className="font-medium text-gray-600">Account Title</div>
                                        <div>{selectedRequest.accountTitle || selectedRequest.user_bank?.account_holder_name}</div>
                                        {/* <div className="font-medium text-gray-600">Account Number</div> */}
                                        {/* <div>{selectedRequest.accountNumber || 'PK12HABB00001234567890'}</div> */}
                                        <div className="font-medium text-gray-600">IBAN Number</div>
                                        <div>{selectedRequest?.user_bank?.iban || '1234 5678 9012 3456'}</div>
                                        <div className="font-medium text-gray-600">CNIC Number</div>
                                        <div>{selectedRequest?.user_bank?.cnic}</div>
                                        {/* <div className="font-medium text-gray-600">Country</div> */}
                                        {/* <div>{selectedRequest.country || 'Pakistan'}</div> */}
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="flex gap-4 justify-end pt-4 border-t">
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            handleReject(selectedRequest.id)
                                            setShowApproveDialog(false)
                                        }}
                                    >
                                        Reject Request
                                    </Button>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => {
                                            handleApprove(selectedRequest.id)
                                            setShowApproveDialog(false)
                                        }}
                                    >
                                        Approve Withdrawal
                                    </Button>
                                </div>
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
