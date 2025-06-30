import { useEffect, useState } from "react";
import { Search, X, DollarSign, TrendingUp, Users, UserX, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { postData } from "@/redux/PostApiSlice/Index";
import ViewDetailsModal from "../Investors/ViewInvestor";
import ImagePreviewModal from "../Investors/ImagePreview";
import { fetchGetData } from "@/redux/GetApiSlice/GetSlice";
import { useLoader } from "@/context/LoaderContext";
import { useGlobalToast } from "@/context/ToastContext";
import { getDate } from "date-fns";

// Custom components since we can't import from shadcn
const Button = ({ children, className = "", variant = "default", size = "default", disabled = false, onClick, ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        default: "bg-blue-500 text-white hover:bg-blue-600",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200"
    };
    const sizes = {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs"
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

const Card = ({ children, className = "", ...props }) => (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`} {...props}>
        {children}
    </div>
);

const Badge = ({ children, variant = "default", className = "", ...props }) => {
    const variants = {
        default: "bg-blue-500 text-white",
        secondary: "bg-gray-500 text-white"
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`} {...props}>
            {children}
        </span>
    );
};

const Avatar = ({ children, className = "", ...props }) => (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props}>
        {children}
    </div>
);

const AvatarImage = ({ src, alt, ...props }) => (
    <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" {...props} />
);

const AvatarFallback = ({ children, className = "", ...props }) => (
    <div className={`flex h-full w-full items-center justify-center bg-gray-100 text-gray-600 ${className}`} {...props}>
        {children}
    </div>
);

const Input = ({ className = "", ...props }) => (
    <input
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);

const Label = ({ children, className = "", ...props }) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
        {children}
    </label>
);

const Tabs = ({ children, value, onValueChange, className = "", ...props }) => {
    return (
        <div className={`w-full ${className}`} {...props}>
            {children}
        </div>
    );
};

const TabsList = ({ children, className = "", ...props }) => (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 w-full ${className}`} {...props}>
        {children}
    </div>
);

const TabsTrigger = ({ children, value, className = "", ...props }) => (
    <button
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm flex-1 ${className}`}
        {...props}
    >
        {children}
    </button>
);

const TabsContent = ({ children, value, className = "", ...props }) => (
    <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`} {...props}>
        {children}
    </div>
);

const Table = ({ children, className = "", ...props }) => (
    <div className="w-full overflow-auto">
        <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
            {children}
        </table>
    </div>
);

const TableHeader = ({ children, ...props }) => (
    <thead className="border-b" {...props}>
        {children}
    </thead>
);

const TableBody = ({ children, ...props }) => (
    <tbody className="[&_tr:last-child]:border-0" {...props}>
        {children}
    </tbody>
);

const TableRow = ({ children, className = "", ...props }) => (
    <tr className={`border-b transition-colors hover:bg-gray-50 ${className}`} {...props}>
        {children}
    </tr>
);

const TableHead = ({ children, className = "", ...props }) => (
    <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 ${className}`} {...props}>
        {children}
    </th>
);

const TableCell = ({ children, className = "", ...props }) => (
    <td className={`p-4 align-middle ${className}`} {...props}>
        {children}
    </td>
);

const investors = [
    { id: "1", name: "Smith Johnson", amount: "$10,500", status: "Active", img: "/avatars/smith.jpg", roi: "8.5%" },
    { id: "2", name: "Timothy Russell", amount: "$3,250", status: "In-active", img: "/avatars/timothy.jpg", roi: "0%" },
    { id: "3", name: "Lucas Willie", amount: "$8,750", status: "Active", img: "/avatars/lucas.jpg", roi: "12.3%" },
    { id: "4", name: "Mason Vincent", amount: "$8,750", status: "Active", img: "", fallback: "M", roi: "9.7%" },
    { id: "5", name: "Wayne Lawrence", amount: "$10,500", status: "Active", img: "/avatars/wayne.jpg", roi: "11.2%" },
    { id: "6", name: "Emma Watson", amount: "$5,200", status: "In-active", img: "/avatars/emma.jpg", roi: "0%" },
    { id: "7", name: "John Doe", amount: "$6,500", status: "Active", img: "/avatars/john.jpg", roi: "7.8%" },
    { id: "8", name: "Sarah Wilson", amount: "$4,800", status: "In-active", img: "/avatars/sarah.jpg", roi: "0%" },
    { id: "9", name: "Michael Brown", amount: "$12,000", status: "Active", img: "/avatars/michael.jpg", roi: "10.5%" },
];

