"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CategoryButtonProps {
  children: ReactNode
  active?: boolean
  icon?: ReactNode
  onClick: () => void
}

export function CategoryButton({ children, active, icon, onClick }: CategoryButtonProps) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      className={cn("flex items-center gap-2 whitespace-nowrap", active ? "bg-primary text-primary-foreground" : "")}
      onClick={onClick}
      size="sm"
    >
      {icon}
      {children}
    </Button>
  )
}

