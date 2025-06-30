import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { format } from "date-fns"

const transactionData = [
    {
        cycle: "Cycle #4",
        type: "Withdraw",
        amount: "$5,500",
        roi: "$52",
        date: "02 Jul 2025",
        action: true,
        typeColor: "text-gray-700",
    },
    {
        cycle: "Cycle #3",
        type: "Reinvest",
        amount: "$3,000",
        roi: "$50",
        date: "16 May 2025",
        action: false,
        typeColor: "text-blue-600 font-medium",
    },
    {
        cycle: "Cycle #2",
        type: "New Invest",
        amount: "$10,000",
        roi: "$80",
        date: "01 April 2025",
        action: false,
        typeColor: "text-red-500 font-medium",
    },
    {
        cycle: "Cycle #1",
        type: "Withdraw",
        amount: "$15,000",
        roi: "$200",
        date: "17 Feb 2025",
        action: false,
        typeColor: "text-gray-700",
    },
]

export function TransactionDetails({ data }) {
    console.log(data);

    const transactions = data?.investment_requests || [];
    const getBankDetails = (row) => {
        const adminTypes = ["capital_withdraw", "Re-invest"];
        const bank = adminTypes.includes(row.request_type) ? row.admin_bank : row.user_bank;

        if (!bank) return <span className="text-xs text-muted-foreground italic">N/A</span>;

        return (
            <div className="text-xs space-y-1 leading-tight">
                <div><strong>{bank.bank_name}</strong></div>
                <div>Account: {bank.account_holder_name}</div>
                <div>IBAN: {bank.iban}</div>
                <div>CNIC: {bank.cnic}</div>
            </div>
        );
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "Re-invest":
                return "text-blue-600 font-medium";
            case "capital_withdraw":
                return "text-red-600 font-medium";
            case "Withdraw-profit":
                return "text-green-600 font-medium";
            case "new_invest":
                return "text-yellow-600 font-medium";
            default:
                return "text-gray-700";
        }
    };

    return (
        <div className="overflow-x-auto rounded-lg border mt-4">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted">
                        <TableHead>Cycle</TableHead>
                        <TableHead>Request Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>Bank Details</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length ? (
                        transactions.map((tx, idx) => (
                            <TableRow key={idx}>
                                <TableCell>Cycle #{tx.cycle_id}</TableCell>
                                <TableCell>
                                    <span className={`${getTypeColor(tx.request_type)} capitalize`}>
                                        {tx.request_type.replace(/_/g, " ")}
                                    </span>
                                </TableCell>
                                <TableCell>${tx.amount}</TableCell>
                                <TableCell>
                                    {tx.profit ? `$${tx.profit}` : "--"}
                                </TableCell>
                                <TableCell>{getBankDetails(tx)}</TableCell>
                                <TableCell>
                                    {tx.created_at
                                        ? format(new Date(tx.created_at), "dd-MM-yyyy")
                                        : "--"}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
