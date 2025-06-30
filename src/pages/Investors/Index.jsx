"use client"

import { useState, useMemo, useEffect } from "react"
import SearchAndFilter from "./SearchFilter"
import InvestorTable from "./InvestorsTable"
import Pagination from "./Pagination"
import AddEditInvestorModal from "./AddInvestors"
import ViewDetailsModal from "./ViewInvestor"
import ImagePreviewModal from "./ImagePreview"
import DeleteConfirmDialog from "./DeleteModel"
import DashboardLayout from "@/layouts/Layout"
import { useDispatch, useSelector } from "react-redux"
import { postData, resetPostStatus } from "@/redux/PostApiSlice/Index"
import { useLoader } from "@/context/LoaderContext"
import { useGlobalToast } from "@/context/ToastContext"
import { fetchData, resetFetchedData } from "@/redux/GetApiSlice/Index"

// Mock data for investors with additional details
const investorsData = [
    {
        id: 1,
        name: "Liam Davis",
        email: "Lbeech@msn.com",
        investment: 10500,
        type: "Active",
        status: "Withdraw",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, New York, NY 10001",
        joinDate: "2024-01-15",
        cnicNumber: "12345-6789012-3",
        dateOfBirth: "1990-05-15",
        nationality: "Pakistani",
        occupation: "Software Engineer",
        emergencyContact: "Jane Davis - +1 (555) 123-4568",
        bankAccount: "****1234 - Chase Bank",
        investmentGoal: "Long-term growth",
        riskTolerance: "Moderate",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [
            { name: "bank_statement.pdf", size: "2.5 MB", type: "application/pdf" },
            { name: "salary_certificate.pdf", size: "1.8 MB", type: "application/pdf" },
        ],
        notes: "Experienced investor with good track record. Prefers technology sector investments.",
        lastActivity: "2024-03-20",
        totalTransactions: 15,
        averageInvestment: 8500,
    },
    {
        id: 2,
        name: "James Martinez",
        email: "Kludge@comcast.net",
        investment: 5000,
        type: "In-active",
        status: "Withdraw",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 234-5678",
        address: "456 Oak Ave, Los Angeles, CA 90210",
        joinDate: "2024-02-20",
        cnicNumber: "23456-7890123-4",
        dateOfBirth: "1985-08-22",
        nationality: "Pakistani",
        occupation: "Business Owner",
        emergencyContact: "Maria Martinez - +1 (555) 234-5679",
        bankAccount: "****5678 - Bank of America",
        investmentGoal: "Capital preservation",
        riskTolerance: "Conservative",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [{ name: "business_license.pdf", size: "1.2 MB", type: "application/pdf" }],
        notes: "Conservative investor, prefers stable returns.",
        lastActivity: "2024-03-18",
        totalTransactions: 8,
        averageInvestment: 6250,
    },
    {
        id: 3,
        name: "Olivia Miller",
        email: "Improv@comcast.net",
        investment: 7325,
        type: "Active",
        status: "Pending",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 345-6789",
        address: "789 Pine Rd, Chicago, IL 60601",
        joinDate: "2024-03-10",
        cnicNumber: "34567-8901234-5",
        dateOfBirth: "1992-12-03",
        nationality: "Pakistani",
        occupation: "Marketing Manager",
        emergencyContact: "Robert Miller - +1 (555) 345-6790",
        bankAccount: "****9012 - Wells Fargo",
        investmentGoal: "Wealth building",
        riskTolerance: "Aggressive",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [
            { name: "employment_letter.pdf", size: "900 KB", type: "application/pdf" },
            { name: "tax_return.pdf", size: "3.1 MB", type: "application/pdf" },
        ],
        notes: "Young professional with aggressive investment strategy.",
        lastActivity: "2024-03-22",
        totalTransactions: 12,
        averageInvestment: 7100,
    },
    {
        id: 4,
        name: "Liam Davis",
        email: "Lbeech@msn.com",
        investment: 10500,
        type: "Active",
        status: "Withdraw",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, New York, NY 10001",
        joinDate: "2024-01-15",
        cnicNumber: "12345-6789012-3",
        dateOfBirth: "1990-05-15",
        nationality: "Pakistani",
        occupation: "Software Engineer",
        emergencyContact: "Jane Davis - +1 (555) 123-4568",
        bankAccount: "****1234 - Chase Bank",
        investmentGoal: "Long-term growth",
        riskTolerance: "Moderate",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [
            { name: "bank_statement.pdf", size: "2.5 MB", type: "application/pdf" },
            { name: "salary_certificate.pdf", size: "1.8 MB", type: "application/pdf" },
        ],
        notes: "Experienced investor with good track record. Prefers technology sector investments.",
        lastActivity: "2024-03-20",
        totalTransactions: 15,
        averageInvestment: 8500,
    },
    {
        id: 5,
        name: "James Martinez",
        email: "Kludge@comcast.net",
        investment: 5000,
        type: "In-active",
        status: "Withdraw",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 234-5678",
        address: "456 Oak Ave, Los Angeles, CA 90210",
        joinDate: "2024-02-20",
        cnicNumber: "23456-7890123-4",
        dateOfBirth: "1985-08-22",
        nationality: "Pakistani",
        occupation: "Business Owner",
        emergencyContact: "Maria Martinez - +1 (555) 234-5679",
        bankAccount: "****5678 - Bank of America",
        investmentGoal: "Capital preservation",
        riskTolerance: "Conservative",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [{ name: "business_license.pdf", size: "1.2 MB", type: "application/pdf" }],
        notes: "Conservative investor, prefers stable returns.",
        lastActivity: "2024-03-18",
        totalTransactions: 8,
        averageInvestment: 6250,
    },
    {
        id: 6,
        name: "Olivia Miller",
        email: "Improv@comcast.net",
        investment: 7325,
        type: "Active",
        status: "Pending",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 345-6789",
        address: "789 Pine Rd, Chicago, IL 60601",
        joinDate: "2024-03-10",
        cnicNumber: "34567-8901234-5",
        dateOfBirth: "1992-12-03",
        nationality: "Pakistani",
        occupation: "Marketing Manager",
        emergencyContact: "Robert Miller - +1 (555) 345-6790",
        bankAccount: "****9012 - Wells Fargo",
        investmentGoal: "Wealth building",
        riskTolerance: "Aggressive",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [
            { name: "employment_letter.pdf", size: "900 KB", type: "application/pdf" },
            { name: "tax_return.pdf", size: "3.1 MB", type: "application/pdf" },
        ],
        notes: "Young professional with aggressive investment strategy.",
        lastActivity: "2024-03-22",
        totalTransactions: 12,
        averageInvestment: 7100,
    },
    {
        id: 1,
        name: "Liam Davis",
        email: "Lbeech@msn.com",
        investment: 10500,
        type: "Active",
        status: "Withdraw",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, New York, NY 10001",
        joinDate: "2024-01-15",
        cnicNumber: "12345-6789012-3",
        dateOfBirth: "1990-05-15",
        nationality: "Pakistani",
        occupation: "Software Engineer",
        emergencyContact: "Jane Davis - +1 (555) 123-4568",
        bankAccount: "****1234 - Chase Bank",
        investmentGoal: "Long-term growth",
        riskTolerance: "Moderate",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [
            { name: "bank_statement.pdf", size: "2.5 MB", type: "application/pdf" },
            { name: "salary_certificate.pdf", size: "1.8 MB", type: "application/pdf" },
        ],
        notes: "Experienced investor with good track record. Prefers technology sector investments.",
        lastActivity: "2024-03-20",
        totalTransactions: 15,
        averageInvestment: 8500,
    },
    {
        id: 2,
        name: "James Martinez",
        email: "Kludge@comcast.net",
        investment: 5000,
        type: "In-active",
        status: "Withdraw",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 234-5678",
        address: "456 Oak Ave, Los Angeles, CA 90210",
        joinDate: "2024-02-20",
        cnicNumber: "23456-7890123-4",
        dateOfBirth: "1985-08-22",
        nationality: "Pakistani",
        occupation: "Business Owner",
        emergencyContact: "Maria Martinez - +1 (555) 234-5679",
        bankAccount: "****5678 - Bank of America",
        investmentGoal: "Capital preservation",
        riskTolerance: "Conservative",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [{ name: "business_license.pdf", size: "1.2 MB", type: "application/pdf" }],
        notes: "Conservative investor, prefers stable returns.",
        lastActivity: "2024-03-18",
        totalTransactions: 8,
        averageInvestment: 6250,
    },
    {
        id: 3,
        name: "Olivia Miller",
        email: "Improv@comcast.net",
        investment: 7325,
        type: "Active",
        status: "Pending",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 345-6789",
        address: "789 Pine Rd, Chicago, IL 60601",
        joinDate: "2024-03-10",
        cnicNumber: "34567-8901234-5",
        dateOfBirth: "1992-12-03",
        nationality: "Pakistani",
        occupation: "Marketing Manager",
        emergencyContact: "Robert Miller - +1 (555) 345-6790",
        bankAccount: "****9012 - Wells Fargo",
        investmentGoal: "Wealth building",
        riskTolerance: "Aggressive",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [
            { name: "employment_letter.pdf", size: "900 KB", type: "application/pdf" },
            { name: "tax_return.pdf", size: "3.1 MB", type: "application/pdf" },
        ],
        notes: "Young professional with aggressive investment strategy.",
        lastActivity: "2024-03-22",
        totalTransactions: 12,
        averageInvestment: 7100,
    },
    {
        id: 4,
        name: "Liam Davis",
        email: "Lbeech@msn.com",
        investment: 10500,
        type: "Active",
        status: "Withdraw",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, New York, NY 10001",
        joinDate: "2024-01-15",
        cnicNumber: "12345-6789012-3",
        dateOfBirth: "1990-05-15",
        nationality: "Pakistani",
        occupation: "Software Engineer",
        emergencyContact: "Jane Davis - +1 (555) 123-4568",
        bankAccount: "****1234 - Chase Bank",
        investmentGoal: "Long-term growth",
        riskTolerance: "Moderate",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [
            { name: "bank_statement.pdf", size: "2.5 MB", type: "application/pdf" },
            { name: "salary_certificate.pdf", size: "1.8 MB", type: "application/pdf" },
        ],
        notes: "Experienced investor with good track record. Prefers technology sector investments.",
        lastActivity: "2024-03-20",
        totalTransactions: 15,
        averageInvestment: 8500,
    },
    {
        id: 5,
        name: "James Martinez",
        email: "Kludge@comcast.net",
        investment: 5000,
        type: "In-active",
        status: "Withdraw",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 234-5678",
        address: "456 Oak Ave, Los Angeles, CA 90210",
        joinDate: "2024-02-20",
        cnicNumber: "23456-7890123-4",
        dateOfBirth: "1985-08-22",
        nationality: "Pakistani",
        occupation: "Business Owner",
        emergencyContact: "Maria Martinez - +1 (555) 234-5679",
        bankAccount: "****5678 - Bank of America",
        investmentGoal: "Capital preservation",
        riskTolerance: "Conservative",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [{ name: "business_license.pdf", size: "1.2 MB", type: "application/pdf" }],
        notes: "Conservative investor, prefers stable returns.",
        lastActivity: "2024-03-18",
        totalTransactions: 8,
        averageInvestment: 6250,
    },
    {
        id: 6,
        name: "Olivia Miller",
        email: "Improv@comcast.net",
        investment: 7325,
        type: "Active",
        status: "Pending",
        avatar: "/placeholder.svg?height=32&width=32",
        phone: "+1 (555) 345-6789",
        address: "789 Pine Rd, Chicago, IL 60601",
        joinDate: "2024-03-10",
        cnicNumber: "34567-8901234-5",
        dateOfBirth: "1992-12-03",
        nationality: "Pakistani",
        occupation: "Marketing Manager",
        emergencyContact: "Robert Miller - +1 (555) 345-6790",
        bankAccount: "****9012 - Wells Fargo",
        investmentGoal: "Wealth building",
        riskTolerance: "Aggressive",
        cnic_frontImage: "/placeholder.svg?height=200&width=320",
        cnic_backImage: "/placeholder.svg?height=200&width=320",
        attachments: [
            { name: "employment_letter.pdf", size: "900 KB", type: "application/pdf" },
            { name: "tax_return.pdf", size: "3.1 MB", type: "application/pdf" },
        ],
        notes: "Young professional with aggressive investment strategy.",
        lastActivity: "2024-03-22",
        totalTransactions: 12,
        averageInvestment: 7100,
    },
]

