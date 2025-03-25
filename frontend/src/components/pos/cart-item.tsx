"use client"

import { Minus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
const api = import.meta.env.VITE_API_ASSETS
interface CartItemProps {
  item: {
    product: {
      id: number
      name: string
      price?: number
      image: string
      priceReal?: number
      price_offert?: number
    }
    quantity: number
  }
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  //precio real
  const priceReal = item.product.price_offert != 0 ? item.product.price_offert : item.product.price;
  return (
    <Card>
      <CardContent className="flex items-center p-3">
        <img
          src={`${api}${item.product.image}` || "/placeholder.svg"}
          alt={item.product.name}
          className="h-12 w-12 rounded object-cover"
        />
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <p className="font-medium">{item.product.name}</p>
            <p className="font-medium">S/.{((priceReal || 0) * item.quantity).toFixed(2)}</p>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={() => onUpdateQuantity(item.quantity - 1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className=" min-w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6"
                onClick={() => onUpdateQuantity(item.quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={onRemove}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

