/**
 * v0 by Vercel.
 * @see https://v0.dev/t/8tcCdlgPTSK
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 * placeholder="Please enter the name of country....."
 */
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function InputWithButton({ ButtonText, Placeholder, InputLabel, InputValue, onInputChange, onButtonClick }) {
    return (
        <div className="relative w-full h-12">
            <Input type="text" placeholder={Placeholder} className="w-full h-12 rounded-none" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-auto mx-3 p-3 text-white hover:text-white hover:bg-[#1A77F8]  bg-[#1A77F8] rounded-none"
                onClick={() => { }}
            >
                {/* <XIcon className="h-4 w-4" /> */}
                {/* <span className="sr-only">Clear</span> */}
                {ButtonText}
            </Button>
        </div>
    )
}

function XIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}