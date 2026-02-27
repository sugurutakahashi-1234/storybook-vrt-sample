import path from "node:path";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { storybookVis } from "storybook-addon-vis/vitest-plugin";
import { defineConfig } from "vitest/config";

const configDir = path.resolve(import.meta.dirname, ".storybook");

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@ui": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
          setupFiles: ["./.storybook/vitest.setup.ts"],
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir }), storybookVis()],
        test: {
          name: "storybook-vrt",
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
          globalSetup: ["./.storybook/vitest.global-setup.vrt.ts"],
          setupFiles: ["./.storybook/vitest.setup.vrt.ts"],
        },
      },
    ],
  },
});
