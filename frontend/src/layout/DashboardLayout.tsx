import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { Navigate, Outlet} from 'react-router-dom'
import { useAuth } from '@/store/auth'

export const DashboardLayout = () => {
   
     const { user } = useAuth()
     console.log(user)
    if (!user) {
        return <Navigate to="/" replace />
    }
  
     

    return (
        <SidebarProvider className='bg-[#f9f9f9]'>
            <AppSidebar user={user}/>
            <SidebarInset>
          
                <main className="relative bg-[#f9f9f9] h-full">
                <SidebarTrigger  className="absolute"/>
                    <Outlet />
                </main>
            </SidebarInset>

        </SidebarProvider>
    )
}
