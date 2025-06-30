"use client"
import { Upload, X, FileText, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddEditInvestorModal({
    isOpen,
    onClose,
    onSubmit,
    editingInvestor,
    formData,
    errors,
    loading,
    onInputChange,
    onFileUpload,

}) {
    const handleImageClick = (imageUrl, title) => {
        // You can implement image preview modal here
        console.log("Image clicked:", title, imageUrl)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        {editingInvestor ? "Edit Investor" : "Add New Investor"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => onInputChange("name", e.target.value)}
                                placeholder="Enter first name"
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Enter Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={formData.amount}
                                onChange={(e) => onInputChange("amount", e.target.value)}
                                placeholder="Enter investment amount"
                                className={errors.amount ? "border-red-500" : ""}
                            />
                            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select value={formData.type} onValueChange={(value) => onInputChange("type", value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">In-active</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 ">
                            <Label htmlFor="email">Enter Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => onInputChange("email", e.target.value)}
                                placeholder="Enter email address"
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>
                        <div className="space-y-2 ">
                            <Label htmlFor="cnic_no">Enter CNIC Number</Label>
                            <Input
                                id="cnic_no"
                                // type="number"
                                value={formData.cnic_no}
                                onChange={(e) => onInputChange("cnic_no", e.target.value)}
                                placeholder="Enter investment CNIC Number"
                                className={errors.cnic_no ? "border-red-500" : ""}
                            />
                            {errors.cnic_no && <p className="text-sm text-red-500">{errors.cnic_no}</p>}
                        </div>

                        <div className="space-y-2 ">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                // type="number"
                                value={formData.phone}
                                onChange={(e) => onInputChange("phone", e.target.value)}
                                placeholder="Enter investment CNIC Number"
                                className={errors.phone ? "border-red-500" : ""}
                            />
                            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                        </div>

                    </div>

                    {/* CNIC Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">CNIC Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* CNIC Front */}
                            <div className="space-y-2">
                                <Label>CNIC FRONT</Label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.cnic_front ? "border-red-500" : "border-gray-300"}`}
                                >
                                    {formData.cnic_frontPreview ? (
                                        <div className="space-y-2">
                                            <div
                                                className="w-full h-32 bg-gray-100 rounded flex items-center justify-center cursor-pointer overflow-hidden"
                                                onClick={() => handleImageClick(formData.cnic_frontPreview, "CNIC Front")}
                                            >
                                                <img
                                                    src={formData.cnic_frontPreview || "/placeholder.svg"}
                                                    alt="CNIC Front Preview"
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {formData.cnic_front ? formData.cnic_front.name : "CNIC Front Image"}
                                            </p>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => document.getElementById("cnic_front").click()}
                                                className="text-blue-600"
                                            >
                                                Replace this image
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                                                <Upload className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <Button
                                                variant="link"
                                                onClick={() => document.getElementById("cnic_front").click()}
                                                className="text-blue-600"
                                            >
                                                Upload CNIC Front
                                            </Button>
                                        </div>
                                    )}
                                    <input
                                        id="cnic_front"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => onFileUpload("cnic_front", e.target.files[0])}
                                    />
                                </div>
                                {errors.cnic_front && <p className="text-sm text-red-500">{errors.cnic_front}</p>}
                            </div>

                            {/* CNIC Back */}
                            <div className="space-y-2">
                                <Label>CNIC BACK</Label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-4 text-center ${errors.cnic_back ? "border-red-500" : "border-gray-300"}`}
                                >
                                    {formData.cnic_backPreview ? (
                                        <div className="space-y-2">
                                            <div
                                                className="w-full h-32 bg-gray-100 rounded flex items-center justify-center cursor-pointer overflow-hidden"
                                                onClick={() => handleImageClick(formData.cnic_backPreview, "CNIC Back")}
                                            >
                                                <img
                                                    src={formData.cnic_backPreview || "/placeholder.svg"}
                                                    alt="CNIC Back Preview"
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {formData.cnic_back ? formData.cnic_back.name : "CNIC Back Image"}
                                            </p>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() => document.getElementById("cnic_back").click()}
                                                className="text-blue-600"
                                            >
                                                Replace this image
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                                                <Upload className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <Button
                                                variant="link"
                                                onClick={() => document.getElementById("cnic_back").click()}
                                                className="text-blue-600"
                                            >
                                                Upload CNIC Back
                                            </Button>
                                        </div>
                                    )}
                                    <input
                                        id="cnic_back"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => onFileUpload("cnic_back", e.target.files[0])}
                                    />
                                </div>
                                {errors.cnic_back && <p className="text-sm text-red-500">{errors.cnic_back}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={onSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={loading === "loading"}>
                            {loading === "loading" ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {editingInvestor ? "Updating..." : "Creating..."}
                                </span>
                            ) : (
                                editingInvestor ? "Update Investor" : "Create Investor"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
