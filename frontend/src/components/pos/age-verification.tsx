
import { useState } from "react"
import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface AgeVerificationProps {
  onVerify: () => void
  onCancel: () => void
}

export function AgeVerification({ onVerify, onCancel }: AgeVerificationProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [error, setError] = useState(false)

  const handleVerify = () => {
    if (!date) {
      setError(true)
      return
    }

    const today = new Date()
    const birthDate = new Date(date)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age >= 21) {
      onVerify()
    } else {
      setError(true)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Age Verification Required</DialogTitle>
          <DialogDescription>
            Please verify the customer is at least 21 years of age to purchase alcohol.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                {date ? date.toLocaleDateString() : "Select date of birth..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => {
                  const today = new Date()
                  return date > today
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Customer must be at least 21 years old to purchase alcohol.</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleVerify}>Verify Age</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

