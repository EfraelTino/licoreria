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
    const isActive = location.pathname == to ? "bg-primary/50 hover:bg-primary transition" : "";
    return (
        <SidebarMenuButton asChild className={ `${`transition-all duration-300`} ${isActive}`}>
            <Link to={to}>
                <Icon className=""/>
                <span>{children}</span>
            </Link>
        </SidebarMenuButton>
    );
};
