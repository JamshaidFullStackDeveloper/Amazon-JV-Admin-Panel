import React, { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, User, CreditCard, MapPin, FileText, Edit, Trash2, Plus, Loader2 } from "lucide-react"
import DashboardLayout from "@/layouts/Layout"
import { fetchData } from "@/redux/GetApiSlice/Index"
import { useDispatch, useSelector } from "react-redux"
import { useLoader } from "@/context/LoaderContext"
import { useGlobalToast } from "@/context/ToastContext"
import { postData, resetPostState, resetPostStatus } from "@/redux/PostApiSlice/Index"
import { deleteData, resetDeleteStatus } from "@/redux/DeleteApiSlice"
import { useAuth } from "@/context/AuthContext"
import Cookies from "js-cookie"
import { resetData } from "@/redux/GetApiSlice/GetSlice"

const pakistanBanks = [
    { id: "hbl", name: "Habib Bank Limited (HBL)", logo: "/placeholder.svg?height=32&width=32" },
    { id: "ubl", name: "United Bank Limited (UBL)", logo: "/placeholder.svg?height=32&width=32" },
    { id: "mcb", name: "MCB Bank Limited", logo: "/placeholder.svg?height=32&width=32" },
    { id: "abl", name: "Allied Bank Limited (ABL)", logo: "/placeholder.svg?height=32&width=32" },
    { id: "nbl", name: "National Bank of Pakistan", logo: "/placeholder.svg?height=32&width=32" },
    { id: "meezan", name: "Meezan Bank", logo: "/placeholder.svg?height=32&width=32" },
    { id: "faysal", name: "Faysal Bank", logo: "/placeholder.svg?height=32&width=32" },
    { id: "askari", name: "Askari Bank", logo: "/placeholder.svg?height=32&width=32" },
    { id: "js", name: "JS Bank", logo: "/placeholder.svg?height=32&width=32" },
    { id: "summit", name: "Summit Bank", logo: "/placeholder.svg?height=32&width=32" },
    { id: "silk", name: "Silk Bank", logo: "/placeholder.svg?height=32&width=32" },
    { id: "samba", name: "Samba Bank", logo: "/placeholder.svg?height=32&width=32" },
    { id: "jazzcash", name: "Jazzcash", logo: "/placeholder.svg?height=32&width=32" },
    { id: "easypaisa", name: "Easypaisa", logo: "/placeholder.svg?height=32&width=32" },
]

