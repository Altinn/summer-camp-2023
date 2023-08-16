import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon-180x180.png",
      ],
      manifest: {
        name: "Wallet",
        short_name: "Wallet",
        description: "Wallet for Verifiable Credentials",
        theme_color: "#ffffff",
        icons: [
          {
            src: "wallet-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "wallet-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "wallet-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "wallet-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
