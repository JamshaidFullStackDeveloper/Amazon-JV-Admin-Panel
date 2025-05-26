"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Mail, Phone, Calendar, DollarSign, TrendingUp, Clock } from "lucide-react"

export function InvestorDetailModal({ isOpen, onClose, investor }) {
    if (!investor) return null

    // Sample additional investor details
    const investorDetails = {
        email: "investor@example.com",
        phone: "+1 (555) 123-4567",
        joinDate: "Jan 15, 2023",
        totalInvested: investor.investment,
        returns: Math.round(investor.investment * 0.12), // Sample 12% return
        nextPayment: "Jun 30, 2023",
        recentActivity: [
            { date: "May 15, 2023", action: "Investment added", amount: "$2,500" },
            { date: "Apr 10, 2023", action: "Withdrawal requested", amount: "$1,000" },
            { date: "Mar 5, 2023", action: "Investment added", amount: "$3,000" },
        ],
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Investor Details</DialogTitle>
                    <DialogDescription>View detailed information about this investor.</DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                    {/* Investor Profile */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={investor.avatar || "/placeholder.svg"} alt={investor.name} />
                            <AvatarFallback className="text-lg">{investor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-bold">{investor.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                    variant="secondary"
                                    className={`${investor.status === "Active" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {investor.status}
                                </Badge>
                                <span
                                    className={`text-sm ${investor.withdrawalStatus === "Withdraw"
                                        ? "text-blue-500"
                                        : investor.withdrawalStatus === "Requested"
                                            ? "text-red-500"
                                            : "text-gray-500"
                                        }`}
                                >
                                    {investor.withdrawalStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{investorDetails.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{investorDetails.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>Joined: {investorDetails.joinDate}</span>
                        </div>
                    </div>

                    {/* Investment Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4">
                            <div className="flex items-center space-x-2 text-gray-500 mb-1">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm">Total Invested</span>
                            </div>
                            <p className="text-2xl font-bold">${investorDetails.totalInvested.toLocaleString()}</p>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center space-x-2 text-gray-500 mb-1">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm">Total Returns</span>
                            </div>
                            <p className="text-2xl font-bold">${investorDetails.returns.toLocaleString()}</p>
                        </Card>
                        <Card className="p-4">
                            <div className="flex items-center space-x-2 text-gray-500 mb-1">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">Next Payment</span>
                            </div>
                            <p className="text-2xl font-bold">{investorDetails.nextPayment}</p>
                        </Card>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <h4 className="text-lg font-semibold mb-3">Recent Activity</h4>
                        <div className="space-y-3">
                            {investorDetails.recentActivity.map((activity, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{activity.action}</p>
                                        <p className="text-sm text-gray-500">{activity.date}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">{activity.amount}</span>
                                        <ArrowUpRight className="h-4 w-4 text-gray-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
