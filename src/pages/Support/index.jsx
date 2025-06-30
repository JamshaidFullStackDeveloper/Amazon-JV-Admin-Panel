"use client"

// import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User, Paperclip, Send, X, Download, Eye, Plus, Loader2 } from "lucide-react"
import DashboardLayout from "@/layouts/Layout"
import { useDispatch, useSelector } from "react-redux"
import { useGlobalToast } from "@/context/ToastContext"
import { useLoader } from "@/context/LoaderContext"
import { fetchData, resetFetchedData } from "@/redux/GetApiSlice/Index"
import { postData, resetPostStatus } from "@/redux/PostApiSlice/Index"
import { Media_BASE_URL } from "@/utils/media_Base_URL"
import formatToLocalDateTime from "@/utils/FormatCreated_atTime"
// import type { SupportTicket, SupportMessage } from "../types/support"

// Mock data
const mockTickets = [
    {
        id: "1",
        subject: "Payment Not Received",
        status: "open",
        createdAt: "02 Jun 2024",
        updatedAt: "12:30 01:00 PM",
        messages: [
            {
                id: "1",
                content:
                    "Post lorem ipsum served the same purpose for written content as stock photos do now. Post lorem ipsum served.",
                sender: "user",
                timestamp: "12:30 01:00 PM",
                attachments: [
                    {
                        id: "1",
                        name: "payment-screenshot.png",
                        url: "/images/dashboard.png",
                        type: "image/png",
                        size: 245760,
                    },
                ],
            },
        ],
    },
    {
        id: "2",
        subject: "Payment Not Received",
        status: "closed",
        createdAt: "02 Jun 2024",
        updatedAt: "01:00 PM",
        messages: [
            {
                id: "2",
                content:
                    "Post lorem ipsum served the same purpose for written content as stock photos do now. Post lorem ipsum served.",
                sender: "user",
                timestamp: "01:00 PM",
            },
            {
                id: "3",
                content: "Thank you for contacting us. We have resolved your payment issue and processed your refund.",
                sender: "admin",
                timestamp: "01:00 PM",
            },
        ],
    },
    {
        id: "3",
        subject: "Payment Not Received",
        status: "open",
        createdAt: "03 Jun 2024",
        updatedAt: " 01:00 PM",
        messages: [
            {
                id: "4",
                content:
                    "Post lorem ipsum served the same purpose for written content as stock photos do now. Post lorem ipsum served.",
                sender: "user",
                timestamp: " 01:00 PM",
            },
        ],
    },
]


