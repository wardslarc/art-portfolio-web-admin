import React from "react";
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
import { Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  artworkTitle?: string;
}

const DeleteConfirmationModal = ({
  isOpen = true,
  onClose = () => {},
  onConfirm = () => {},
  artworkTitle = "Untitled Artwork",
}: DeleteConfirmationModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl font-bold text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Artwork
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2 text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-medium">'{artworkTitle}'</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-gray-300 bg-white hover:bg-gray-100">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;