export default function InvestorsPage() {
    const dispatch = useDispatch()
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useGlobalToast();
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedType, setSelectedType] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showImageModal, setShowImageModal] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [editingInvestor, setEditingInvestor] = useState(null)
    const [viewingInvestor, setViewingInvestor] = useState(null)
    const [deletingInvestor, setDeletingInvestor] = useState(null)
    const [investors, setInvestors] = useState([])
    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        type: "active",
        phone: "",
        email: "",
        cnic_no: "",
        phone: "",
        // password: "",
        // confirmPassword: "",
        cnic_front: null,
        cnic_back: null,
        // cnic_frontPreview: null,
        // cnic_backPreview: null,
    })
    const { postStatus, postError, postSuccessMessage } = useSelector((state) => state.postApi);
    const { data, error, successMessage } = useSelector((state) => state.api);
    const InvestorsData = Array.isArray(data?.data) ? data.data : [];



    useEffect(() => {
        // if (postStatus === "succeeded") {
        showLoader();
        dispatch(resetFetchedData())
        dispatch(fetchData(`/all-investors`)).finally(hideLoader);
        // }
    }, [dispatch, postSuccessMessage]);

    const [errors, setErrors] = useState({})
    const itemsPerPage = 8

    // Filter and search logic
    const filteredInvestors = useMemo(() => {
        return InvestorsData?.filter((investor) => {
            const matchesSearch =
                investor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                investor?.email?.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesType = selectedType === "all" || investor.type === selectedType

            return matchesSearch && matchesType
        })
    }, [searchTerm, selectedType, InvestorsData, postStatus])


    // Pagination logic
    const totalPages = Math.ceil(filteredInvestors?.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentInvestors = filteredInvestors?.slice(startIndex, endIndex)

    const validateForm = () => {
        const newErrors = {}
        const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;

        // Required field validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.amount.trim()) {
            newErrors.amount = "Investment amount is required"
        } else if (isNaN(formData.amount) || Number.parseFloat(formData.amount) <= 0) {
            newErrors.amount = "Please enter a valid amount greater than 0"
        }
        const phone = formData.phone;

        if (!formData.phone || !formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        }
        // else if (!/^\d+$/.test(phone)) {
        //     newErrors.phone = "Phone number must contain only digits";
        // }
        else if (phone.length < 11 || phone.length > 20) {
            newErrors.phone = "Phone number must be between 11 and 15 digits";
        }

        if (!formData.cnic_no || !formData.cnic_no.trim()) {
            newErrors.cnic_no = "CNIC number is required";
        }
        // else if (!cnicRegex.test(formData.cnic_no.trim())) {
        //     newErrors.cnic_no = "Invalid CNIC format. Use 12345-1234567-1";
        // }

        if (!formData.cnic_front) {
            newErrors.cnic_front = "CNIC front image is required"
        }

        if (!formData.cnic_back) {
            newErrors.cnic_back = "CNIC back image is required"
        }


        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSearch = () => {
        setCurrentPage(1)
    }

    const handleTypeChange = (value) => {
        setSelectedType(value)
        setCurrentPage(1)
    }

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "Withdraw":
                return "default"
            case "Pending":
                return "secondary"
            case "Requested":
                return "destructive"
            default:
                return "default"
        }
    }

    const getTypeBadgeVariant = (type) => {
        return type === "Active" ? "default" : "secondary"
    }

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }

    const handlePageClick = (page) => {
        setCurrentPage(page)
    }

    const handleDeleteInvestor = (investorId, investorName) => {
        setDeletingInvestor({ id: investorId, name: investorName })
        setShowDeleteDialog(true)
    }

    const confirmDelete = () => {
        if (deletingInvestor) {
            setInvestors((prev) => prev.filter((investor) => investor.id !== deletingInvestor.id))
            setShowDeleteDialog(false)
            setDeletingInvestor(null)
            alert(`${deletingInvestor.name} has been deleted successfully!`)
        }
    }

    const handleEditInvestor = (investorId) => {
        const investor = InvestorsData.find((inv) => inv.id === investorId)
        if (investor) {
            setEditingInvestor(investor)
            setFormData({
                name: investor.name.split(" ")[0] || "",
                amount: investor.amount.toString(),
                type: investor.type,
                email: investor.email,
                phone: investor.phone,
                cnic_no: investor.cnic_no,
                cnic_front: investor.cnic_front,
                cnic_back: investor.cnic_back,
                cnic_frontPreview: investor.cnic_front,
                cnic_backPreview: investor.cnic_back,
            })
            setErrors({})
            setShowEditModal(true)
        }
    }

    const handleViewDetail = (investorId) => {
        const investor = data?.data?.find((inv) => inv.id === investorId)
        if (investor) {
            setViewingInvestor(investor)
            setShowViewModal(true)
        }
    }

    const handleAddNew = () => {
        setFormData({
            name: "",
            amount: "",
            type: "active",
            phone: "",
            email: "",
            cnic_no: "",
            phone: "",
            // password: "",
            // confirmPassword: "",
            cnic_front: null,
            cnic_back: null,
            // cnic_frontPreview: null,
            // cnic_backPreview: null,

        })
        setErrors({})
        setShowAddModal(true)
    }

    const handleInputChange = (field, value) => {
        if (field === "amount") {
            setFormData((prev) => ({
                ...prev,
                amount: value,
                type: Number(value) > 5000 ? "active" : "inactive",
            }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }))
        }
    }

    const handleFileUpload = (field, file) => {
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setFormData((prev) => ({
                    ...prev,
                    [field]: file,
                    [`${field}Preview`]: e.target.result,
                }))
            }
            reader.readAsDataURL(file)

            // Clear error when file is uploaded
            if (errors[field]) {
                setErrors((prev) => ({
                    ...prev,
                    [field]: "",
                }))
            }
        }
    }

    const handleAttachmentUpload = (files) => {
        const fileArray = Array.from(files)
        setFormData((prev) => ({
            ...prev,
            attachments: [...prev.attachments, ...fileArray],
        }))
    }

    const removeAttachment = (index) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }))
    }

    const handleImageClick = (imageUrl, title) => {
        setSelectedImage({ url: imageUrl, title })
        setShowImageModal(true)
    }

    // const handleSubmit = async () => {


    //     // console.log("hellowg", validateForm());

    //     if (!validateForm()) {
    //         return;
    //     }
    //     // console.log("hellowg");

    //     // return
    //     showLoader();

    //     try {
    //         const result = await dispatch(postData({ endpoint: `/register`, payload: formData }));
    //         console.log(result);

    //         // Only hide modal and show success if request succeeded
    //         setShowAddModal(false);
    //         setShowEditModal(false);
    //         setEditingInvestor(null);
    //         dispatch(resetPostStatus())
    //         hideLoader();
    //         showToast(
    //             editingInvestor
    //                 ? "Investor updated successfully!"
    //                 : "Investor created successfully!",
    //             "success"
    //         );

    //     } catch (error) {
    //         console.log(error);

    //         // showToast("Something went wrong while submitting the form.", "error");
    //         // console.error("Form submission error:", error);
    //     }
    //     return;
    // };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        showLoader();

        try {
            // Prepare FormData and remove preview fields
            const submitData = new FormData();
            for (const key in formData) {
                if (!key.includes("Preview")) {
                    submitData.append(key, formData[key]);
                }
            }
            let result;
            editingInvestor ? await dispatch(postData({ endpoint: `/investors/${editingInvestor?.id}/profile`, payload: submitData })) : await dispatch(postData({ endpoint: `/register`, payload: submitData }))

            // Only hide modal and show success if request succeeded
            setShowAddModal(false);
            setShowEditModal(false);
            setEditingInvestor(null);
            dispatch(resetPostStatus());
            hideLoader();

            showToast(
                editingInvestor ? "Investor updated successfully!" : "Investor created successfully!",
                "success"
            );
        } catch (error) {
            console.log(error);
            // Optionally show error toast
            // showToast("Something went wrong while submitting the form.", "error");
        }
    };

    const closeModal = () => {
        setShowAddModal(false)
        setShowEditModal(false)
        setShowViewModal(false)
        setShowImageModal(false)
        setShowDeleteDialog(false)
        setEditingInvestor(null)
        setViewingInvestor(null)
        setSelectedImage(null)
        setDeletingInvestor(null)
        setErrors({})
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <DashboardLayout>
            <div className="p-6 md:px-12 space-y-6 bg-white min-h-screen">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold text-gray-900">Investors</h1>
                    <p className="text-gray-600">
                        Manage and oversee detailed profiles, investments, and activities of all registered investors efficiently.
                    </p>
                </div>

                {/* Search and Filter */}
                <SearchAndFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedType={selectedType}
                    setSelectedType={handleTypeChange}
                    onSearch={handleSearch}
                    onAddNew={handleAddNew}
                />

                {/* Table */}
                <InvestorTable
                    investors={currentInvestors}
                    onEdit={handleEditInvestor}
                    onDelete={handleDeleteInvestor}
                    onViewDetail={handleViewDetail}
                    getStatusBadgeVariant={getStatusBadgeVariant}
                    getTypeBadgeVariant={getTypeBadgeVariant}
                />

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredInvestors?.length}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                    onPageClick={handlePageClick}
                />

                {/* Add/Edit Modal */}
                <AddEditInvestorModal
                    isOpen={showAddModal || showEditModal}
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                    editingInvestor={editingInvestor}
                    formData={formData}
                    setFormData={setFormData}
                    loading={postStatus}
                    errors={errors}
                    onInputChange={handleInputChange}
                    onFileUpload={handleFileUpload}
                    onAttachmentUpload={handleAttachmentUpload}
                    removeAttachment={removeAttachment}
                    formatFileSize={formatFileSize}
                />

                {/* View Details Modal */}
                <ViewDetailsModal
                    isOpen={showViewModal}
                    onClose={closeModal}
                    investor={viewingInvestor}
                    onEdit={handleEditInvestor}
                    onImageClick={handleImageClick}
                    getStatusBadgeVariant={getStatusBadgeVariant}
                    getTypeBadgeVariant={getTypeBadgeVariant}
                />

                {/* Image Preview Modal */}
                <ImagePreviewModal isOpen={showImageModal} onClose={closeModal} image={selectedImage} />

                {/* Delete Confirmation Dialog */}
                <DeleteConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={closeModal}
                    onConfirm={confirmDelete}
                    investorName={deletingInvestor?.name || ""}
                />
            </div>
        </DashboardLayout>
    )
}
