"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Pagination({
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    onPreviousPage,
    onNextPage,
    onPageClick,
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
                Showing {totalItems > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalItems)} of {totalItems} data
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                    className="text-gray-600"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                </Button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                        pageNumber = i + 1
                    } else if (currentPage <= 3) {
                        pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                    } else {
                        pageNumber = currentPage - 2 + i
                    }

                    return (
                        <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => onPageClick(pageNumber)}
                            className={currentPage === pageNumber ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-600"}
                        >
                            {pageNumber}
                        </Button>
                    )
                })}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="text-gray-600"
                >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    )
}
