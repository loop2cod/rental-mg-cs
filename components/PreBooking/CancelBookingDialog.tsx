"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";

interface CancelBookingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelBooking: (remarks: string) => Promise<void>;
  isCancelling: boolean;
}

export const CancelBookingDialog = ({
  isOpen,
  onOpenChange,
  onCancelBooking,
  isCancelling,
}: CancelBookingDialogProps) => {
  const [remarks, setRemarks] = useState("");

  const handleSubmit = async () => {
    await onCancelBooking(remarks);
    setRemarks("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Please provide a reason for cancellation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Enter remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setRemarks("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSubmit}
            disabled={!remarks || isCancelling}
          >
            {isCancelling ? "Processing..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};