import {  ChevronsUpDown, ChevronUp,  LayoutDashboard, LogOut, Package, ShoppingCart, User, User2, Users, Wallet } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenuLink } from "../sidenar-link"
import { UserData } from "@/lib/types"
import { useAuth } from "@/store/auth"

// Menu items por rol
const adminItems = [
    {
        title: "Principal",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Productos",
        url: "/dashboard/productos",
        icon: Package,
    },
    {
        title: "Ventas",
        url: "/dashboard/ventas",
        icon: ShoppingCart,
    },
    {
        title: "Caja",
        url: "/dashboard/caja",
        icon: Wallet,
    },
    {
        title: "Usuarios",
        url: "/dashboard/usuarios",
        icon: Users,
    }
]

const vendedorItems = [
    {
        title: "Principal",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Productos",
        url: "/dashboard/productos",
        icon: Package,
    },
    {
        title: "Ventas",
        url: "/dashboard/ventas",
        icon: ShoppingCart,
    },
    {
        title: "Caja",
        url: "/dashboard/caja",
        icon: Wallet,
    },
]

export function AppSidebar({user}: {user: UserData}) {
    const logout = useAuth((state) => state.logout)
    
    // Seleccionar items según el rol
    const items = user.role === 'Administrador' ? adminItems : vendedorItems

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarGroupLabel className="mt-8">
                        <div className="flex items-center gap-2 mb-8">
                            <img
                                src="/logo.png"
                                alt="Chili POS Logo"
                                className="w-16 h-16"
                            />
                            {/**<span className="font-semibold">Easy Chill</span> */}
                        </div>
                    </SidebarGroupLabel>
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton
                                            size="lg"
                                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                        >
                                            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-primary  text-primary-foreground">
                                                <User className="size-4" />
                                            </div>
                                            <div className="flex flex-col gap-0.5 leading-none">
                                                <span className="truncate text-sm font-medium leading-5 text-neutral-900">{user.name}</span>
                                                <span className="truncate text-xs capitalize leading-tight text-neutral-500">{user.role }</span>
                                            </div>
                                            <ChevronsUpDown className="ml-auto" />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    {/**<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                                        {versions.map((version) => (
                                            <DropdownMenuItem key={version} onSelect={() => setSelectedVersion(version)}>
                                                v{version} {version === selectedVersion && <Check className="ml-auto" />}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent> */}
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuLink to={item.url} icon={item.icon}>
                                        {item.title}
                                    </SidebarMenuLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu className="bg-white">
                    <SidebarMenuItem className="bg-white">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="w-full justify-between border bg-white" asChild>
                                <SidebarMenuButton className="w-full justify-between border">
                                    <User2 /> {user.name}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                        <div><p className="truncate text-sm font-medium text-neutral-900">
                                        <strong>Nombres: </strong>  {user.name}
                                        </p><p className="truncate text-sm text-neutral-500">
                                            <strong>Usuario: </strong> {user.username}
                                        </p></div>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={logout}>
                                    <LogOut /> <span>Salir</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
