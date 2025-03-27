
import { User } from 'lucide-react'

import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/store/auth'
import { Link } from 'react-router-dom'
export const HedaerGeneral = () => {
    const user = useAuth((state) => state.user)
    const logout = useAuth((state) => state.logout)
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
    <div className="flex items-center gap-2">
    <img
                                src="/logo.png"
                                alt="Chili POS Logo"
                                className="w-8 h-8"
                            />
    </div>
    <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
            <Link to={`/dashboard/datos-usuario/${user?.id}`} className='flex items-center gap-2'  >
                <User className=" h-4 w-4" />
                {user?.name}
            </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Salir
        </Button>
    </div>
</header>
  )
}
