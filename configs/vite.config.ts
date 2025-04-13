import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://github.com/welldone-software/why-did-you-render/issues/243#issuecomment-1132892461
export default defineConfig({
  plugins: [
    react({
      jsxImportSource:
        process.env.NODE_ENV === "development"
          ? "@welldone-software/why-did-you-render"
          : "react",
    }),
  ],
});
