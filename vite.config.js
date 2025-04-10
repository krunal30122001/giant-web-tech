import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), "");

  // Log the loaded environment mode
  console.log(`Running in ${env.VITE_APP_MODE} mode`);

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir:
        mode === "production"
          ? `../../../public/Live/${env.VITE_SUBFOLDER}`
          : `../../../public/${env.VITE_SUBFOLDER}`,
      minify: mode === "production" ? "terser" : false,
      sourcemap: mode === "development",
      target: "esnext",
      rollupOptions: {
        output: {
          // Remove the manualChunks option or configure it properly
          manualChunks:
            mode === "production"
              ? undefined
              : {
                  // Example of proper chunk configuration:
                  vendor: [
                    "vue",
                    // Add other actual dependencies you want to bundle separately
                  ],
                },
        },
      },
    },
    // base: mode === 'development' ? `/${env.VITE_SUBFOLDER}/` : '/',
  };
});
