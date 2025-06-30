"use client"

import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Media_BASE_URL } from "@/utils/media_Base_URL"

export default function ImagePreviewModal({ isOpen, onClose, image }) {
    if (!image) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        {image.title}
                        {/* <Button variant="ghost" size="sm" onClick={onClose}> */}
                        {/* <X className="w-4 h-4" /> */}
                        {/* </Button> */}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center p-4">
                    <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.title}
                        className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
