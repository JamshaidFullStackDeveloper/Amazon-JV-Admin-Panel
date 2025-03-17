import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Upload, Phone } from "lucide-react";

const countries = [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+1', name: 'Canada', flag: '🇨🇦' },
];

const AddInvestor = () => {
    const [formData, setFormData] = useState({
        name: '',
        phoneCode: '+1',
        phoneNumber: '',
        amount: '',
        type: '',
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
    });

    const [photoPreview, setPhotoPreview] = useState(null);
    const [isValid, setIsValid] = useState(false);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all")
            .then(response => response.json())
            .then(data => {
                const countryData = data.map(country => ({
                    code: `+${country.idd?.root?.replace('+', '') || ''}${country.idd?.suffixes?.[0] || ''}`,
                    name: country.name.common,
                    flag: country.flags.svg
                })).filter(c => c.code);
                setCountries(countryData);
            })
            .catch(error => console.error("Error fetching countries:", error));
    }, []);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCountryChange = (value) => {
        const country = countries.find(c => c.code === value);
        setSelectedCountry(country);
        setFormData(prev => ({
            ...prev,
            phoneCode: value
        }));
    };

    const handleCheckboxChange = (checked) => {
        setFormData(prev => ({
            ...prev,
            termsAccepted: checked
        }));
    };

    useEffect(() => {
        const {
            name, phoneNumber, amount, type, email,
            password, confirmPassword, termsAccepted
        } = formData;

        const isFormValid =
            name.trim() !== '' &&
            phoneNumber.trim() !== '' &&
            amount.trim() !== '' &&
            type.trim() !== '' &&
            email.trim() !== '' &&
            password.trim() !== '' &&
            confirmPassword.trim() !== '' &&
            password === confirmPassword &&
            termsAccepted;

        setIsValid(isFormValid);
    }, [formData]);

    return (
        <Card className="max-w-2xl mx-auto border-none shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-semibold">Add New Investor</CardTitle>
            </CardHeader>
            <p className="px-6 text-sm text-gray-500">
                Fill in the details to add a new investor to the system.
            </p>
            <CardContent className="space-y-6 mt-4">
                {/* Profile Image Upload */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col  ">
                        <Avatar className="h-24 w-24 border   rounded-xl">
                            {photoPreview ? <AvatarImage src={photoPreview} /> : <AvatarFallback>Upload</AvatarFallback>}
                        </Avatar>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="mt-2" />
                    </div>
                    {/* <p className="text-sm text-gray-500">Click to upload profile picture</p> */}


                    {/* Form Fields */}
                    <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-2">
                            <label className="text-sm">Enter Name</label>
                            <Input
                                name="name"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm">Enter Phone</label>
                            <div className="flex gap-2">
                                <Select onValueChange={(value) => setFormData({ ...formData, phoneCode: value })}>
                                    <SelectTrigger><SelectValue>{formData.phoneCode || "Select Country"}</SelectValue></SelectTrigger>
                                    <SelectContent className="max-h-[300px] max-w-[270px]">
                                        {countries.map((country, index) => (
                                            <SelectItem key={index} value={country.code}>
                                                <img src={country.flag} alt="flag" className="w-5 h-5 inline-block mr-2" />
                                                {country.name} ({country.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
                            </div>

                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm">Enter Amount</label>
                        <Input
                            name="amount"
                            placeholder="$"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm">Type</label>
                        <Input
                            name="type"
                            placeholder="Type will auto adjust according typed amount"
                            value={formData.type}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm">Enter Email</label>
                    <Input
                        name="email"
                        placeholder="Enter email for login credentials"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm">Create Password</label>
                        <Input
                            name="password"
                            type="password"
                            placeholder="Create password for login credentials"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm">Confirm Password</label>
                        <Input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Note:</h3>
                    <ul className="text-sm text-gray-500 space-y-1 list-disc pl-4">
                        <li>The investor will receive an email once their investment request is approved, including relevant details.</li>
                        <li>If the investor has any questions, they can contact support at support@yourcompany.com or +1-234-567-890</li>
                        <li>The investment cycle (75 days) will begin on the selected start date. Ensure that payment confirmation is complete before processing.</li>
                    </ul>
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">Terms & Conditions</h3>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="terms"
                            checked={formData.termsAccepted}
                            onCheckedChange={handleCheckboxChange}
                        />
                        <label htmlFor="terms" className="text-sm text-gray-500">
                            The investor will allow their next cycle payment 60 days after the investment cycle is completed
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="summary" checked={formData.termsAccepted} onCheckedChange={handleCheckboxChange} />
                        <label htmlFor="summary" className="text-sm text-gray-500">
                            A detailed summary of the investment, including cycles and expected returns, will be available in the investor's dashboard once approved
                        </label>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button
                        disabled={!isValid}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Create Investor
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AddInvestor;