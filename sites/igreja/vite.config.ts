import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/AvivaNacoes/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "hero-bg.jpg", "apple-touch-icon.png"],
      manifest: {
        name: "Aviva Nações Nações",
        short_name: "Aviva Nações",
        description:
          "Aviva Nações - Uma comunidade de fé comprometida em levar o amor de Cristo através da palavra, louvor e comunhão.",
        theme_color: "#1e3a5f",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/AvivaNacoes/",
        start_url: "/AvivaNacoes/",
        icons: [
          {
            src: "pwa-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "pwa-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "pwa-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "pwa-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}"],
        // Excluir escolaAviva do service worker para evitar conflitos
        navigateFallbackDenylist: [/^\/AvivaNacoes\/escolaAviva/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-tooltip"],
          query: ["@tanstack/react-query"],
          motion: ["framer-motion"],
          player: ["react-player"],
        },
      },
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
}));
