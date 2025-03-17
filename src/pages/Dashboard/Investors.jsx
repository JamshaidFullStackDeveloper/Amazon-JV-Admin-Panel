import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const investors = [
    { name: "Smith Johnson", amount: "$10,500", status: "Active", img: "/avatars/smith.jpg" },
    { name: "Timothy Russell", amount: "$3,250", status: "In-active", img: "/avatars/timothy.jpg" },
    { name: "Lucas Willie", amount: "$8,750", status: "Active", img: "/avatars/lucas.jpg" },
    { name: "Mason Vincent", amount: "$8,750", status: "Active", img: "", fallback: "M" },
    { name: "Wayne Lawrence", amount: "$10,500", status: "Active", img: "/avatars/wayne.jpg" },
    { name: "Lucas Willie", amount: "$10,500", status: "Active", img: "/avatars/lucas.jpg" },
    { name: "Smith Johnson", amount: "$7,900", status: "Active", img: "/avatars/smith.jpg" },
    { name: "Emma Watson", amount: "$5,200", status: "In-active", img: "/avatars/emma.jpg" },
    { name: "John Doe", amount: "$6,500", status: "Active", img: "/avatars/john.jpg" },
];

const ROWS_PER_PAGE = 5;

export default function InvestorsTable() {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(investors.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const paginatedInvestors = investors.slice(startIndex, startIndex + ROWS_PER_PAGE);

    return (
        <Card className="p-6 rounded-2xl shadow-md h-[100%]">
            <h2 className="text-xl font-semibold">Investors</h2>
            <p className="text-gray-500 mb-4">View and manage all users who have invested.</p>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/3">Investors Name</TableHead>
                        <TableHead className="w-1/4">Amount</TableHead>
                        <TableHead className="w-1/4">Investment Type</TableHead>
                        <TableHead className="w-1/5 text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedInvestors.map((investor, index) => (
                        <TableRow key={index}>
                            <TableCell className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarImage src={investor.img} alt={investor.name} />
                                    <AvatarFallback>{investor.fallback || investor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{investor.name}</span>
                            </TableCell>
                            <TableCell className="text-blue-600 font-medium">{investor.amount}</TableCell>
                            <TableCell>
                                <Badge variant={investor.status === "Active" ? "default" : "secondary"} className={investor.status === "In-active" ? "bg-gray-500" : "bg-blue-500"}>
                                    {investor.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">View Detail</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </Button>
            </div>

        </Card>
    );
}