export default function ManageProfitScreen({ Dashboarddata }) {
    const dispatch = useDispatch();
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useGlobalToast();
    const [showManageProfit, setShowManageProfit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("active");
    const [searchTerm, setSearchTerm] = useState("");
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [viewingInvestor, setViewingInvestor] = useState(null)
    const [roiPercentage, setRoiPercentage] = useState("4");
    const [selectedActiveInvestors, setSelectedActiveInvestors] = useState([]);
    const [selectedInactiveInvestors, setSelectedInactiveInvestors] = useState([]);
    const [profitSentInvestors, setProfitSentInvestors] = useState([]);
    const { postStatus, postError, postSuccessMessage } = useSelector((state) => state.postApi);
    const { getdata, status, error, successMessage } = useSelector((state) => state.getapi);
    const GetInvestorForProfit = Array.isArray(getdata?.data) ? getdata?.data : [];
    const ROWS_PER_PAGE = 10;

    useEffect(() => {
        showLoader()
        dispatch(fetchGetData("/investors/profit")).finally(hideLoader)
    }, [dispatch, postSuccessMessage])

    // Filter investors based on status and search term
    const filteredInvestors = GetInvestorForProfit?.filter(investor => {
        const matchesStatus = activeTab === "active" ? investor.type === "active" : investor.type === "inactive";
        const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            investor.amount.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const totalPages = Math.ceil(filteredInvestors?.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const paginatedInvestors = filteredInvestors?.slice(startIndex, startIndex + ROWS_PER_PAGE);

    const activeInvestors = GetInvestorForProfit?.filter(inv => inv.type === "active");
    const inactiveInvestors = GetInvestorForProfit?.filter(inv => inv.type === "inactive");

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

    const handleViewDetail = (investor) => {
        // const investor = data?.data?.find((inv) => inv.id === investorId)
        // if (investor) {
        console.log("hellow");

        setViewingInvestor(investor)
        setShowViewModal(true)
        // }
    }

    const handleImageClick = (imageUrl, title) => {
        setSelectedImage({ url: imageUrl, title })
        setShowImageModal(true)
    }

    const handleSelectActiveInvestor = (investorName) => {
        // Don't allow selection if profit already sent
        if (profitSentInvestors.includes(investorName)) return;

        setSelectedActiveInvestors(prev =>
            prev.includes(investorName)
                ? prev.filter(name => name !== investorName)
                : [...prev, investorName]
        );
    };

    const handleSelectInactiveInvestor = (investorName) => {
        // Don't allow selection if profit already sent
        if (profitSentInvestors.includes(investorName)) return;

        setSelectedInactiveInvestors(prev =>
            prev.includes(investorName)
                ? prev.filter(name => name !== investorName)
                : [...prev, investorName]
        );
    };

    // const handleApplyROI = () => {
    //     const allSelected = [...selectedActiveInvestors, ...selectedInactiveInvestors];
    //     console.log(`Applying ${roiPercentage}% ROI to:`, allSelected);
    //     setSelectedActiveInvestors([]);
    //     setSelectedInactiveInvestors([]);
    //     setShowManageProfit(false);
    //     // Here you would typically make an API call to update the ROI
    // };

    const handleSendProfit = () => {
        console.log(selectedActiveInvestors);

        const allSelected = [...selectedActiveInvestors, ...selectedInactiveInvestors];
        console.log(`Sending profit to:`, allSelected);

        const Payload = {
            percentage: roiPercentage,
            user_ids: activeTab == "active" ? selectedActiveInvestors : selectedInactiveInvestors,
        }
        dispatch(postData({ endpoint: `/calculate-profit`, payload: Payload }));
        // Add selected investors to profit sent list
        setProfitSentInvestors(prev => [...prev, ...allSelected]);

        // Clear selections
        setSelectedActiveInvestors([]);
        setSelectedInactiveInvestors([]);

        // Here you would typically make an API call to send profits
        alert(`Profit sent to ${allSelected.length} investor(s)`);
    };

    if (!showManageProfit) {
        return (
            <Card className="p-6 rounded-2xl shadow-md h-[100%]">
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Investors</h2>
                        <p className="text-gray-500 mb-4">View and manage all users who have invested.</p>
                    </div>
                    <Button
                        className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                        onClick={() => setShowManageProfit(true)}
                    >
                        Manage Profit
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/3">Investors Name</TableHead>
                            <TableHead className="w-1/4">Amount</TableHead>
                            <TableHead className="w-1/4">Investment Type</TableHead>
                            <TableHead className="w-1/5 text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Dashboarddata?.latest_investors?.slice(0, 5).map((investor, index) => (
                            <TableRow key={index}>
                                <TableCell className="flex items-center space-x-3">

                                    <span>{investor.name}</span>
                                </TableCell>
                                <TableCell className="text-blue-600 font-medium">$ {investor.amount}</TableCell>
                                <TableCell>
                                    <Badge variant={investor.status === "Active" ? "default" : "secondary"} className={investor.type === "inactive" ? "bg-gray-500" : "bg-blue-500"}>
                                        {investor.type.charAt(0).toUpperCase() + investor.type.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button onClick={() => handleViewDetail(investor)} variant="outline" size="sm">View Detail</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* View Details Modal */}
                <ViewDetailsModal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    investor={viewingInvestor}
                    onImageClick={handleImageClick}
                    getStatusBadgeVariant={getStatusBadgeVariant}
                // getTypeBadgeVariant={getTypeBadgeVariant}
                />
                {/* Image Preview Modal */}
                <ImagePreviewModal isOpen={showImageModal} onClose={() => setShowImageModal(false)} image={selectedImage} />
            </Card>
        );
    }


    return (
        <Card className="p-6 rounded-2xl shadow-md min-h-[600px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-blue-500" />
                        Manage Investor Profits (ROI)
                    </h2>
                    <p className="text-gray-500 mt-1">Set ROI percentage and apply to selected active investors. Use the tabs to manage active and inactive users separately.</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowManageProfit(false)}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                    <X className="w-4 h-4 mr-2" />
                    Close
                </Button>
            </div>

            {/* ROI Settings */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <Label htmlFor="roi" className="text-sm font-medium text-blue-900">ROI Percentage</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            id="roi"
                            type="number"
                            value={roiPercentage}
                            onChange={(e) => setRoiPercentage(e.target.value)}
                            className="w-20 h-8"
                            min="0"
                            max="100"
                            step="0.1"
                        />
                        <span className="text-sm text-blue-700">%</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <Card
                    onClick={() => setActiveTab("active")}
                    className={`p-4 bg-green-50 ${activeTab === "active" ? "border-2 border-green-600" : "border border-green-200"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-green-600 font-medium">Active Users</p>
                            <p className="text-2xl font-bold text-green-700">{activeInvestors?.length}</p>
                        </div>
                    </div>
                </Card>

                <Card
                    onClick={() => setActiveTab("inactive")}
                    className={`p-4 bg-gray-50 ${activeTab === "inactive" ? "border-2 border-gray-600" : "border border-gray-200"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                            <UserX className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium">In-Active Users</p>
                            <p className="text-2xl font-bold text-gray-700">{inactiveInvestors?.length}</p>
                        </div>
                    </div>
                </Card>
            </div>


            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    placeholder="Search investors by name or amount..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Tabs */}
            <div className="w-full">
                {/* <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 w-full mb-6"> */}
                {/* <button */}
                {/* className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all flex-1 ${activeTab === "active" */}
                {/* ? "bg-white text-gray-950 shadow-sm" */}
                {/* : "text-gray-600 hover:text-gray-900" */}
                {/* }`} */}
                {/* onClick={() => setActiveTab("active")} */}
                {/* > */}
                {/* <Users className="w-4 h-4 mr-2" /> */}
                {/* Active Investors ({activeInvestors.length}) */}
                {/* </button> */}
                {/* <button */}
                {/* className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all flex-1 ${activeTab === "inactive" */}
                {/* ? "bg-white text-gray-950 shadow-sm" */}
                {/* : "text-gray-600 hover:text-gray-900" */}
                {/* }`} */}
                {/* onClick={() => setActiveTab("inactive")} */}
                {/* > */}
                {/* <UserX className="w-4 h-4 mr-2" /> */}
                {/* In-Active Investors ({inactiveInvestors.length}) */}
                {/* </button> */}
                {/* </div> */}

                {activeTab === "active" && (
                    <InvestorTable
                        investors={paginatedInvestors}
                        selectedInvestors={selectedActiveInvestors}
                        onSelectInvestor={handleSelectActiveInvestor}
                        showSelection={true}
                        profitSentInvestors={profitSentInvestors}
                        onview={() => handleViewDetail()}
                    />
                )}

                {activeTab === "inactive" && (
                    <InvestorTable
                        investors={paginatedInvestors}
                        selectedInvestors={selectedInactiveInvestors}
                        onSelectInvestor={handleSelectInactiveInvestor}
                        showSelection={true}
                        profitSentInvestors={profitSentInvestors}
                        onview={() => handleViewDetail()}
                    />
                )}
                {/* {/* View Details Modal */}
                <ViewDetailsModal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    investor={viewingInvestor}
                    onImageClick={handleImageClick}
                    getStatusBadgeVariant={getStatusBadgeVariant}
                // getTypeBadgeVariant={getTypeBadgeVariant}
                />
                {/* Image Preview Modal */}
                <ImagePreviewModal isOpen={showImageModal} onClose={() => setShowImageModal(false)} image={selectedImage} />
            </div>

            {/* Pagination */}
            {filteredInvestors?.length > ROWS_PER_PAGE && (
                <div className="flex justify-between items-center mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages} ({filteredInvestors.length} investors)
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Action Buttons for Selected Investors */}
            {(selectedActiveInvestors?.length > 0 || selectedInactiveInvestors?.length > 0) && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-blue-900">
                                {selectedActiveInvestors.length + selectedInactiveInvestors.length} investor(s) selected
                            </p>
                            <div className="text-sm text-blue-700 mt-1">
                                {selectedActiveInvestors.length > 0 && (
                                    <span className="mr-4">Active: {selectedActiveInvestors.length}</span>
                                )}
                                {selectedInactiveInvestors.length > 0 && (
                                    <span>Inactive: {selectedInactiveInvestors.length}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSelectedActiveInvestors([]);
                                    setSelectedInactiveInvestors([]);
                                }}
                            >
                                Clear Selection
                            </Button>
                            <Button
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={handleSendProfit}
                                disabled={postStatus === "loading"} // Disable while loading
                            >
                                {postStatus === "loading" ? (
                                    <span className="flex items-center">
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    <>
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Send Profit
                                    </>
                                )}
                            </Button>

                            {/* {selectedActiveInvestors.length > 0 && ( */}
                            {/* <Button */}
                            {/* className="bg-blue-500 hover:bg-blue-600 text-white" */}
                            {/* onClick={handleApplyROI} */}
                            {/* > */}
                            {/* <TrendingUp className="w-4 h-4 mr-2" /> */}
                            {/* Apply ROI ({roiPercentage}%) */}
                            {/* </Button> */}
                            {/* )} */}
                        </div>
                    </div>
                </div>
            )}


        </Card>
    );
}

function InvestorTable({ onview, investors, selectedInvestors, onSelectInvestor, showSelection, profitSentInvestors = [] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {showSelection && <TableHead className="w-12">Select</TableHead>}
                    <TableHead>Investors Name</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Investment Type</TableHead>
                    {/* <TableHead className="text-right">Action</TableHead> */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {investors?.map((investor, index) => {
                    // const isProfitSent = profitSentInvestors.includes(investor.id);
                    const isProfitSent = investor?.profit_status == "Paid";
                    const isSelected = selectedInvestors.includes(investor.id);

                    return (
                        <TableRow key={index} className={isProfitSent ? "bg-green-50" : ""}>
                            {showSelection && (
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={isProfitSent || isSelected}
                                        onChange={() => onSelectInvestor(investor.id)}
                                        disabled={isProfitSent}
                                        className={`w-4 h-4 rounded focus:ring-blue-500 ${isProfitSent
                                            ? "text-green-600 cursor-not-allowed opacity-75"
                                            : "text-blue-600 cursor-pointer"
                                            }`}
                                    />
                                </TableCell>
                            )}
                            <TableCell>
                                <div className="flex items-center space-x-3">

                                    <span className={`font-medium ${isProfitSent ? "text-green-700" : ""}`}>
                                        {investor.name}
                                        {isProfitSent && (
                                            <span className="ml-2 text-xs text-green-600 font-normal">
                                                ✓ Profit Sent
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-blue-600 font-medium">{investor.amount}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={isProfitSent ? "default" : "secondary"}
                                // className={isProfitSent ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                                >
                                    {isProfitSent ? "Profit Sent" : "Un-Paid"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={investor.type === "active" ? "default" : "secondary"}
                                    className={
                                        investor.status === "Active"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-500 text-white"
                                    }
                                >
                                    {investor.type}
                                </Badge>
                            </TableCell>
                            {/* <TableCell className="text-right"> */}
                            {/* <Button onClick={() => onview(investor)} variant="outline" size="sm"> */}
                            {/* View Details */}
                            {/* </Button> */}
                            {/* </TableCell> */}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}