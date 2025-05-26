"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2 } from "lucide-react"
import { CreatePoolModal } from "./AddPool"
import { DeletePoolAlert } from "./DeletePool"
import { InvestorDetailModal } from "./viewInvestors"
import { AddInvestorsModal } from "./AddInvestors"
import DashboardLayout from "@/layouts/Layout"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { CreatePoolModal } from "@/components/create-pool-modal"
// import { DeletePoolAlert } from "@/components/delete-pool-alert"
// import { InvestorDetailModal } from "@/components/investor-detail-modal"
// import { AddInvestorsModal } from "@/components/add-investors-modal"

// Sample data
const initialPoolsData = [
    {
        id: "investor-circle",
        name: "Investor Circle",
        description:
            "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the more...",
        color: "yellow",
        totalInvestors: 10,
        totalInvestments: 9500,
        totalROI: 950,
        investors: [
            {
                id: "1",
                name: "Liam Davis",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 10500,
                status: "Active",
                withdrawalStatus: "Withdraw",
            },
            {
                id: "2",
                name: "James Martinez",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 5000,
                status: "In-active",
                withdrawalStatus: "Withdraw",
            },
            {
                id: "3",
                name: "Olivia Miller",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 7325,
                status: "Active",
                withdrawalStatus: "Requested",
            },
            {
                id: "4",
                name: "Ava Davis",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 8950,
                status: "Active",
                withdrawalStatus: "Requested",
            },
            {
                id: "5",
                name: "Sophia Garcia",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 12410,
                status: "Active",
                withdrawalStatus: "Pending",
            },
        ],
    },
    {
        id: "capital-streams",
        name: "Capital Streams",
        description: "Lorem ipsum served the same purpose for written content as stock photos do now.",
        color: "red",
        totalInvestors: 8,
        totalInvestments: 12000,
        totalROI: 1500,
        investors: [
            {
                id: "6",
                name: "Noah Wilson",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 7500,
                status: "Active",
                withdrawalStatus: "Withdraw",
            },
            {
                id: "7",
                name: "Emma Johnson",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 4500,
                status: "Active",
                withdrawalStatus: "Pending",
            },
        ],
    },
    {
        id: "investment-rounds",
        name: "Investment Rounds",
        description: "Lorem ipsum served the same purpose for written content as stock photos do now.",
        color: "green",
        totalInvestors: 12,
        totalInvestments: 15000,
        totalROI: 2200,
        investors: [
            {
                id: "8",
                name: "William Brown",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 8000,
                status: "Active",
                withdrawalStatus: "Withdraw",
            },
            {
                id: "9",
                name: "Isabella Smith",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 7000,
                status: "In-active",
                withdrawalStatus: "Requested",
            },
        ],
    },
    {
        id: "revenue-hub",
        name: "Revenue Hub",
        description: "Lorem ipsum served the same purpose for written content as stock photos do now.",
        color: "green",
        totalInvestors: 6,
        totalInvestments: 8000,
        totalROI: 1200,
        investors: [
            {
                id: "10",
                name: "Mason Taylor",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 4000,
                status: "Active",
                withdrawalStatus: "Withdraw",
            },
            {
                id: "11",
                name: "Charlotte Anderson",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 4000,
                status: "Active",
                withdrawalStatus: "Pending",
            },
        ],
    },
    {
        id: "capital-grid",
        name: "Capital Grid",
        description: "Lorem ipsum served the same purpose for written content as stock photos do now.",
        color: "blue",
        totalInvestors: 9,
        totalInvestments: 11000,
        totalROI: 1800,
        investors: [
            {
                id: "12",
                name: "Elijah Thomas",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 5500,
                status: "Active",
                withdrawalStatus: "Withdraw",
            },
            {
                id: "13",
                name: "Amelia Jackson",
                avatar: "/placeholder.svg?height=40&width=40",
                investment: 5500,
                status: "In-active",
                withdrawalStatus: "Requested",
            },
        ],
    },
]

