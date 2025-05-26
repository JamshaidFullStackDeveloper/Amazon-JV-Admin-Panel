"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Filter, AlertTriangle, TrendingUp, CheckCircle, DollarSign, Bell } from "lucide-react"

const notificationsData = [
    {
        id: 1,
        type: "investment_approved",
        title: "Investment request approved!",
        description:
            "New vehicle submitted for approval. Your investment request of $5,000 has been successfully approved.",
        timestamp: "2 mins ago",
        isRead: false,
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        amount: "$5,000",
    },
    {
        id: 2,
        type: "roi_received",
        title: "You've received 12% ROI on cycle (Jan-Feb)!",
        description: "Congratulations! You've earned $5,000 ROI from your last cycle.",
        timestamp: "1 hour ago",
        isRead: false,
        icon: TrendingUp,
        iconColor: "text-green-600",
        amount: "$5,000",
    },
    {
        id: 3,
        type: "investment_approved",
        title: "Investment request approved!",
        description:
            "New vehicle submitted for approval. Your investment request of $5,000 has been successfully approved.",
        timestamp: "2 hours ago",
        isRead: false,
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        amount: "$5,000",
    },
    {
        id: 4,
        type: "investment_approved",
        title: "Investment request approved!",
        description:
            "New vehicle submitted for approval. Your investment request of $5,000 has been successfully approved.",
        timestamp: "1 day ago",
        isRead: true,
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        amount: "$5,000",
    },
    {
        id: 5,
        type: "payment_completed",
        title: "Payment processed successfully!",
        description: "Your withdrawal request of $3,200 has been processed and transferred to your account.",
        timestamp: "2 days ago",
        isRead: true,
        icon: CheckCircle,
        iconColor: "text-green-600",
        amount: "$3,200",
    },
    {
        id: 6,
        type: "roi_received",
        title: "Monthly ROI credited!",
        description: "You've received 8% ROI for the month of December. Amount credited to your account.",
        timestamp: "3 days ago",
        isRead: true,
        icon: DollarSign,
        iconColor: "text-blue-600",
        amount: "$2,400",
    },
    {
        id: 7,
        type: "investment_approved",
        title: "Investment request approved!",
        description:
            "New vehicle submitted for approval. Your investment request of $8,000 has been successfully approved.",
        timestamp: "5 days ago",
        isRead: true,
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        amount: "$8,000",
    },
]

export default function NotificationPanel({ isOpen, onClose }) {
    const [activeFilter, setActiveFilter] = useState("all")

    const filteredNotifications = notificationsData.filter((notification) => {
        if (activeFilter === "unread") {
            return !notification.isRead
        }
        return true
    })

    const groupNotificationsByTime = (notifications) => {
        const groups = {
            new: [],
            earlier: [],
        }

        notifications.forEach((notification) => {
            // For demo purposes, we'll use the timestamp text to determine grouping
            if (notification.timestamp.includes("min") || notification.timestamp.includes("hour")) {
                groups.new.push(notification)
            } else {
                groups.earlier.push(notification)
            }
        })

        return groups
    }

    const groupedNotifications = groupNotificationsByTime(filteredNotifications)
    const unreadCount = notificationsData.filter((n) => !n.isRead).length

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[60]" onClick={onClose} />

            {/* Notification Panel */}
            <div className="fixed right-0 top-24 h-full  w-full max-w-md bg-white shadow-xl z-[70] transform transition-transform duration-300 ease-in-out rounded-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                        {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount}</Badge>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`p-0 h-auto font-medium ${activeFilter === "unread"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                            onClick={() => setActiveFilter("unread")}
                        >
                            Unread
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`p-0 h-auto font-medium ${activeFilter === "all"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                            onClick={() => setActiveFilter("all")}
                        >
                            All
                        </Button>
                    </div>
                    {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0"> */}
                    {/* <Filter className="h-4 w-4" /> */}
                    {/* </Button> */}
                </div>

                {/* Notifications List */}
                <ScrollArea className="flex-1 h-[calc(85vh-120px)]">
                    <div className="p-4 space-y-6">
                        {/* New Notifications */}
                        {groupedNotifications.new.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-blue-600 mb-3">New</h3>
                                <div className="space-y-4">
                                    {groupedNotifications.new.map((notification) => {
                                        const IconComponent = notification.icon
                                        return (
                                            <div
                                                key={notification.id}
                                                className={`p-3 rounded-lg border transition-colors hover:bg-gray-50 cursor-pointer ${!notification.isRead ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-full bg-yellow-100 ${notification.iconColor}`}>
                                                        <IconComponent className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                                                            {!notification.isRead && (
                                                                <div className="h-2 w-2 bg-blue-600 rounded-full ml-2 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mb-2">{notification.timestamp}</p>
                                                        <p className="text-sm text-gray-600 leading-relaxed">{notification.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Earlier Notifications */}
                        {groupedNotifications.earlier.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-3">Earlier</h3>
                                <div className="space-y-4">
                                    {groupedNotifications.earlier.map((notification) => {
                                        const IconComponent = notification.icon
                                        return (
                                            <div
                                                key={notification.id}
                                                className={`p-3 rounded-lg border transition-colors hover:bg-gray-50 cursor-pointer ${!notification.isRead ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-full bg-gray-100 ${notification.iconColor}`}>
                                                        <IconComponent className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                                                            {!notification.isRead && (
                                                                <div className="h-2 w-2 bg-blue-600 rounded-full ml-2 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mb-2">{notification.timestamp}</p>
                                                        <p className="text-sm text-gray-600 leading-relaxed">{notification.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {filteredNotifications.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-400 mb-2">
                                    <Bell className="h-12 w-12 mx-auto" />
                                </div>
                                <h3 className="text-sm font-medium text-gray-900 mb-1">No notifications</h3>
                                <p className="text-sm text-gray-500">
                                    {activeFilter === "unread" ? "No unread notifications" : "You're all caught up!"}
                                </p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </>
    )
}
