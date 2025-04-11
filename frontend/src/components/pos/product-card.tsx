"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
const api = import.meta.env.VITE_API_ASSETS
interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    image: string
    price_offert?: number
    name_brand?: string
    stock?: number | null
  }
  onAddToCart: () => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const price = Number(product.price);
  const priceOffert = Number(product.price_offert);
  const discount = (price - priceOffert) / price * 100;
  return (
    <>


      <Card className={`${product.stock === 0 ? 'grayscale' : ''} overflow-hidden col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1`}>
        <CardContent className="p-0 relative">
          {
            product.stock === 0 && (
              <h3 className="text-red-500 text-4xl font-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 -rotate-45 ">AGOTADO</h3>
            )
          }
          <div className="aspect-square bg-muted relative">
            {
              priceOffert != 0 && (
                <div className="absolute top-2 right-2 bg-red-500 rounded-full text-white px-2 font-bold text-xs">
                  -{discount.toFixed(0)}%
                </div>
              )
            }
            <img src={`${api}${product.image}` || "placeholder.svg"} loading="lazy" alt={product.name} className="h-full text-sm w-full object-cover bg-white" />
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm md:text-md">{product.name}</h3>
            <p className="text-sm md:text-lg font-bold flex">
              {priceOffert ? (
                <>
                  <span className=" line-through text-gray-500 font-light">S/.{price.toFixed(2)}</span>
                  <span className="font-bold"> S/.{priceOffert.toFixed(2)}</span>

                </>
              ) : (
                <span className="font-bold">S/.{price.toFixed(2)}</span>
              )}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <Button variant="default" className="w-full gap-0" onClick={onAddToCart} disabled={product.stock === 0}>
            <Plus className="mr-0 md:mr-2 h-4 w-4" />
            Añadir al carrito
          </Button>
        </CardFooter>
      </Card>

    </>
  )
}

