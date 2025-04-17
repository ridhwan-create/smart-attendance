// resources/js/components/confirm-delete.tsx
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction } from '@/components/ui/alert-dialog';

interface ConfirmDeleteProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDelete({
  open,
  title,
  description,
  onConfirm,
  onClose,
}: ConfirmDeleteProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
