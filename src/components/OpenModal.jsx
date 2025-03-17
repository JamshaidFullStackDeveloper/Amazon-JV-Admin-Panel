import React, { Children } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

const CustomModal = ({
    isOpen,
    onClose,
    triggerText = "Open Modal",
    Children,
    width
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogTrigger asChild>
                <Button variant="outline">{triggerText}</Button>
            </DialogTrigger>
            <DialogContent className={`h-[90%] sm:max-w-fit overflow-y-auto`}>
                {Children}
            </DialogContent>
        </Dialog>
    );
};

export default CustomModal;
