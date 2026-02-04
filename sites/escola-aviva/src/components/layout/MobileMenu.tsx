import { useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  BookOpen,
  FileText,
  Shield,
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, isAdmin, loading } = useAuth();

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  const menuVariants = {
    closed: {
      x: "100%",
      transition: { type: "spring" as const, stiffness: 400, damping: 40 }
    },
    open: {
      x: 0,
      transition: { type: "spring" as const, stiffness: 400, damping: 40 }
    },
  };

  const itemVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.05 + 0.1 }
    }),
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="lg:hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="h-1 gradient-hero" />
        <div className="flex items-center justify-between px-4 h-12">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <picture className="flex-shrink-0">
              <source srcSet={`${import.meta.env.BASE_URL}logoheader.webp`} type="image/webp" />
              <img
                src={`${import.meta.env.BASE_URL}logoheader.png`}
                alt="Logo Aviva Nações"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
            </picture>
            <h1 className="font-display font-bold text-foreground text-sm leading-none">Escola Aviva</h1>
          </motion.div>

          <div className="flex items-center gap-1">
            {/* User Avatar (se logado) */}
            {!loading && user && (
              <Link to="/perfil" className="flex items-center justify-center">
                <Avatar className="w-8 h-8 border-2 border-primary/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="gradient-hero text-primary-foreground text-xs">
                    {getInitials(profile?.nome || 'U')}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}

            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Slide Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-card z-50 shadow-medium flex flex-col"
          >
            <div className="h-1 gradient-hero" />

            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <picture>
                  <source srcSet={`${import.meta.env.BASE_URL}logoheader.webp`} type="image/webp" />
                  <img
                    src={`${import.meta.env.BASE_URL}logoheader.png`}
                    alt="Logo Aviva Nações"
                    width={36}
                    height={36}
                    className="w-9 h-9 object-contain"
                  />
                </picture>
                <span className="font-display font-bold text-foreground">Menu</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* User Info (se logado) */}
            {!loading && user && profile && (
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-primary/20">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="gradient-hero text-primary-foreground">
                      {getInitials(profile.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{profile.nome}</p>
                    <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {filteredNavItems.map((item, index) => {
                const isActive = location.pathname === item.url;
                return (
                  <motion.div
                    key={item.url}
                    custom={index}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                  >
                    <NavLink
                      to={item.url}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </motion.div>
                );
              })}

              {/* Auth Options */}
              {!loading && (
                <>
                  <div className="h-px bg-border my-4" />
                  {user ? (
                    <>
                      <motion.div
                        custom={filteredNavItems.length}
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                      >
                        <NavLink
                          to="/perfil"
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                            location.pathname === "/perfil"
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          <User className="w-5 h-5" />
                          <span className="font-medium">Meu Perfil</span>
                        </NavLink>
                      </motion.div>
                      <motion.div
                        custom={filteredNavItems.length + 1}
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                      >
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-200"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium">Sair</span>
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      custom={filteredNavItems.length}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                    >
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Entrar</span>
                      </Link>
                    </motion.div>
                  )}
                </>
              )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Escola Aviva © 2025
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
