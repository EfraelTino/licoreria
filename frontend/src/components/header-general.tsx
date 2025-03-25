import { Wine } from 'lucide-react'
import { User } from 'lucide-react'

import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
export const HedaerGeneral = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
    <div className="flex items-center gap-2">
        <Wine className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">POS</h1>
    </div>
    <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
            <User className=" h-4 w-4" />
            Efrael
        </Button>
        <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4" />
            Salir
        </Button>
    </div>
</header>
  )
}
