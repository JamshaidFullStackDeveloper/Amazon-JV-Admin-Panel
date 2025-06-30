"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, investorName }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Confirm Delete
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <p className="text-gray-700">
                        Are you sure you want to delete <span className="font-semibold">{investorName}</span>?
                    </p>
                    <p className="text-sm text-gray-500">
                        This action cannot be undone. All investor data, documents, and transaction history will be permanently
                        removed.
                    </p>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
                            Delete Investor
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
