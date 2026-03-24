import { getLiveStatus } from "@/services/liveService";
import AudioPlayer from "@/components/AudioPlayer";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileMenu from "@/components/layout/MobileMenu";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const location = useLocation();

  // Verifica se a live está ativa
  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const status = await getLiveStatus();
        setIsLiveActive(status.ativa);
      } catch (error) {
        console.error("Erro ao verificar status da live:", error);
        setIsLiveActive(false);
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Detecta scroll para efeito de backdrop-blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fecha menu mobile ao mudar de rota
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.key]);

  // Bloqueia scroll do body quando menu mobile está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", isDark ? "dark" : "light");

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (isDark) {
      if (!metaThemeColor) {
        metaThemeColor = document.createElement("meta");
        metaThemeColor.setAttribute("name", "theme-color");
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute("content", "#0e1219");
    } else {
      if (metaThemeColor) {
        metaThemeColor.remove();
      }
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header - Fixed */}
      <Header
        scrolled={scrolled}
        isDark={isDark}
        setIsDark={setIsDark}
        isLiveActive={isLiveActive}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        location={location}
      />

      {/* Mobile Menu */}
      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isDark={isDark}
        setIsDark={setIsDark}
        isLiveActive={isLiveActive}
        location={location}
      />

      {/* Layout com Sidebar */}
      <div className="flex pt-[var(--header-height)]">
        {/* Sidebar - Desktop apenas - Fixed */}
        <DesktopSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isLiveActive={isLiveActive}
          location={location}
        />

        {/* Main Content - Com margin-left para compensar a sidebar fixa */}
        <main
          className={`flex-1 min-h-[calc(100vh-var(--header-height))] lg:transition-[margin-left] lg:duration-300 ${
            sidebarOpen ? "lg:ml-60" : "lg:ml-16"
          }`}
        >
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer sidebarOpen={sidebarOpen} />

      {/* Player de Rádio - escondido na página de live para não sobrepor o chat */}
      {location.pathname !== "/live" && <AudioPlayer />}
    </div>
  );
}
