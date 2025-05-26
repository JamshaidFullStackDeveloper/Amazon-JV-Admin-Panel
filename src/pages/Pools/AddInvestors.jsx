"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from "lucide-react"

export function AddInvestorsModal({ isOpen, onClose, onAddInvestors, currentInvestorIds = [] }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedInvestors, setSelectedInvestors] = useState([])

    // Sample available investors data
    const availableInvestors = [
        { id: "1", name: "Liam Davis", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "2", name: "James Martinez", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "3", name: "Olivia Miller", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "4", name: "Ava Davis", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "5", name: "Sophia Garcia", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "6", name: "Noah Wilson", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "7", name: "Emma Johnson", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "8", name: "William Brown", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "9", name: "Isabella Smith", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "10", name: "Mason Taylor", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "11", name: "Charlotte Anderson", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "12", name: "Elijah Thomas", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "13", name: "Amelia Jackson", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "14", name: "Jessica Liu", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "15", name: "TJ Connor", avatar: "/placeholder.svg?height=40&width=40" },
    ]

    // Filter out investors that are already in the pool
    const filteredInvestors = availableInvestors.filter(
        (investor) =>
            !currentInvestorIds.includes(investor.id) && investor.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    useEffect(() => {
        // Reset selections when modal opens/closes
        if (isOpen) {
            setSelectedInvestors([])
            setSearchQuery("")
        }
    }, [isOpen])

    const toggleInvestor = (investorId) => {
        setSelectedInvestors((prev) =>
            prev.includes(investorId) ? prev.filter((id) => id !== investorId) : [...prev, investorId],
        )
    }

    const handleAddInvestors = () => {
        const investorsToAdd = availableInvestors.filter((investor) => selectedInvestors.includes(investor.id))
        onAddInvestors(investorsToAdd)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Investors</DialogTitle>
                    <DialogDescription>Select investors to add to this pool.</DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search investors..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Investors List */}
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {filteredInvestors.length > 0 ? (
                            filteredInvestors.map((investor) => (
                                <div key={investor.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                                    <Checkbox
                                        id={`add-investor-${investor.id}`}
                                        checked={selectedInvestors.includes(investor.id)}
                                        onCheckedChange={() => toggleInvestor(investor.id)}
                                    />
                                    <label
                                        htmlFor={`add-investor-${investor.id}`}
                                        className="flex items-center space-x-3 cursor-pointer flex-1"
                                    >
                                        <Avatar>
                                            <AvatarImage src={investor.avatar || "/placeholder.svg"} alt={investor.name} />
                                            <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{investor.name}</span>
                                    </label>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                {searchQuery
                                    ? "No investors found matching your search."
                                    : "All available investors are already in this pool."}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={handleAddInvestors}
                            disabled={selectedInvestors.length === 0}
                        >
                            Add {selectedInvestors.length > 0 ? `(${selectedInvestors.length})` : ""}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