export function Pools() {
    const [poolsData, setPoolsData] = useState(initialPoolsData)
    const [selectedPool, setSelectedPool] = useState(initialPoolsData[0])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
    const [poolToDelete, setPoolToDelete] = useState(null)
    const [selectedInvestor, setSelectedInvestor] = useState(null)
    const [isInvestorDetailOpen, setIsInvestorDetailOpen] = useState(false)
    const [isAddInvestorsOpen, setIsAddInvestorsOpen] = useState(false)

    const handlePoolSelect = (pool) => {
        setSelectedPool(pool)
    }

    const handleCreatePool = (newPool) => {
        const updatedPools = [...poolsData, newPool]
        setPoolsData(updatedPools)
        setSelectedPool(newPool) // Select the newly created pool
    }

    const handleDeleteClick = (pool) => {
        setPoolToDelete(pool)
        setIsDeleteAlertOpen(true)
    }

    const handleDeleteConfirm = () => {
        const updatedPools = poolsData.filter((pool) => pool.id !== poolToDelete.id)
        setPoolsData(updatedPools)

        // If the deleted pool was selected, select the first available pool
        if (selectedPool.id === poolToDelete.id && updatedPools.length > 0) {
            setSelectedPool(updatedPools[0])
        } else if (updatedPools.length === 0) {
            setSelectedPool(null)
        }

        setIsDeleteAlertOpen(false)
        setPoolToDelete(null)
    }

    const handleViewInvestorDetail = (investor) => {
        setSelectedInvestor(investor)
        setIsInvestorDetailOpen(true)
    }

    const handleAddInvestors = (newInvestors) => {
        if (!selectedPool || newInvestors.length === 0) return

        // Add new investors to the selected pool
        const updatedInvestors = [
            ...selectedPool.investors,
            ...newInvestors.map((investor) => ({
                ...investor,
                investment: 0, // Default investment amount
                status: "Active",
                withdrawalStatus: "Pending",
            })),
        ]

        // Update the pool with new investors
        const updatedPool = {
            ...selectedPool,
            investors: updatedInvestors,
            totalInvestors: updatedInvestors.length,
        }

        // Update pools data
        const updatedPools = poolsData.map((pool) => (pool.id === selectedPool.id ? updatedPool : pool))
        setPoolsData(updatedPools)
        setSelectedPool(updatedPool)
    }

    return (
        <DashboardLayout>
            <div className="p-6  md:px-12 mx-auto py-6">
                <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Pools</h1>
                            <p className="text-gray-500 text-sm">
                                Track and manage investors by cycle periods, investments, and payment status.
                            </p>
                        </div>
                        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setIsCreateModalOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Create New
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Left sidebar - Pool list */}
                        <div className="md:col-span-1">
                            <h2 className="text-lg font-semibold mb-4">All Pools</h2>
                            <div className="space-y-4">
                                {poolsData.map((pool) => (
                                    <Card
                                        key={pool.id}
                                        className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${selectedPool?.id === pool.id ? "border-2 border-blue-500 bg-blue-500 text-white" : ""
                                            }`}
                                        onClick={() => handlePoolSelect(pool)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold">{pool.name}</h3>
                                                    <div
                                                        className={`ml-2 w-5 h-5 rounded-md ${pool.color === "yellow"
                                                            ? "bg-yellow-400"
                                                            : pool.color === "red"
                                                                ? "bg-red-500"
                                                                : pool.color === "green"
                                                                    ? "bg-green-500"
                                                                    : pool.color === "blue"
                                                                        ? "bg-blue-500"
                                                                        : pool.color === "purple"
                                                                            ? "bg-purple-500"
                                                                            : pool.color === "pink"
                                                                                ? "bg-pink-500"
                                                                                : pool.color === "orange"
                                                                                    ? "bg-orange-500"
                                                                                    : "bg-cyan-500"
                                                            }`}
                                                    />
                                                </div>
                                                <p className={`text-xs text-gray-500 mt-1 ${selectedPool?.id === pool.id ? "text-white" : ""}`}>{pool.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex mt-3 -space-x-2">
                                            {pool.investors.slice(0, 3).map((investor) => (
                                                <Avatar key={investor.id} className="border-2 border-white w-6 h-6">
                                                    <AvatarImage src={investor.avatar || "/placeholder.svg"} />
                                                    <AvatarFallback className="text-xs">{investor.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                            {pool.totalInvestors > 3 && (
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs text-gray-600 border-2 border-white z-10">
                                                    +{pool.totalInvestors - 3}
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Main content - Pool details */}
                        <div className="md:col-span-2 lg:col-span-3">
                            {selectedPool ? (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex justify-between flex-wrap gap-2 items-start mb-6">
                                        <div>
                                            <div className="flex items-center">
                                                <h2 className="text-xl font-bold">{selectedPool.name}</h2>
                                                <div
                                                    className={`ml-2 w-5 h-5 rounded-md ${selectedPool.color === "yellow"
                                                        ? "bg-yellow-400"
                                                        : selectedPool.color === "red"
                                                            ? "bg-red-500"
                                                            : selectedPool.color === "green"
                                                                ? "bg-green-500"
                                                                : selectedPool.color === "blue"
                                                                    ? "bg-blue-500"
                                                                    : selectedPool.color === "purple"
                                                                        ? "bg-purple-500"
                                                                        : selectedPool.color === "pink"
                                                                            ? "bg-pink-500"
                                                                            : selectedPool.color === "orange"
                                                                                ? "bg-orange-500"
                                                                                : "bg-cyan-500"
                                                        }`}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{selectedPool.description}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                className="text-red-500 border-red-500 hover:bg-red-50"
                                                onClick={() => handleDeleteClick(selectedPool)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Pool
                                            </Button>
                                            <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => setIsAddInvestorsOpen(true)}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Add Investor
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <Card className="p-4">
                                            <h3 className="text-sm text-gray-500">Total Investors</h3>
                                            <p className="text-3xl font-bold">{selectedPool.totalInvestors}</p>
                                        </Card>
                                        <Card className="p-4">
                                            <h3 className="text-sm text-gray-500">Total Investments</h3>
                                            <p className="text-3xl font-bold">${selectedPool.totalInvestments.toLocaleString()}</p>
                                        </Card>
                                        <Card className="p-4">
                                            <h3 className="text-sm text-gray-500">Total ROI</h3>
                                            <p className="text-3xl font-bold">${selectedPool.totalROI.toLocaleString()}</p>
                                        </Card>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-4">Filter</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-500 mb-1 block">Select Cycle Period</label>
                                                <Select defaultValue="first">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Cycle Period" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="first">First Period (0-15 Days)</SelectItem>
                                                        <SelectItem value="second">Second Period (16-30 Days)</SelectItem>
                                                        <SelectItem value="third">Third Period (31-45 Days)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500 mb-1 block">Select Type</label>
                                                <Select defaultValue="active">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active/Inactive</SelectItem>
                                                        <SelectItem value="active-only">Active Only</SelectItem>
                                                        <SelectItem value="inactive-only">Inactive Only</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-500 mb-1 block">Amount</label>
                                                <Select defaultValue="range1">
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Amount Range" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="range1">$1000 - $5000</SelectItem>
                                                        <SelectItem value="range2">$5001 - $10000</SelectItem>
                                                        <SelectItem value="range3">$10001+</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <Table className="w-full overflow-auto">
                                            <TableHeader>
                                                <TableRow className="text-left text-gray-500 text-sm border-b">
                                                    <TableHead className="pb-2 font-medium">Name</TableHead>
                                                    <TableHead className="pb-2 font-medium">Investment</TableHead>
                                                    <TableHead className="pb-2 font-medium">Type</TableHead>
                                                    <TableHead className="pb-2 font-medium">Status</TableHead>
                                                    <TableHead className="pb-2 font-medium">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedPool.investors.length > 0 ? (
                                                    selectedPool.investors.map((investor) => (
                                                        <TableRow key={investor.id} className="border-b last:border-b-0">
                                                            <TableCell className="py-4">
                                                                <div className="flex items-center">
                                                                    <Avatar className="mr-2 h-8 w-8">
                                                                        <AvatarImage src={investor.avatar || "/placeholder.svg"} alt={investor.name} />
                                                                        <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span>{investor.name}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-4">${investor.investment.toLocaleString()}</TableCell>
                                                            <TableCell className="py-4">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className={`${investor.status === "Active"
                                                                        ? "bg-blue-100 text-blue-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                                        }`}
                                                                >
                                                                    {investor.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="py-4">
                                                                <span
                                                                    className={`${investor.withdrawalStatus === "Withdraw"
                                                                        ? "text-blue-500"
                                                                        : investor.withdrawalStatus === "Requested"
                                                                            ? "text-red-500"
                                                                            : "text-gray-500"
                                                                        }`}
                                                                >
                                                                    {investor.withdrawalStatus}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="py-4">
                                                                <Button variant="outline" size="sm" onClick={() => handleViewInvestorDetail(investor)}>
                                                                    View detail
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan="5" className="py-4 text-center text-gray-500">
                                                            No investors added to this pool yet.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center h-full">
                                    <p className="text-gray-500">Select a pool to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Create Pool Modal */}
                <CreatePoolModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreatePool={handleCreatePool}
                />

                {/* Delete Pool Alert */}
                <DeletePoolAlert
                    isOpen={isDeleteAlertOpen}
                    onClose={() => setIsDeleteAlertOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    poolName={poolToDelete?.name || ""}
                />

                {/* Investor Detail Modal */}
                <InvestorDetailModal
                    isOpen={isInvestorDetailOpen}
                    onClose={() => setIsInvestorDetailOpen(false)}
                    investor={selectedInvestor}
                />

                {/* Add Investors Modal */}
                <AddInvestorsModal
                    isOpen={isAddInvestorsOpen}
                    onClose={() => setIsAddInvestorsOpen(false)}
                    onAddInvestors={handleAddInvestors}
                    currentInvestorIds={selectedPool?.investors.map((inv) => inv.id) || []}
                />
            </div>
        </DashboardLayout>
    )
}
