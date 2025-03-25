"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react"

export function CashRegisterClosing() {
  const [cashCounted, setCashCounted] = useState({
    hundreds: "",
    fifties: "",
    twenties: "",
    tens: "",
    fives: "",
    ones: "",
    quarters: "",
    dimes: "",
    nickels: "",
    pennies: "",
  })

  // Expected amounts from the system
  const expectedCash = 1245.5
  const expectedCard = 2876.25
  const expectedTotal = expectedCash + expectedCard

  // Calculate total cash counted
  const calculateTotal = () => {
    return (
      (Number.parseFloat(cashCounted.hundreds) || 0) * 100 +
      (Number.parseFloat(cashCounted.fifties) || 0) * 50 +
      (Number.parseFloat(cashCounted.twenties) || 0) * 20 +
      (Number.parseFloat(cashCounted.tens) || 0) * 10 +
      (Number.parseFloat(cashCounted.fives) || 0) * 5 +
      (Number.parseFloat(cashCounted.ones) || 0) * 1 +
      (Number.parseFloat(cashCounted.quarters) || 0) * 0.25 +
      (Number.parseFloat(cashCounted.dimes) || 0) * 0.1 +
      (Number.parseFloat(cashCounted.nickels) || 0) * 0.05 +
      (Number.parseFloat(cashCounted.pennies) || 0) * 0.01
    )
  }

  const totalCounted = calculateTotal()
  const difference = totalCounted - expectedCash
  const isDifferenceSignificant = Math.abs(difference) > 1

  const handleInputChange = (key: keyof typeof cashCounted, value: string) => {
    setCashCounted({
      ...cashCounted,
      [key]: value,
    })
  }

  const handleCloseRegister = () => {
    toast({
      title: "Register Closed",
      description: `Register closed with ${isDifferenceSignificant ? "discrepancy" : "balance"} of ${difference.toFixed(2)}.`,
      variant: isDifferenceSignificant ? "destructive" : "default",
    })

    // Here you would typically save this data to your backend
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Count Cash</CardTitle>
          <CardDescription>Enter the physical cash in the register</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Bills</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hundreds">$100 Bills</Label>
                  <Input
                    id="hundreds"
                    type="number"
                    placeholder="0"
                    value={cashCounted.hundreds}
                    onChange={(e) => handleInputChange("hundreds", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fifties">$50 Bills</Label>
                  <Input
                    id="fifties"
                    type="number"
                    placeholder="0"
                    value={cashCounted.fifties}
                    onChange={(e) => handleInputChange("fifties", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twenties">$20 Bills</Label>
                  <Input
                    id="twenties"
                    type="number"
                    placeholder="0"
                    value={cashCounted.twenties}
                    onChange={(e) => handleInputChange("twenties", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tens">$10 Bills</Label>
                  <Input
                    id="tens"
                    type="number"
                    placeholder="0"
                    value={cashCounted.tens}
                    onChange={(e) => handleInputChange("tens", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fives">$5 Bills</Label>
                  <Input
                    id="fives"
                    type="number"
                    placeholder="0"
                    value={cashCounted.fives}
                    onChange={(e) => handleInputChange("fives", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ones">$1 Bills</Label>
                  <Input
                    id="ones"
                    type="number"
                    placeholder="0"
                    value={cashCounted.ones}
                    onChange={(e) => handleInputChange("ones", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Coins</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quarters">Quarters</Label>
                  <Input
                    id="quarters"
                    type="number"
                    placeholder="0"
                    value={cashCounted.quarters}
                    onChange={(e) => handleInputChange("quarters", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimes">Dimes</Label>
                  <Input
                    id="dimes"
                    type="number"
                    placeholder="0"
                    value={cashCounted.dimes}
                    onChange={(e) => handleInputChange("dimes", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickels">Nickels</Label>
                  <Input
                    id="nickels"
                    type="number"
                    placeholder="0"
                    value={cashCounted.nickels}
                    onChange={(e) => handleInputChange("nickels", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pennies">Pennies</Label>
                  <Input
                    id="pennies"
                    type="number"
                    placeholder="0"
                    value={cashCounted.pennies}
                    onChange={(e) => handleInputChange("pennies", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Register Summary</CardTitle>
          <CardDescription>Verify and close the register</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Expected Cash</span>
              <span className="font-medium">${expectedCash.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Counted Cash</span>
              <span className="font-medium">${totalCounted.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className={`font-medium ${isDifferenceSignificant ? "text-red-500" : "text-green-500"}`}>
                Difference
              </span>
              <div className="flex items-center gap-1">
                {isDifferenceSignificant ? (
                  <AlertCircleIcon className="h-4 w-4 text-red-500" />
                ) : (
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                )}
                <span className={`font-medium ${isDifferenceSignificant ? "text-red-500" : "text-green-500"}`}>
                  ${difference.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Card Payments</span>
              <span className="font-medium">${expectedCard.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cash Payments</span>
              <span className="font-medium">${expectedCash.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Sales</span>
              <span className="font-medium">${expectedTotal.toFixed(2)}</span>
            </div>
          </div>

          {isDifferenceSignificant && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircleIcon className="h-4 w-4" />
                <span className="font-medium">Cash Discrepancy Detected</span>
              </div>
              <p className="mt-1">
                There is a significant difference between expected and counted cash. Please recount or provide an
                explanation before closing.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="closing-notes">Closing Notes</Label>
            <Input id="closing-notes" placeholder="Add any notes about this closing..." />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleCloseRegister}>
            Close Register
          </Button>
          <Button variant="outline" className="w-full">
            Print Closing Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

