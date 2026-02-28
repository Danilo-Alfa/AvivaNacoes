import { Link, useLocation } from "react-router-dom";
import {
  Video,
  Calendar,
  Radio,
  Image,
  Newspaper,
  BookOpen,
  Church,
  FolderKanban,
  MessageSquare,
  LogOut,
  Home,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Conteúdo",
    items: [
      { title: "Vídeos", url: "/admin/videos", icon: Video },
      { title: "Eventos", url: "/admin/eventos", icon: Calendar },
      { title: "Live", url: "/admin/live", icon: Radio },
      { title: "Carousel", url: "/admin/carousel", icon: Image },
    ],
  },
  {
    label: "Publicações",
    items: [
      { title: "Jornal", url: "/admin/jornal", icon: Newspaper },
      { title: "Programação", url: "/admin/programacao", icon: SlidersHorizontal },
      { title: "Versículos", url: "/admin/versiculo-do-dia", icon: BookOpen },
    ],
  },
  {
    label: "Institucional",
    items: [
      { title: "Igrejas", url: "/admin/igrejas", icon: Church },
      { title: "Projetos", url: "/admin/projetos", icon: FolderKanban },
      { title: "Galerias", url: "/admin/galerias", icon: Image },
    ],
  },
  {
    label: "Comunicação",
    items: [
      { title: "Mensagens", url: "/admin/mensagens", icon: MessageSquare },
    ],
  },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAdminAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link to="/admin" className="flex items-center gap-2 font-bold text-sidebar-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
            AN
          </div>
          <span className="group-data-[collapsible=icon]:hidden text-sm">
            Painel Admin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Voltar ao site">
              <Link to="/">
                <Home />
                <span>Voltar ao site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Sair</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
