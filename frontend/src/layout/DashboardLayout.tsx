import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { Navigate, Outlet} from 'react-router-dom'
import { useAuth } from '@/store/auth'

export const DashboardLayout = () => {
    /**
     * const { user } = useAuth()
    if (!user) {
        return <Navigate to="/" replace />
    }
  
     */

    return (
        <SidebarProvider className='bg-[#f9f9f9]'>
            <AppSidebar />
            <SidebarInset>
          
                <main className="relative">
                <SidebarTrigger  className="absolute"/>
      
                    <Outlet />
                </main>
            </SidebarInset>

        </SidebarProvider>
    )
}