export default function SupportTicketSystem() {
    const dispatch = useDispatch()
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useGlobalToast();
    const [tickets, setTickets] = useState(mockTickets)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [replyContent, setReplyContent] = useState("")
    const [attachments, setAttachments] = useState([])
    const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
    const [previewFile, setPreviewFile] = useState(null)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const { postStatus, postError, postSuccessMessage } = useSelector((state) => state.postApi);
    const { data, error, successMessage } = useSelector((state) => state.api);
    const SupportData = Array.isArray(data?.data) ? data.data : [];
    // console.log(SupportData);

    useEffect(() => {
        // if (postStatus === "succeeded") {
        showLoader();
        dispatch(resetFetchedData())
        dispatch(fetchData(`/tickets`)).finally(hideLoader);
        // }
    }, [dispatch, postSuccessMessage]);

    useEffect(() => {
        if (postStatus === "succeeded") {
            dispatch(resetPostStatus());
            showToast(postSuccessMessage, "success");
            setReplyContent("");
            setAttachments([]);
            setIsReplyDialogOpen(false);
        } else if (postStatus === "failed") {
            dispatch(resetPostStatus());
            showToast(postError, "error");
        }
    }, [postStatus])
    const closeTicket = (ticketId) => {

        dispatch(postData({
            endpoint: `/admin/tickets/${ticketId}/close`,
        }));
        // setTickets((prev) =>
        //     prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: "closed" } : ticket))
        // )
    }

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files || [])
        setAttachments((prev) => [...prev, ...files])
    }

    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index))
    }

    const sendReply = () => {
        if (!selectedTicket || !replyContent.trim()) return;

        // const data = new FormData();
        // data.append('message', replyContent);
        // attachments?.forEach((file, index) => {
        //     data.append('attachments[]', file);
        // });
        const formData = new FormData();
        formData.append("message", replyContent);

        attachments.forEach((file) => {
            formData.append("attachments[]", file);
        });


        // console.log(formData);
        // return
        dispatch(postData({
            endpoint: `/admin/tickets/${selectedTicket.id}/reply`,
            payload: formData,
        }));

        // Reset state after sending

    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    // Get the full URL for file access
    const getFileUrl = (attachment) => {
        // If it's a temporary file (newly uploaded), use the temp URL
        if (attachment._tempUrl) {
            return attachment._tempUrl
        }
        // For files from API, construct the full URL
        return `${Media_BASE_URL}/${attachment.file_path}`
    }

    // Get file type from file path or original name
    const getFileType = (attachment) => {
        const fileName = attachment.original_name || attachment.file_path
        const extension = fileName.split(".").pop().toLowerCase()

        const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"]
        const pdfExtensions = ["pdf"]
        const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm"]
        const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac"]

        if (imageExtensions.includes(extension)) return `image/${extension}`
        if (pdfExtensions.includes(extension)) return "application/pdf"
        if (videoExtensions.includes(extension)) return `video/${extension}`
        if (audioExtensions.includes(extension)) return `audio/${extension}`

        return "application/octet-stream"
    }

    const handlePreviewFile = (attachment) => {
        const fileUrl = getFileUrl(attachment)
        const fileType = getFileType(attachment)

        setPreviewFile({
            name: attachment.original_name,
            url: fileUrl,
            type: fileType,
            attachment: attachment,
        })
        setIsPreviewOpen(true)
    }

    const handleDownloadFile = async (attachment) => {
        try {
            const fileUrl = getFileUrl(attachment)

            // For API files, we might need to fetch with proper headers
            const response = await fetch(fileUrl, {
                method: "GET",
                headers: {
                    // Add any required headers like Authorization if needed
                    // 'Authorization': `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error("Download failed")
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)

            const link = document.createElement("a")
            link.href = url
            link.download = attachment.original_name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up the blob URL
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Download failed:", error)
            // Fallback: try direct link
            const link = document.createElement("a")
            link.href = getFileUrl(attachment)
            link.download = attachment.original_name
            link.target = "_blank"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const getFileIcon = (type) => {
        if (type.startsWith("image/")) return "🖼️"
        if (type.includes("pdf")) return "📄"
        if (type.includes("word") || type.includes("doc")) return "📝"
        if (type.includes("excel") || type.includes("sheet")) return "📊"
        if (type.includes("powerpoint") || type.includes("presentation")) return "📋"
        if (type.includes("video/")) return "🎥"
        if (type.includes("audio/")) return "🎵"
        return "📎"
    }

    const renderFilePreview = () => {
        if (!previewFile) return null

        const { name, url, type } = previewFile

        if (type?.startsWith("image/")) {
            return (
                <div className="flex flex-col items-center space-y-4">
                    <img
                        src={url || "/placeholder.svg"}
                        alt={name}
                        className="max-w-full max-h-[60vh] object-contain rounded-lg"
                        crossOrigin="anonymous"
                        onError={(e) => {
                            console.error("Image failed to load:", url)
                            e.target.src = "/placeholder.svg?height=400&width=400"
                        }}
                    />
                    <p className="text-sm text-muted-foreground">{name}</p>
                </div>
            )
        }

        if (type.includes("pdf")) {
            return (
                <div className="flex flex-col items-center space-y-4">
                    <iframe
                        src={url}
                        className="w-full h-[60vh] border rounded-lg"
                        title={name}
                        onError={() => {
                            console.error("PDF failed to load:", url)
                        }}
                    />
                    <p className="text-sm text-muted-foreground">{name}</p>
                </div>
            )
        }

        if (type.startsWith("video/")) {
            return (
                <div className="flex flex-col items-center space-y-4">
                    <video controls className="max-w-full max-h-[60vh] rounded-lg" crossOrigin="anonymous">
                        <source src={url} type={type} />
                        Your browser does not support the video tag.
                    </video>
                    <p className="text-sm text-muted-foreground">{name}</p>
                </div>
            )
        }

        if (type.startsWith("audio/")) {
            return (
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-md">
                        <audio controls className="w-full" crossOrigin="anonymous">
                            <source src={url} type={type} />
                            Your browser does not support the audio tag.
                        </audio>
                    </div>
                    <p className="text-sm text-muted-foreground">{name}</p>
                </div>
            )
        }

        // For other file types, show a preview card
        return (
            <div className="flex flex-col items-center space-y-4">
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-4xl mb-2">{getFileIcon(type)}</div>
                    <p className="text-lg font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">Preview not available for this file type</p>
                    <Button onClick={() => handleDownloadFile(previewFile.attachment)} className="mt-4" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download File
                    </Button>
                </div>
            </div>
        )
    }



    const openTickets = SupportData?.filter((ticket) => ticket.status === "open")
    const closedTickets = SupportData?.filter((ticket) => ticket.status === "closed")

    return (
        <DashboardLayout>
            <div className=" mx-auto p-6 md:px-12 max-w-8xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Support Messages</h1>
                    <p className="text-muted-foreground">
                        View and manage all support messages submitted by investors. Respond, update status, and keep track of all
                        communications.
                    </p>
                </div>

                <Tabs defaultValue="messages" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                        <TabsTrigger value="history">Messages History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="messages" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">All Messages ({openTickets.length})</h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {openTickets.map((ticket) => {
                                const { date, time } = formatToLocalDateTime(ticket.updated_at);
                                return (
                                    <Card key={ticket.id} className="relative">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    {date}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    {time}
                                                </div>
                                            </div>
                                            <CardTitle className="text-lg">{ticket.title}</CardTitle>
                                            <Badge variant={ticket.status === "open" ? "default" : "secondary"} className="w-fit">
                                                {ticket.status}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground h-10">
                                                    {ticket.description.length > 50
                                                        ? `${ticket.description.slice(0, 50)}...`
                                                        : ticket.description}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button className="flex-1" onClick={() => setSelectedTicket(ticket)}>
                                                            Reply
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                                                        <DialogHeader>
                                                            <DialogTitle>Support Ticket - {ticket.title}</DialogTitle>
                                                            <DialogDescription>
                                                                <p>Ticket ID: {ticket.id} | Status: {ticket.status}</p>
                                                                <p>Description: {ticket.description}</p>
                                                            </DialogDescription>
                                                        </DialogHeader>

                                                        {/* Main content container */}
                                                        <div className="flex flex-col flex-grow overflow-hidden">
                                                            {/* Message History */}
                                                            <ScrollArea className="flex-grow pr-4 overflow-auto">
                                                                <div className="space-y-4">
                                                                    {ticket.messages.map((message) => {
                                                                        const { date, time } = formatToLocalDateTime(message.created_at);
                                                                        return (
                                                                            <div
                                                                                key={message.id}
                                                                                className={`flex ${message.sender_type === "admin" ? "justify-end" : "justify-start"}`}
                                                                            >
                                                                                <div
                                                                                    className={`max-w-xl rounded-lg p-4 ${message.sender_type === "admin" ? "bg-blue-500 text-white" : "bg-muted"
                                                                                        }`}
                                                                                >
                                                                                    <p className="text-sm mb-2">{message.message}</p>

                                                                                    {message.attachments?.length > 0 && (
                                                                                        <div className="space-y-2 mt-3">
                                                                                            {message.attachments.map((attachment) => (
                                                                                                <div
                                                                                                    key={attachment.id}
                                                                                                    className="flex items-center gap-2 p-2 bg-white/10 rounded"
                                                                                                >
                                                                                                    <Paperclip className="h-4 w-4" />
                                                                                                    <span className="text-xs flex-1">{attachment.original_name}</span>
                                                                                                    <div className="flex gap-1">
                                                                                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handlePreviewFile(attachment)}
                                                                                                            title="Preview file"
                                                                                                        >
                                                                                                            <Eye className="h-3 w-3" />
                                                                                                        </Button>
                                                                                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                                                                                                            onClick={() => handleDownloadFile(attachment)}
                                                                                                            title="Download file"
                                                                                                        >
                                                                                                            <Download className="h-3 w-3" />
                                                                                                        </Button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}

                                                                                    <div className="flex items-center justify-between mt-2 text-xs opacity-70 gap-4">
                                                                                        <span className="text-blue-600 font-bold text-md">{message.sender_type === "admin" ? "Admin" : "Investor"}</span>
                                                                                        <span>{date} {time}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </ScrollArea>

                                                            {/* Reply Section - Sticky Bottom */}
                                                            <div className="pt-4 mt-4 border-t">
                                                                <div className="flex space-x-4">
                                                                    {/* Left (80%) */}
                                                                    <div className="w-4/5 space-y-4">
                                                                        {attachments.length > 0 && (
                                                                            <div className="space-y-2">
                                                                                <Label>Attachments</Label>
                                                                                <div className="space-y-2">
                                                                                    {attachments.map((file, index) => (
                                                                                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                                                                                            <Paperclip className="h-4 w-4" />
                                                                                            <span className="flex-1">{file.name}</span>
                                                                                            <span className="text-xs text-muted-foreground">
                                                                                                {formatFileSize(file.size)}
                                                                                            </span>
                                                                                            <Button
                                                                                                size="sm"
                                                                                                variant="ghost"
                                                                                                onClick={() => removeAttachment(index)}
                                                                                                className="h-6 w-6 p-0"
                                                                                            >
                                                                                                <X className="h-3 w-3" />
                                                                                            </Button>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div className="relative">
                                                                            <div className="flex items-center gap-2 p-2 border rounded-lg bg-background">
                                                                                <div className="relative">
                                                                                    <Button
                                                                                        type="button"
                                                                                        size="sm"
                                                                                        variant="ghost"
                                                                                        className="h-8 w-8 p-0 rounded-full"
                                                                                        onClick={() => document.getElementById("file-input")?.click()}
                                                                                    >
                                                                                        <Plus className="h-4 w-4" />
                                                                                    </Button>
                                                                                    <Input
                                                                                        id="file-input"
                                                                                        type="file"
                                                                                        multiple
                                                                                        onChange={handleFileUpload}
                                                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                                                        style={{ width: "32px", height: "32px" }}
                                                                                    />
                                                                                </div>

                                                                                <Input
                                                                                    placeholder="Type a message"
                                                                                    value={replyContent}
                                                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                                                    className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                                                            e.preventDefault()
                                                                                            sendReply()
                                                                                        }
                                                                                    }}
                                                                                />

                                                                                <Button
                                                                                    onClick={sendReply}
                                                                                    size="sm"
                                                                                    className="h-8 w-8 p-0 rounded-full"
                                                                                    disabled={!replyContent.trim() || postStatus === "loading"}
                                                                                >
                                                                                    <Send className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Right (20%) */}
                                                                    <div className="w-1/5 flex items-end">
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={() => closeTicket(ticket.id)}
                                                                            className="w-full"

                                                                        >{postStatus == "loading" ? (
                                                                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                                                        ) : (
                                                                            "Close Ticket"
                                                                        )}

                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogContent>

                                                </Dialog>

                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={postStatus == "loading"} // disable when loading
                                                    onClick={() => closeTicket(ticket.id)}
                                                >
                                                    {postStatus == "loading" ? (
                                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                                    ) : (
                                                        "Close"
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            }
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Closed Messages ({closedTickets.length})</h2>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {closedTickets.map((ticket) => {
                                const { date, time } = formatToLocalDateTime(ticket.updated_at);
                                return (
                                    <Card key={ticket.id} className="relative opacity-75">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    {date}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    {time}
                                                </div>
                                            </div>
                                            <CardTitle className="text-lg">{ticket.title}</CardTitle>
                                            <Badge variant="secondary" className="w-fit">
                                                {ticket.status}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground h-10">
                                                    {ticket.description.length > 50
                                                        ? `${ticket.description.slice(0, 50)}...`
                                                        : ticket.description}
                                                </p>
                                            </div>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="w-full">
                                                        View History
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-3xl max-h-[80vh]">
                                                    <DialogHeader>
                                                        <DialogTitle>Support Ticket History - {ticket.title}</DialogTitle>
                                                        <DialogDescription>
                                                            <p> Ticket ID: {ticket.id} | Status: {ticket.status} (Read Only)</p>
                                                            <p>Description: {ticket.description}</p>
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <ScrollArea className="h-[60vh] pr-4">
                                                        <div className="space-y-4">
                                                            {ticket.messages.map((message) => {
                                                                const { date, time } = formatToLocalDateTime(message.created_at);
                                                                return (<div
                                                                    key={message.id}
                                                                    className={`flex ${message.sender_type === "admin" ? "justify-end" : "justify-start"}`}
                                                                >
                                                                    <div
                                                                        className={`max-w-[80%] rounded-lg p-4 ${message.sender_type === "admin" ? "bg-blue-500 text-white" : "bg-muted"
                                                                            }`}
                                                                    >
                                                                        <p className="text-sm mb-2">{message.message}</p>

                                                                        {message.attachments?.length > 0 && (
                                                                            <div className="space-y-2 mt-3">
                                                                                {message.attachments.map((attachment) => {

                                                                                    return (
                                                                                        <div
                                                                                            key={attachment.id}
                                                                                            className="flex items-center gap-2 p-2 bg-white/10 rounded"
                                                                                        >
                                                                                            <Paperclip className="h-4 w-4" />
                                                                                            <span className="text-xs flex-1">{attachment.original_name}</span>
                                                                                            <div className="flex gap-1">
                                                                                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handlePreviewFile(attachment)}
                                                                                                    title="Preview file"
                                                                                                >
                                                                                                    <Eye className="h-3 w-3" />
                                                                                                </Button>
                                                                                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                                                                                                    onClick={() => handleDownloadFile(attachment)}
                                                                                                    title="Download file"
                                                                                                >
                                                                                                    <Download className="h-3 w-3" />
                                                                                                </Button>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        )}

                                                                        <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                                                                            <span>{message.sender_type === "admin" ? "Admin" : "User"}</span>
                                                                            <span>{date} {time}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </ScrollArea>
                                                </DialogContent>
                                            </Dialog>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* File Preview Dialog */}
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <span>{getFileIcon(previewFile?.type || "")}</span>
                                File Preview
                            </DialogTitle>
                            <DialogDescription>{previewFile?.name}</DialogDescription>
                        </DialogHeader>

                        <div className="overflow-auto max-h-[70vh]">{renderFilePreview()}</div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => previewFile && handleDownloadFile(previewFile.attachment)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                            <Button onClick={() => setIsPreviewOpen(false)}>Close</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}
