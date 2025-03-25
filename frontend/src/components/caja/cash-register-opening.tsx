"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { CalendarIcon, DollarSign } from "lucide-react"

export function CashRegisterOpening() {
  const [initialAmount, setInitialAmount] = useState("")
  const [user, setUser] = useState("")

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleOpenRegister = () => {
    if (!initialAmount || !user) {
      toast.error("Please fill in all required fields.")
      return
    }

    toast.success(`Register opened with $${initialAmount} by ${user} at ${currentTime}.`)

    // Here you would typically save this data to your backend
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Apertura de caja</CardTitle>
        <CardDescription>Ingresa el monto inicial para iniciar tu turno</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4 text-muted-foreground">
          <CalendarIcon className="h-5 w-5" />
          <span>
            {currentDate} at {currentTime}
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="initialAmount">Monto inicial en efectivo</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="initialAmount"
              type="number"
              placeholder="0.00"
              className="pl-10"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="user">Usuario</Label>
          <Select onValueChange={setUser}>
            <SelectTrigger id="user">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="administrator">Administrator</SelectItem>
              <SelectItem value="salesperson">Salesperson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleOpenRegister} className="w-full">
       Aperturar caja
        </Button>
      </CardFooter>
    </Card>
  )
}

