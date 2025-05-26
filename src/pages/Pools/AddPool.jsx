"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

export function CreatePoolModal({ isOpen, onClose, onCreatePool }) {
    const [poolName, setPoolName] = useState("")
    const [selectedColor, setSelectedColor] = useState("yellow")
    const [selectedInvestors, setSelectedInvestors] = useState([])
    const [note, setNote] = useState("")

    // Sample investors data
    const availableInvestors = [
        { id: "1", name: "Jessica Liu", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "2", name: "TJ Connor", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "3", name: "Alex Hanna", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "4", name: "Amelia Walker", avatar: "/placeholder.svg?height=40&width=40" },
        { id: "5", name: "John Rogers", avatar: "/placeholder.svg?height=40&width=40" },
    ]

    // Available colors
    const colors = [
        { id: "red", color: "bg-red-500" },
        { id: "yellow", color: "bg-yellow-400" },
        { id: "green", color: "bg-green-500" },
        { id: "blue", color: "bg-blue-500" },
        { id: "purple", color: "bg-purple-500" },
        { id: "pink", color: "bg-pink-500" },
        { id: "orange", color: "bg-orange-500" },
        { id: "cyan", color: "bg-cyan-500" },
    ]

    const toggleInvestor = (investorId) => {
        setSelectedInvestors((prev) =>
            prev.includes(investorId) ? prev.filter((id) => id !== investorId) : [...prev, investorId],
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Create new pool object
        const newPool = {
            id: `pool-${Date.now()}`,
            name: poolName,
            color: selectedColor,
            description: note || "New investment pool",
            totalInvestors: selectedInvestors.length,
            totalInvestments: 0,
            totalROI: 0,
            investors: selectedInvestors.map((id) => {
                const investor = availableInvestors.find((inv) => inv.id === id)
                return {
                    id: investor.id,
                    name: investor.name,
                    avatar: investor.avatar,
                    investment: 0,
                    status: "Active",
                    withdrawalStatus: "Pending",
                }
            }),
        }

        onCreatePool(newPool)
        onClose()

        // Reset form
        setPoolName("")
        setSelectedColor("yellow")
        setSelectedInvestors([])
        setNote("")
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Create New Pool</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 mb-6">
                        A pool is a collection of investments made by the same group of investors. You can use pools to track and
                        manage the investments.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="poolName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter Name
                                </label>
                                <Input
                                    id="poolName"
                                    value={poolName}
                                    onChange={(e) => setPoolName(e.target.value)}
                                    placeholder="Pool name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                                <div className="flex items-center space-x-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color.id}
                                            type="button"
                                            className={`w-6 h-6 rounded-full ${color.color} ${selectedColor === color.id ? "ring-2 ring-offset-2 ring-gray-400" : ""
                                                }`}
                                            onClick={() => setSelectedColor(color.id)}
                                            aria-label={`Select ${color.id} color`}
                                        />
                                    ))}
                                    <button
                                        type="button"
                                        className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600"
                                        aria-label="Add custom color"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Add Investors</label>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {availableInvestors.map((investor) => (
                                        <div key={investor.id} className="flex items-center space-x-3">
                                            <Checkbox
                                                id={`investor-${investor.id}`}
                                                checked={selectedInvestors.includes(investor.id)}
                                                onCheckedChange={() => toggleInvestor(investor.id)}
                                            />
                                            <label htmlFor={`investor-${investor.id}`} className="flex items-center space-x-3 cursor-pointer">
                                                <Avatar>
                                                    <AvatarImage src={investor.avatar || "/placeholder.svg"} alt={investor.name} />
                                                    <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{investor.name}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                                    Add Note
                                </label>
                                <Textarea
                                    id="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add a note about this pool (optional)"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                                    Create Pool
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
