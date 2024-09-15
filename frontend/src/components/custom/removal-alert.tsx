import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from 'react'
import { toast } from "@/components/ui/use-toast"

interface RemovalAlertProps {
  itemName: string;
  itemType: string;
  description: string;
  onConfirmRemoval: () => Promise<void>;
}

export default function RemovalAlert({
  itemName,
  itemType,
  description,
  onConfirmRemoval
}: RemovalAlertProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemoval = async () => {
    setIsRemoving(true)
    try {
      await onConfirmRemoval()
      toast({
        title: `${itemType} Removed`,
        description: `${itemName} has been successfully removed.`,
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to remove ${itemType.toLowerCase()}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">
            {`Delete ${itemType.toLowerCase()}`}
          </span>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoval} disabled={isRemoving}>
            {isRemoving ? `Removing ${itemType.toLowerCase()}...` : `Yes, remove ${itemType.toLowerCase()}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
