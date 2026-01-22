import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Shield, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  collapsed?: boolean;
}

export function UserMenu({ collapsed = false }: UserMenuProps) {
  const { user, profile, signOut, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

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
    navigate('/login');
  };

  if (loading || !user) {
    return (
      <div className="flex items-center gap-3 p-2">
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        {!collapsed && (
          <div className="space-y-2">
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
            <div className="h-2 w-14 bg-muted animate-pulse rounded" />
          </div>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center justify-between w-full p-2 pr-3 rounded-xl hover:bg-primary/5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
          {/* Avatar e informações do usuário */}
          <div className="flex items-center gap-3">
            {/* Avatar com efeito de glow */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-full opacity-0 group-hover:opacity-60 blur-sm transition-all duration-500" />
              <Avatar className="relative w-10 h-10 border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300 ring-2 ring-transparent group-hover:ring-primary/10">
                <AvatarImage src={profile?.avatar_url} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold">
                  {getInitials(profile?.nome || 'U')}
                </AvatarFallback>
              </Avatar>
              {/* Badge de status online */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background shadow-sm" />
            </div>

            {/* Informações do usuário */}
            {!collapsed && (
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-foreground truncate max-w-[100px]">
                    {profile?.nome?.split(' ')[0]}
                  </p>
                  {isAdmin && (
                    <Sparkles className="w-3 h-3 text-amber-500" />
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  {isAdmin ? 'Administrador' : 'Aluno'}
                </p>
              </div>
            )}
          </div>

          {/* Chevron no final */}
          {!collapsed && (
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2" sideOffset={8}>
        {/* Header do menu com info do usuário */}
        <div className="flex items-center gap-3 p-3 mb-2 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
          <Avatar className="w-12 h-12 border-2 border-primary/20">
            <AvatarImage src={profile?.avatar_url} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
              {getInitials(profile?.nome || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{profile?.nome}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-semibold">
                <Sparkles className="w-2.5 h-2.5" />
                Admin
              </span>
            )}
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />

        {/* Menu items */}
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-3 focus:bg-primary/5">
          <Link to="/perfil" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-sm">Meu Perfil</p>
              <p className="text-[11px] text-muted-foreground">Veja e edite seus dados</p>
            </div>
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-3 focus:bg-primary/5">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-sm">Painel Admin</p>
                <p className="text-[11px] text-muted-foreground">Gerencie a plataforma</p>
              </div>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer rounded-lg p-3 focus:bg-destructive/10 text-destructive hover:text-destructive"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-sm">Sair</p>
              <p className="text-[11px] opacity-70">Encerrar sessão</p>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
