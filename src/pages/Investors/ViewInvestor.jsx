"use client"

import { X, Edit, User, Mail, DollarSign, Calendar, Phone, MapPin, CreditCard, Download, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Media_BASE_URL } from "@/utils/media_Base_URL"
import { TransactionDetails } from "./ViewTransection"

export default function ViewDetailsModal({
    isOpen,
    onClose,
    investor,
    onEdit,
    onImageClick,
    getStatusBadgeVariant,
    getTypeBadgeVariant,
}) {
    // console.log(isOpen);

    if (!investor) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        Investor Details
                        {/* <Button variant="ghost" size="sm" onClick={onClose}> */}
                        {/* <X className="w-4 h-4" /> */}
                        {/* </Button> */}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={investor.avatar || "/placeholder.svg"} alt={investor.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                                {investor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{investor.name}</h2>
                            <p className="text-gray-600 text-lg">{investor.email}</p>
                            <div className="flex items-center gap-4 mt-3">
                                {/* <Badge */}
                                {/* variant={getTypeBadgeVariant(investor.type)} */}
                                {/* className={investor.type === "Active" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"} */}
                                {/* > */}
                                {/* {investor.type} */}
                                {/* </Badge> */}
                                <Badge
                                    variant={getStatusBadgeVariant(investor.type)}
                                    className={
                                        investor.type === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }
                                >
                                    {investor.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>

                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <User className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Full Name</p>
                                    <p className="font-medium text-gray-900">{investor.name}</p>
                                </div>
                            </div>

                            {/* <div className="flex items-center gap-3 p-3 border rounded-lg"> */}
                            {/* <Calendar className="w-5 h-5 text-green-600" /> */}
                            {/* <div> */}
                            {/* <p className="text-sm text-gray-600">Date of Birth</p> */}
                            {/* <p className="font-medium text-gray-900"> */}
                            {/* {investor.dateOfBirth ? new Date(investor.dateOfBirth).toLocaleDateString() : "N/A"} */}
                            {/* </p> */}
                            {/* </div> */}
                            {/* </div> */}

                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <CreditCard className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm text-gray-600">CNIC Number</p>
                                    <p className="font-medium text-gray-900">{investor.cnic_no || "N/A"}</p>
                                </div>
                            </div>
                            {/*  */}
                            {/* <div className="flex items-center gap-3 p-3 border rounded-lg"> */}
                            {/* <User className="w-5 h-5 text-indigo-600" /> */}
                            {/* <div> */}
                            {/* <p className="text-sm text-gray-600">Nationality</p> */}
                            {/* <p className="font-medium text-gray-900">{investor.nationality || "N/A"}</p> */}
                            {/* </div> */}
                            {/* </div> */}
                            {/*  */}
                            {/* <div className="flex items-center gap-3 p-3 border rounded-lg"> */}
                            {/* <User className="w-5 h-5 text-orange-600" /> */}
                            {/* <div> */}
                            {/* <p className="text-sm text-gray-600">Occupation</p> */}
                            {/* <p className="font-medium text-gray-900">{investor.occupation || "N/A"}</p> */}
                            {/* </div> */}
                            {/* </div> */}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>

                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Email Address</p>
                                    <p className="font-medium text-gray-900">{investor.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <Phone className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Phone Number</p>
                                    <p className="font-medium text-gray-900">{investor.phone || "N/A"}</p>
                                </div>
                            </div>

                            {/* <div className="flex items-start gap-3 p-3 border rounded-lg"> */}
                            {/* <MapPin className="w-5 h-5 text-red-600 mt-1" /> */}
                            {/* <div> */}
                            {/* <p className="text-sm text-gray-600">Address</p> */}
                            {/* <p className="font-medium text-gray-900">{investor.address || "N/A"}</p> */}
                            {/* </div> */}
                            {/* </div> */}
                            {/*  */}
                            {/* <div className="flex items-center gap-3 p-3 border rounded-lg"> */}
                            {/* <Phone className="w-5 h-5 text-purple-600" /> */}
                            {/* <div> */}
                            {/* <p className="text-sm text-gray-600">Emergency Contact</p> */}
                            {/* <p className="font-medium text-gray-900">{investor.emergencyContact || "N/A"}</p> */}
                            {/* </div> */}
                            {/* </div> */}
                        </div>
                    </div>

                    {/* Investment Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Investment Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    <p className="text-sm text-green-700">Current Investment</p>
                                </div>
                                <p className="text-2xl font-bold text-green-800">${investor.amount.toLocaleString()}</p>
                            </div>

                            {/* <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg"> */}
                            {/* <div className="flex items-center gap-2"> */}
                            {/* <DollarSign className="w-5 h-5 text-blue-600" /> */}
                            {/* <p className="text-sm text-blue-700">Average Investment</p> */}
                            {/* </div> */}
                            {/* <p className="text-2xl font-bold text-blue-800"> */}
                            {/* ${investor.averageInvestment ? investor.averageInvestment.toLocaleString() : "0"} */}
                            {/* </p> */}
                            {/* </div> */}
                            {/*  */}
                            {/* <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg"> */}
                            {/* <div className="flex items-center gap-2"> */}
                            {/* <Calendar className="w-5 h-5 text-purple-600" /> */}
                            {/* <p className="text-sm text-purple-700">Total Transactions</p> */}
                            {/* </div> */}
                            {/* <p className="text-2xl font-bold text-purple-800">{investor.totalTransactions || 0}</p> */}
                            {/* </div> */}

                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-orange-600" />
                                    <p className="text-sm text-orange-700">Joining Date</p>
                                </div>
                                <p className="text-lg font-bold text-orange-800">
                                    {investor.created_at ? new Date(investor.created_at).toLocaleDateString() : "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"> */}
                        {/* <div className="p-3 border rounded-lg"> */}
                        {/* <p className="text-sm text-gray-600">Investment Goal</p> */}
                        {/* <p className="font-medium text-gray-900">{investor.investmentGoal || "N/A"}</p> */}
                        {/* </div> */}
                        {/* <div className="p-3 border rounded-lg"> */}
                        {/* <p className="text-sm text-gray-600">Risk Tolerance</p> */}
                        {/* <p className="font-medium text-gray-900">{investor.riskTolerance || "N/A"}</p> */}
                        {/* </div> */}
                        {/* <div className="p-3 border rounded-lg"> */}
                        {/* <p className="text-sm text-gray-600">Bank Account</p> */}
                        {/* <p className="font-medium text-gray-900">{investor.bankAccount || "N/A"}</p> */}
                        {/* </div> */}
                        {/* </div> */}
                    </div>

                    {/* CNIC Images */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">CNIC Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">CNIC Front</Label>
                                <div
                                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => onImageClick(investor.cnic_front, "CNIC Front")}
                                >
                                    <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                        <img
                                            src={`${Media_BASE_URL}/${investor.cnic_front}`}
                                            alt="CNIC Front"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                    <p className="text-center text-sm text-gray-600 mt-2">Click to view full size</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">CNIC Back</Label>
                                <div
                                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => onImageClick(investor.cnic_back, "CNIC Back")}
                                >
                                    <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                        <img
                                            src={`${Media_BASE_URL}/${investor.cnic_back}`}
                                            alt="CNIC Back"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                    <p className="text-center text-sm text-gray-600 mt-2">Click to view full size</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {onEdit &&
                        <div>
                            <h1 className="text-xl font-semibold mb-2">Transaction Details </h1>
                            <TransactionDetails data={investor} />
                        </div>}
                    {/* Attachments */}
                    {/* {investor.attachments && investor.attachments.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Attachments</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {investor.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-gray-900">{attachment.name}</p>
                                                <p className="text-sm text-gray-600">{attachment.size}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* Notes */}
                    {/* {investor.notes && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Notes</h3>
                            <div className="p-4 bg-gray-50 border rounded-lg">
                                <p className="text-gray-700">{investor.notes}</p>
                            </div>
                        </div>
                    )} */}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">

                        {onEdit && <Button variant="outline" onClick={() => onEdit(investor.id)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Investor
                        </Button>}
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
