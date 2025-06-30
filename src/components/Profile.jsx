"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Edit2, Upload, X } from "lucide-react"
// import Image from "next/image"
import DashboardLayout from "@/layouts/Layout"
import { useAuth } from "@/context/AuthContext"

export default function Profile() {
    const { user } = useAuth();
    console.log(user);

    // Personal Details State
    const [personalDetails, setPersonalDetails] = useState({
        name: "Jonathan Smith",
        email: "Munebali010@icloud.com", // Non-editable
        editableEmail: "jonathan@buildsphere.com",
        joinedDate: "Dec 25, 2025", // Non-editable
        cnicNumber: "34601-7377779-5", // Non-editable
        phone: "+92 325 7888892",
    })

    // Kin Details State
    const [kinDetails, setKinDetails] = useState({
        fullName: "Muneb Ali",
        relationWithInvestor: "Brother",
        kinEmail: "Munesali010@icloud.com",
        kinPhoneNumber: "+92 325 7888892",
        kinCnicNumber: "34601-7377779-5",
    })

    // CNIC Images State
    const [personalCnicImages, setPersonalCnicImages] = useState({
        front: null,
        back: null,
    })

    const [kinCnicImages, setKinCnicImages] = useState({
        front: null,
        back: null,
    })

    // Edit States
    const [editingPersonal, setEditingPersonal] = useState({
        name: false,
        editableEmail: false,
        phone: false,
    })

    const [editingKin, setEditingKin] = useState({
        fullName: false,
        kinEmail: false,
        kinPhoneNumber: false,
        kinCnicNumber: false,
    })

    const handlePersonalEdit = (field, value) => {
        setPersonalDetails((prev) => ({ ...prev, [field]: value }))
    }

    const handleKinEdit = (field, value) => {
        setKinDetails((prev) => ({ ...prev, [field]: value }))
    }

    const handleImageUpload = (type, side, file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const imageUrl = e.target?.result
            if (type === "personal") {
                setPersonalCnicImages((prev) => ({ ...prev, [side]: imageUrl }))
            } else {
                setKinCnicImages((prev) => ({ ...prev, [side]: imageUrl }))
            }
        }
        reader.readAsDataURL(file)
    }

    const removeImage = (type, side) => {
        if (type === "personal") {
            setPersonalCnicImages((prev) => ({ ...prev, [side]: null }))
        } else {
            setKinCnicImages((prev) => ({ ...prev, [side]: null }))
        }
    }

    const EditableField = ({ label, value, field, type, isEditing, onEdit, onSave, onCancel, disabled = false }) => {
        const [tempValue, setTempValue] = useState(value)

        return (
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">{label}</Label>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Input value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="flex-1" />
                            <Button
                                size="sm"
                                onClick={() => {
                                    onSave(tempValue)
                                    onCancel()
                                }}
                                className="h-8 w-8 p-0"
                            >
                                ✓
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setTempValue(value)
                                    onCancel()
                                }}
                                className="h-8 w-8 p-0"
                            >
                                ✕
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="flex-1 py-2 px-3 bg-gray-50 rounded-md text-sm">{value}</div>
                            {!disabled && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={onEdit}
                                    className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        )
    }

    const NonEditableField = ({ label, value }) => (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600">{label}</Label>
            <div className="py-2 px-3 bg-gray-50 rounded-md text-sm text-gray-500">{value}</div>
        </div>
    )

    const ImageUploadSection = ({ title, images, onUpload, onRemove }) => (
        <div className="space-y-4">
            <h4 className="font-medium text-gray-800">{title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["front", "back"].map((side) => (
                    <div key={side} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-600 capitalize">CNIC {side}</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            {images[side] ? (
                                <div className="relative">
                                    <img
                                        src={images[side] || "/placeholder.svg"}
                                        alt={`CNIC ${side}`}
                                        width={200}
                                        height={120}
                                        className="mx-auto rounded-md object-cover"
                                    />
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => onRemove(side)}
                                        className="absolute top-2 right-2 h-6 w-6 p-0"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                                    <p className="text-sm text-gray-500">Upload CNIC {side}</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) onUpload(side, file)
                                        }}
                                        className="hidden"
                                        id={`${title.toLowerCase().replace(" ", "-")}-${side}`}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            document.getElementById(`${title.toLowerCase().replace(" ", "-")}-${side}`)?.click()
                                        }}
                                    >
                                        Choose File
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <DashboardLayout>
            <div className="max-w-8xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                    <p className="text-gray-600">Your personal and account information is shown here.</p>
                </div>

                {/* Personal Profile Section */}
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold border-gray-500 border-b-2 pb-4">Personal Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Name */}
                            <EditableField
                                label="Full Name"
                                value={personalDetails.name}
                                field="name"
                                type="personal"
                                isEditing={editingPersonal.name}
                                onEdit={() => setEditingPersonal((prev) => ({ ...prev, name: true }))}
                                onSave={(value) => handlePersonalEdit("name", value)}
                                onCancel={() => setEditingPersonal((prev) => ({ ...prev, name: false }))}
                            />

                            {/* Non-editable Joined Date */}
                            <NonEditableField label="Joined" value={personalDetails.joinedDate} />
                            {/* Non-editable Email */}
                            <NonEditableField label="Email" value={personalDetails.email} />

                            {/* Editable Email */}
                            {/* <EditableField
                                label="Email"
                                value={personalDetails.editableEmail}
                                field="editableEmail"
                                type="personal"
                                isEditing={editingPersonal.editableEmail}
                                onEdit={() => setEditingPersonal((prev) => ({ ...prev, editableEmail: true }))}
                                onSave={(value) => handlePersonalEdit("editableEmail", value)}
                                onCancel={() => setEditingPersonal((prev) => ({ ...prev, editableEmail: false }))}
                            /> */}

                            {/* Non-editable CNIC Number */}
                            <NonEditableField label="CNIC Number" value={personalDetails.cnicNumber} />



                            {/* Phone */}
                            <EditableField
                                label="Phone Number"
                                value={personalDetails.phone}
                                field="phone"
                                type="personal"
                                isEditing={editingPersonal.phone}
                                onEdit={() => setEditingPersonal((prev) => ({ ...prev, phone: true }))}
                                onSave={(value) => handlePersonalEdit("phone", value)}
                                onCancel={() => setEditingPersonal((prev) => ({ ...prev, phone: false }))}
                            />
                        </div>

                        <Separator />

                        {/* Personal CNIC Images */}
                        <ImageUploadSection
                            title="Personal CNIC Images"
                            images={personalCnicImages}
                            onUpload={(side, file) => handleImageUpload("personal", side, file)}
                            onRemove={(side) => removeImage("personal", side)}
                        />
                    </CardContent>
                </Card>

                {/* Next to Kin Section */}
                {/* <Card className="border-none shadow-none"> */}
                {/* <CardHeader> */}
                {/* <CardTitle className="text-lg font-semibold border-gray-500 border-b-2 pb-4">Next to Kin</CardTitle> */}
                {/* </CardHeader> */}
                {/* <CardContent className="space-y-6"> */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                {/* <!~~ Full Name ~~> */}
                {/* <EditableField */}
                {/* label="Full Name" */}
                {/* value={kinDetails.fullName} */}
                {/* field="fullName" */}
                {/* type="kin" */}
                {/* isEditing={editingKin.fullName} */}
                {/* onEdit={() => setEditingKin((prev) => ({ ...prev, fullName: true }))} */}
                {/* onSave={(value) => handleKinEdit("fullName", value)} */}
                {/* onCancel={() => setEditingKin((prev) => ({ ...prev, fullName: false }))} */}
                {/* /> */}
                {/*  */}
                {/* <!~~ Relation with Investor ~~> */}
                {/* <div className="space-y-2"> */}
                {/* <Label className="text-sm font-medium text-gray-600">Relation with Investor</Label> */}
                {/* <Select */}
                {/* value={kinDetails.relationWithInvestor} */}
                {/* onValueChange={(value) => handleKinEdit("relationWithInvestor", value)} */}
                {/* > */}
                {/* <SelectTrigger> */}
                {/* <SelectValue /> */}
                {/* </SelectTrigger> */}
                {/* <SelectContent> */}
                {/* <SelectItem value="Brother">Brother</SelectItem> */}
                {/* <SelectItem value="Sister">Sister</SelectItem> */}
                {/* <SelectItem value="Father">Father</SelectItem> */}
                {/* <SelectItem value="Mother">Mother</SelectItem> */}
                {/* <SelectItem value="Spouse">Spouse</SelectItem> */}
                {/* <SelectItem value="Son">Son</SelectItem> */}
                {/* <SelectItem value="Daughter">Daughter</SelectItem> */}
                {/* <SelectItem value="Other">Other</SelectItem> */}
                {/* </SelectContent> */}
                {/* </Select> */}
                {/* </div> */}
                {/*  */}
                {/* <!~~ Kin Email ~~> */}
                {/* <EditableField */}
                {/* label="Kin Email" */}
                {/* value={kinDetails.kinEmail} */}
                {/* field="kinEmail" */}
                {/* type="kin" */}
                {/* isEditing={editingKin.kinEmail} */}
                {/* onEdit={() => setEditingKin((prev) => ({ ...prev, kinEmail: true }))} */}
                {/* onSave={(value) => handleKinEdit("kinEmail", value)} */}
                {/* onCancel={() => setEditingKin((prev) => ({ ...prev, kinEmail: false }))} */}
                {/* /> */}
                {/*  */}
                {/* <!~~ Kin Phone Number ~~> */}
                {/* <EditableField */}
                {/* label="Kin Phone Number" */}
                {/* value={kinDetails.kinPhoneNumber} */}
                {/* field="kinPhoneNumber" */}
                {/* type="kin" */}
                {/* isEditing={editingKin.kinPhoneNumber} */}
                {/* onEdit={() => setEditingKin((prev) => ({ ...prev, kinPhoneNumber: true }))} */}
                {/* onSave={(value) => handleKinEdit("kinPhoneNumber", value)} */}
                {/* onCancel={() => setEditingKin((prev) => ({ ...prev, kinPhoneNumber: false }))} */}
                {/* /> */}
                {/*  */}
                {/* <!~~ Kin CNIC Number ~~> */}
                {/* <EditableField */}
                {/* label="Kin CNIC Number" */}
                {/* value={kinDetails.kinCnicNumber} */}
                {/* field="kinCnicNumber" */}
                {/* type="kin" */}
                {/* isEditing={editingKin.kinCnicNumber} */}
                {/* onEdit={() => setEditingKin((prev) => ({ ...prev, kinCnicNumber: true }))} */}
                {/* onSave={(value) => handleKinEdit("kinCnicNumber", value)} */}
                {/* onCancel={() => setEditingKin((prev) => ({ ...prev, kinCnicNumber: false }))} */}
                {/* /> */}
                {/* </div> */}
                {/*  */}
                {/* <Separator /> */}
                {/*  */}
                {/* <!~~ Kin CNIC Images ~~> */}
                {/* <ImageUploadSection */}
                {/* title="Kin CNIC Images" */}
                {/* images={kinCnicImages} */}
                {/* onUpload={(side, file) => handleImageUpload("kin", side, file)} */}
                {/* onRemove={(side) => removeImage("kin", side)} */}
                {/* /> */}
                {/* </CardContent> */}
                {/* </Card> */}

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button className="px-8">Save Changes</Button>
                </div>
            </div>
        </DashboardLayout>
    )
}