export default function BankDetiles() {
    const dispatch = useDispatch()
    let parsedUser;
    // const { user } = useAuth()
    const user = Cookies.get("user")
    if (user) {
        parsedUser = JSON.parse(user);

    }
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useGlobalToast();

    const [accounts, setAccounts] = useState([

    ])

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAccount, setEditingAccount] = useState(null)
    const [formData, setFormData] = useState({
        bank_name: "",
        account_holder_name: "",
        iban: "",
        cnic: "",
        account_type: "Personal",
        country: "Pakistan"
    })

    const { data, error, successMessage } = useSelector((state) => state.api);
    const { postStatus, postError, postSuccessMessage } = useSelector((state) => state.postApi);
    const { deleteStatus, deleteError, deleteSuccessMessage, } = useSelector((state) => state.deleteApi);

    const AllAcount = data?.data
    useEffect(() => {
        showLoader()
        dispatch(resetData())

        dispatch(fetchData(`/bank-details?user_id=${parsedUser.id}`)).finally(hideLoader());
    }, [postStatus, deleteSuccessMessage]);

    useEffect(() => {
        if (editingAccount) {
            setFormData({
                ...editingAccount,
                // bank_name should already exist in editingAccount
            });
        } else {
            // For adding new account, set a default bank if desired
            setFormData((prev) => ({
                ...prev,
                bank_name: pakistanBanks[0]?.name || "", // default to first bank if needed
            }));
        }
    }, [editingAccount, pakistanBanks]);


    useEffect(() => {

        if (postStatus == "succeeded") {
            setIsDialogOpen(false)
            resetForm()
            dispatch(resetPostState())
            dispatch(resetPostStatus())
            showToast(postSuccessMessage, "success")
        } else if (postStatus == "failed") {
            showToast(postError, "error")
            dispatch(resetPostState())
            dispatch(resetPostStatus())
        } else if (deleteStatus === "succeeded") {
            showToast(deleteSuccessMessage, "success")
            dispatch(resetDeleteStatus())
        } else if (deleteStatus === "failed") {
            showToast(deleteError, "error")
            dispatch(resetDeleteStatus())
        }
    }, [postStatus, deleteStatus])

    const resetForm = () => {
        setFormData({
            bank_name: "",
            account_holder_name: "",
            iban: "",
            cnic: "",
            account_type: "Personal",
            country: "Pakistan"
        })
        setEditingAccount(null)
    }

    const handleAddAccount = () => {
        resetForm()
        setIsDialogOpen(true)

    }

    const handleEditAccount = (account) => {
        setEditingAccount(account)
        setFormData({
            bank_name: account.bank_name,
            account_holder_name: account.account_holder_name,
            iban: account.iban,
            cnic: account.cnic,
            accountType: account.account_type || "Personal",
            country: "Pakistan"
        })
        setIsDialogOpen(true)
    }

    const handleDeleteAccount = (id) => {

        dispatch(deleteData({ endpoint: `/bank-details/${id}` })).finally(
            dispatch(resetDeleteStatus())
        )
    }

    // const handleSubmit = (e) => {
    //     e.preventDefault()

    //     const selectedBank = pakistanBanks.find((bank) => bank.name === formData.bank_name)

    //     if (editingAccount) {
    //         setAccounts(
    //             AllAcount.map((account) =>
    //                 account.id === editingAccount.id
    //                     ? {
    //                         ...account,
    //                         bank_name: formData.bank_name,
    //                         account_holder_name: formData.account_holder_name,
    //                         iban: formData.iban,
    //                         cnic: formData.cnic,
    //                         account_type: formData.account_type,
    //                         country: "Pakistan"
    //                     }
    //                     : account
    //             )
    //         )
    //     } else {
    //         const newAccount = {
    //             id: Date.now().toString(),
    //             bank_name: formData.bank_name,
    //             account_holder_name: formData.account_holder_name,
    //             iban: formData.iban,
    //             cnic: formData.cnic,
    //             account_type: formData.account_type,
    //             country: "Pakistan"
    //         }
    //         setAccounts([...accounts, newAccount])
    //     }
    //     dispatch(postData({ endpoint: `/bank-details`, payload: formData })).finally(() => {
    //         setIsDialogOpen(false)
    //         resetForm()
    //     });

    // }

    const handleSubmit = (e) => {
        e.preventDefault();

        const selectedBank = pakistanBanks.find((bank) => bank.name === formData.bank_name);

        const payload = {
            ...formData,
            country: "Pakistan",
        };

        if (editingAccount) {
            // Local state update
            setAccounts(
                AllAcount.map((account) =>
                    account.id === editingAccount.id ? { ...account, ...payload } : account
                )
            );

            // API call for updating
            dispatch(postData({ endpoint: `/bank-details/${editingAccount.id}`, payload: formData }))
        } else {
            const newAccount = {
                id: Date.now().toString(),
                ...payload,
            };

            // Local state update
            setAccounts([...accounts, newAccount]);

            // API call for adding
            dispatch(postData({ endpoint: `/bank-details`, payload: formData }))
        }
    };

    return (

        <DashboardLayout>
            <div className=" p-6 md:px-12 min-h-screen bg-gray-50">
                <div className="mx-auto max-w-8xl">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Manage Bank Accounts</h1>
                            <p className="mt-2 text-gray-600">
                                View, add, or edit your bank accounts to securely manage your transactions and withdrawals.
                            </p>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={handleAddAccount} className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Account
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{editingAccount ? "Edit Bank Account" : "Add New Bank Account"}</DialogTitle>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bankName">Bank Name</Label>
                                        <Select
                                            value={formData.bank_name}
                                            onValueChange={(value) => setFormData({ ...formData, bank_name: value })}
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a bank" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {pakistanBanks.map((bank) => (
                                                    <SelectItem key={bank.name} value={bank.name}>
                                                        <div className="flex items-center gap-2">
                                                            {/* <img src={bank.logo || "/placeholder.svg"} alt={bank.name} className="h-6 w-6 rounded" /> */}
                                                            {bank.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="accountHolderName">Account Holder Name</Label>
                                        <Input
                                            id="accountHolderName"
                                            value={formData.account_holder_name}
                                            onChange={(e) => setFormData({ ...formData, account_holder_name: e.target.value })}
                                            placeholder="Enter account holder name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ibanNumber">IBAN Number / Account Number</Label>
                                        <Input
                                            id="ibanNumber"
                                            value={formData.iban}
                                            onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                                            placeholder="Enter IBAN or account number"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cnicNumber">CNIC Number (Optional)</Label>
                                        <Input
                                            id="cnicNumber"
                                            value={formData.cnic}
                                            onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                                            placeholder="Enter CNIC number"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="accountType">Account Type</Label>
                                        <Select
                                            value={formData.account_type}
                                            onValueChange={(value) => setFormData({ ...formData, account_type: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Personal">Personal</SelectItem>
                                                <SelectItem value="Business">Business</SelectItem>
                                                <SelectItem value="Savings">Savings</SelectItem>
                                                <SelectItem value="Current">Current</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            disabled={postStatus === "loading"}
                                        >
                                            {postStatus === "loading" ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Processing...
                                                </span>
                                            ) : (
                                                editingAccount ? "Update Account" : "Add Account"
                                            )}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Bank Accounts Grid */}
                    <div className="grid gap-6 md:grid-cols-1 ">
                        {AllAcount?.map((account) => (
                            <Card key={account.id} className="relative overflow-hidden">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {/* <img */}
                                            {/* src={account.bankLogo || "/placeholder.svg"} */}
                                            {/* alt={account.bankName} */}
                                            {/* className="h-8 w-8 rounded" */}
                                            {/* /> */}
                                            <CardTitle className="text-lg">{account.bank_name}</CardTitle>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEditAccount(account)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDeleteAccount(account.id)}
                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4 ">
                                    <div className=" grid md:grid-cols-2">
                                        <div className="grid gap-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">Account Holder Name</span>
                                            </div>
                                            <p className="text-sm font-semibold">{account.account_holder_name}</p>
                                        </div>


                                        <div className="grid gap-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <CreditCard className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium">IBAN Number</span>
                                            </div>
                                            <p className="text-sm font-mono">{account.iban}</p>
                                        </div>
                                    </div>
                                    <Separator />

                                    <div className="grid md:grid-cols-2">
                                        {account.cnic && (
                                            <>
                                                {/* <Separator /> */}
                                                <div className="grid gap-3">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FileText className="h-4 w-4 text-gray-500" />
                                                        <span className="font-medium">CNIC Number</span>
                                                    </div>
                                                    <p className="text-sm font-mono">{account.cnic}</p>
                                                </div>
                                            </>
                                        )}

                                        {/* <Separator /> */}

                                        <div>
                                            <div className="grid gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm font-medium">Bank Account Type</span>
                                                </div>
                                                <p className='' >{account.account_type}</p>
                                            </div>

                                            {/* <div className="flex items-center justify-between"> */}
                                            {/* <div className="flex items-center gap-2"> */}
                                            {/* <MapPin className="h-4 w-4 text-gray-500" /> */}
                                            {/* <span className="text-sm font-medium">Bank Country</span> */}
                                            {/* </div> */}
                                            {/* <!~~ <span className="text-sm font-semibold">{account.country}</span> ~~> */}
                                            {/* </div> */}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {AllAcount?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Building2 className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bank accounts added</h3>
                            <p className="text-gray-600 mb-4">Add your first bank account to get started</p>
                            <Button onClick={handleAddAccount} className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Account
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
