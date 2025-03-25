import React from "react"
import { Calendar, Check, ChevronsUpDown, ChevronUp, Home, Inbox, LogOut, Search, User, User2 } from "lucide-react"
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
// Menu items.
const items = [
    {
        title: "Principal",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Productos",
        url: "/dashboard/productos",
        icon: Inbox,
    },
    {
        title: "Ventas",
        url: "/dashboard/ventas",
        icon: Calendar,
    },
    {
        title: "Caja",
        url: "/dashboard/caja",
        icon: Search,
    },
    {
        title: "Usuarios",
        url: "/dashboard/usuarios",
        icon: User,
    }
]

export function AppSidebar() {
    const [selectedVersion, setSelectedVersion] = React.useState('')

    const versions = ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"]
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarGroupLabel className="mt-8">
                        <div className="flex items-center gap-2 mb-8">
                            <img
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg"
                                alt="Chili POS Logo"
                                className="w-8 h-8"
                            />
                            <span className="font-semibold">CHILI POS</span>
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
                                                <span className="truncate text-sm font-medium leading-5 text-neutral-900">Efrael</span>
                                                <span className="truncate text-xs capitalize leading-tight text-neutral-500">Financiera</span>
                                            </div>
                                            <ChevronsUpDown className="ml-auto" />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                                        {versions.map((version) => (
                                            <DropdownMenuItem key={version} onSelect={() => setSelectedVersion(version)}>
                                                v{version} {version === selectedVersion && <Check className="ml-auto" />}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
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
                                    <User2 /> Efrael
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <div><p className="truncate text-sm font-medium text-neutral-900">
                                        Efrael
                                    </p><p className="truncate text-sm text-neutral-500">email</p></div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
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
