import { defineConfig } from "vite"
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: path.resolve(__dirname, "src/main.js"),
        },
    },
    plugins: [tailwindcss()],
})
