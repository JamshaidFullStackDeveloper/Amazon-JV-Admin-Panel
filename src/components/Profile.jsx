import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye } from "lucide-react";

const ProfileUpdate = () => {
    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center mb-6">
                <Button variant="ghost" className="text-sm">
                    ← Back
                </Button>
            </div>

            {/* Profile Picture Section */}
            <div className="space-y-4">
                <h2 className="text-sm text-gray-500">Profile Picture</h2>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="/api/placeholder/100/100" alt="Profile" />
                        <AvatarFallback>CR</AvatarFallback>
                    </Avatar>
                    <div className="space-x-2">
                        <Button variant="default" size="sm">Change Picture</Button>
                        <Button variant="destructive" size="sm">Delete Picture</Button>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <Card className="border-0 shadow-none">
                <CardContent className="p-0 space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-500">Full Name</label>
                            <Input defaultValue="Charlie Roman" className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-500">Phone</label>
                            <Input defaultValue="+1-212-456-7890" className="bg-gray-50" />
                        </div>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-medium">Account Details:</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Email</label>
                                <Input defaultValue="Muneball010@icloud.com" className="bg-gray-50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Password</label>
                                <div className="relative">
                                    <Input type="password" defaultValue="••••••••••" className="bg-gray-50 pr-10" />
                                    <Eye className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Created & Cycle */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-500">Created</label>
                            <Input defaultValue="15, Feb 2025" className="bg-gray-50" readOnly />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-500">Cycle Completion</label>
                            <Input defaultValue="31, Mar 2025" className="bg-gray-50" readOnly />
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-medium">Payment:</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Amount</label>
                                <Input defaultValue="$15,000" className="bg-gray-50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500">Type</label>
                                <Input defaultValue="Active" className="bg-gray-50" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="flex justify-end">
                <Button variant="outline">Cancel</Button>
            </div>
        </div>
    );
};

export default ProfileUpdate;