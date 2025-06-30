"use client"

import { Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function InvestorTable({
    investors,
    onEdit,
    onDelete,
    onViewDetail,
    getStatusBadgeVariant,
    getTypeBadgeVariant,
}) {
    return (
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-medium text-gray-700">Name</TableHead>
                        <TableHead className="font-medium text-gray-700">Email</TableHead>
                        <TableHead className="font-medium text-gray-700">Investment</TableHead>
                        <TableHead className="font-medium text-gray-700">Type</TableHead>
                        {/* <TableHead className="font-medium text-gray-700">Status</TableHead> */}
                        <TableHead className="font-medium text-gray-700">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {investors?.length > 0 ? (
                        investors?.map((investor) => (
                            <TableRow key={investor.id} className="hover:bg-gray-50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={investor.avatar || "/placeholder.svg"} alt={investor.name} />
                                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                                {investor.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-gray-900">{investor.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-600">{investor.email}</TableCell>
                                <TableCell className="font-medium text-gray-900">${investor.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={getTypeBadgeVariant(investor.type)}
                                        className={
                                            investor.type === "Active"
                                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                        }
                                    >
                                        {investor.type}
                                    </Badge>
                                </TableCell>
                                {/* <TableCell> */}
                                {/* <Badge */}
                                {/* variant={getStatusBadgeVariant(investor.status)} */}
                                {/* className={ */}
                                {/* investor.status === "Withdraw" */}
                                {/* ? "bg-blue-100 text-blue-800" */}
                                {/* : investor.status === "Pending" */}
                                {/* ? "bg-gray-100 text-gray-800" */}
                                {/* : "bg-red-100 text-red-800" */}
                                {/* } */}
                                {/* > */}
                                {/* {investor.status} */}
                                {/* </Badge> */}
                                {/* </TableCell> */}
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {/* <Button */}
                                        {/* variant="ghost" */}
                                        {/* size="sm" */}
                                        {/* onClick={() => onDelete(investor.id, investor.name)} */}
                                        {/* className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1" */}
                                        {/* > */}
                                        {/* <Trash2 className="w-4 h-4" /> */}
                                        {/* </Button> */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(investor.id)}
                                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 p-1"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewDetail(investor.id)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span className="ml-1 text-xs">View detail</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                No investors found matching your criteria.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
