import { Link, useLocation } from "react-router-dom";
import { SidebarMenuButton } from "./ui/sidebar";
import { ReactNode } from "react";

interface Props {
    children?: ReactNode;
    icon: React.ElementType;
    to: string;
}

export const SidebarMenuLink = ({ to, icon: Icon, children }: Props) => {
    const location = useLocation();

    // Normaliza la ruta eliminando cualquier slash ("/") final
    const currentPath = location.pathname.replace(/\/$/, "");

    const isActive = (() => {
        // Si la ruta normalizada es igual a "to", se activa
        if (currentPath === to) return "bg-primary/50 hover:bg-primary transition";

        // Evita activar `/dashboard` si estás en una subruta dentro de él
        if (to === "/dashboard" && currentPath.startsWith("/dashboard/")) {
            return "";
        }

        // Verifica si es una subruta y si no termina en un ID numérico
        if (currentPath.startsWith(to + "/")) {
            const subPath = currentPath.replace(to + "/", "");
            if (!subPath.match(/^\d+$/)) {
                return "bg-primary/50 hover:bg-primary transition";
            }
        }

        return "";
    })();

    return (
        <SidebarMenuButton asChild className={`transition-all duration-300 ${isActive}`}>
            <Link to={to}>
                <Icon className="" />
                <span>{children}</span>
            </Link>
        </SidebarMenuButton>
    );
};
