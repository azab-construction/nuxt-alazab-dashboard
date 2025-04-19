// Add your instrumentation key or use the APPLICATIONINSIGHTSKEY environment variable on your production machine to start collecting data.
var ai = require("applicationinsights");
ai.setup(
  process.env.APPLICATIONINSIGHTSKEY || "your_instrumentation_key",
).start();
declare module "nuxt/schema" {
  interface AppConfigInput {
    /** Sidebar configuration */
    sidebar: {
      collapsible: "offcanvas" | "icon" | "none";
      side: "left" | "right";
      variant: "sidebar" | "floating" | "inset";
    };
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
