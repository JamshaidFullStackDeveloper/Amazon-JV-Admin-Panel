"use client"

import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchAndFilter({
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    onSearch,
    onAddNew,
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-2 w-full sm:w-auto">
                <div className="flex-1 relative">
                    <Input
                        placeholder="Search investors by name, email, or investment ID to quickly find specific details"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                    />
                </div>
                <Button onClick={onSearch} className="px-6 bg-blue-600 hover:bg-blue-700">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                </Button>
            </div>

            <div className="flex gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="In-active">In-active</SelectItem>
                    </SelectContent>
                </Select>

                <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
        </div>
    )
}
