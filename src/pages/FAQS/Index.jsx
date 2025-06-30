"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Plus, Edit, Trash2, HelpCircle, Loader2 } from "lucide-react"
import DashboardLayout from "@/layouts/Layout"
import { useDispatch, useSelector } from "react-redux"
import { useLoader } from "@/context/LoaderContext"
import { useGlobalToast } from "@/context/ToastContext"
import { fetchData, resetFetchedData } from "@/redux/GetApiSlice/Index"
import { postData, resetPostState, resetPostStatus } from "@/redux/PostApiSlice/Index"
import { deleteData, resetDeleteStatus } from "@/redux/DeleteApiSlice"

export default function FAQPage() {
    const dispatch = useDispatch()
    const { showLoader, hideLoader } = useLoader();
    const { showToast } = useGlobalToast();
    const [faqs, setFaqs] = useState([])
    const [filteredFaqs, setFilteredFaqs] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedFaq, setSelectedFaq] = useState(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { postStatus, postError, postSuccessMessage } = useSelector((state) => state.postApi);
    const { data, error, successMessage } = useSelector((state) => state.api);
    const { deleteStatus, deleteError, deleteSuccessMessage, } = useSelector((state) => state.deleteApi);

    console.log(data);

    // Form state
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
    })
    // console.log();


    useEffect(() => {
        // if (postStatus === "succeeded") {
        showLoader();
        dispatch(resetFetchedData())
        dispatch(fetchData(`/faqs`)).finally(hideLoader);
        // }
    }, [dispatch, postSuccessMessage, postStatus]);

    useEffect(() => {

        if (postStatus == "succeeded") {
            setIsAddDialogOpen(false)
            setIsEditDialogOpen(false)
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

    // Mock data - Replace with actual API calls
    const mockFaqs = data?.data;
    // Load FAQs on component mount
    useEffect(() => {
        loadFaqs()
    }, [data])

    // Filter FAQs based on search
    useEffect(() => {
        let filtered = faqs

        if (searchTerm) {
            filtered = filtered.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        setFilteredFaqs(filtered)
    }, [faqs, searchTerm])

    // API Functions - Replace these with your actual API calls
    const loadFaqs = async () => {
        setLoading(true)
        try {
            // Replace with: const response = await fetch('/api/faqs')
            // const data = await response.json()
            // setFaqs(data)

            // Mock API call
            setTimeout(() => {
                setFaqs(mockFaqs)
                setLoading(false)
            }, 500)
        } catch (error) {
            console.error("Error loading FAQs:", error)
            setLoading(false)
        }
    }

    const createFaq = async (faqData) => {
        try {
            dispatch(postData({ endpoint: `/faqs`, payload: faqData }));

        } catch (error) {
            showToast(postError, "error")
            console.error("Error creating FAQ:", error)
        }
    }

    const updateFaq = async (id, faqData) => {
        try {
            dispatch(postData({ endpoint: `/faq/${id}`, payload: faqData }));

        } catch (error) {
            showToast(postError, "error")
            console.error("Error updating FAQ:", error)
            dispatch(resetPostStatus())

        }
    }

    const deleteFaq = async (id) => {
        try {
            dispatch(deleteData({ endpoint: `/faqs/${id}` })).finally(
                dispatch(resetDeleteStatus())
            )
        } catch (error) {
            console.error("Error deleting FAQ:", error)
        }
    }

    const resetForm = () => {
        setFormData({
            question: "",
            answer: "",
        })
    }

    const handleAdd = () => {
        resetForm()
        setIsAddDialogOpen(true)
    }

    const handleEdit = (faq) => {
        setFormData({
            question: faq.question,
            answer: faq.answer,
        })
        setSelectedFaq(faq)
        setIsEditDialogOpen(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedFaq) {
            updateFaq(selectedFaq.id, formData)
        } else {
            createFaq(formData)
        }
    }

    return (
        <DashboardLayout>
            <div className=" mx-auto p-6 md:px-14 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">FAQ Management</h1>
                        <p className="text-muted-foreground">Manage your frequently asked questions</p>
                    </div>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add FAQ
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Search FAQs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search questions or answers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* FAQ List with Accordion */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            FAQs ({filteredFaqs?.length})
                        </CardTitle>
                        <CardDescription>Click on any question to view the answer</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : filteredFaqs?.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">No FAQs found</p>
                                <p className="text-sm">Try adjusting your search or add a new FAQ</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Accordion type="multiple" className="w-full">
                                    {filteredFaqs?.map((faq) => (
                                        <AccordionItem key={faq.id} value={`item-${faq.id}`} className="border rounded-lg px-4">
                                            <div className="flex items-center justify-between">
                                                <AccordionTrigger className="flex-1 text-left hover:no-underline">
                                                    <div className="flex items-start gap-3 py-2">
                                                        <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                                                            <span className="text-xs font-medium text-primary">Q</span>
                                                        </div>
                                                        <span className="font-medium text-sm sm:text-base">{faq.question}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleEdit(faq)
                                                        }}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete this FAQ? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => deleteFaq(faq.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    {postStatus === "loading" ? (
                                                                        <span className="flex items-center justify-center gap-2">
                                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                                            Processing...
                                                                        </span>
                                                                    ) : ("Delete")}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                            <AccordionContent className="pb-4">
                                                <div className="flex items-start gap-3 pl-9">
                                                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                        <span className="text-xs font-medium text-green-700">A</span>
                                                    </div>
                                                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Add FAQ Dialog */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Add New FAQ</DialogTitle>
                            <DialogDescription>Create a new frequently asked question and answer.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="question">Question</Label>
                                <Input
                                    id="question"
                                    placeholder="Enter the question..."
                                    value={formData.question}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="answer">Answer</Label>
                                <Textarea
                                    id="answer"
                                    placeholder="Enter the answer..."
                                    value={formData.answer}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
                                    rows={6}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">   {postStatus === "loading" ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </span>
                                ) : ("Add FAQ")}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit FAQ Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit FAQ</DialogTitle>
                            <DialogDescription>Update the frequently asked question and answer.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-question">Question</Label>
                                <Input
                                    id="edit-question"
                                    placeholder="Enter the question..."
                                    value={formData.question}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-answer">Answer</Label>
                                <Textarea
                                    id="edit-answer"
                                    placeholder="Enter the answer..."
                                    value={formData.answer}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
                                    rows={6}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">  {postStatus === "loading" ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </span>
                                ) : ("Update FAQ")}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}
