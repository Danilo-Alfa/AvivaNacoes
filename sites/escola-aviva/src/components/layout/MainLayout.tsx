import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { MobileMenu } from "./MobileMenu";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      <AppSidebar />
      
      {/* Mobile Menu */}
      <MobileMenu />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Decorative top line for desktop */}
        <div className="hidden lg:block h-1 gradient-hero" />
        
        {/* Mobile header spacer (h-1 gradient + h-12 header = 52px ~= h-[52px]) */}
        <div className="h-[52px] lg:hidden" />
        
        {/* Page Content */}
        <div className="container-custom py-6 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
