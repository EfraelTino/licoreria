import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { Navigate, Outlet} from 'react-router-dom'
import { useAuth } from '@/store/auth'
import { HedaerGeneral } from '@/components/header-general'

export const DashboardLayout = () => {
    const { user } = useAuth()
    if (!user) {
        return <Navigate to="/" replace />
    }
  

    return (
        <SidebarProvider className='bg-[#f9f9f9]'>
            <AppSidebar user={user} />
            <SidebarInset>
               <HedaerGeneral />
                <main className='bg-[#f9f9f9] w-full p-4'>

                    <Outlet />
                </main>
            </SidebarInset>

        </SidebarProvider>
    )
}
