import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileText,
  ChevronLeft,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { title: "Cursos", url: "/cursos", icon: BookOpen },
  { title: "Materiais", url: "/materiais", icon: FileText },
  { title: "Admin", url: "/admin", icon: Shield, adminOnly: true },
];

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden lg:flex flex-col h-screen bg-card border-r border-border sticky top-0"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <picture>
            <source srcSet={`${import.meta.env.BASE_URL}logoheader.webp`} type="image/webp" />
            <img
              src={`${import.meta.env.BASE_URL}logoheader.png`}
              alt="Logo Aviva Nações"
              width={40}
              height={40}
              className="w-10 h-10 object-contain flex-shrink-0"
            />
          </picture>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <h1 className="font-display font-bold text-lg text-foreground whitespace-nowrap">
                  Escola Aviva
                </h1>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  Formacao Espiritual
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item, index) => {
          const isActive = location.pathname === item.url;
          return (
            <motion.div
              key={item.url}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* User Menu */}
      <div className="p-4 border-t border-border">
        <UserMenu collapsed={isCollapsed} />
      </div>

      {/* Collapse Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          aria-expanded={!isCollapsed}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Recolher
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
