// Define custom types or interfaces for your Nuxt project
export interface AppConfig {
  appName: string;
  appVersion: string;
  apiBaseUrl: string;
}

// Example default configuration
export const defaultConfig: AppConfig = {
  appName: "Nuxt Alazab Dashboard",
  appVersion: "1.0.0",
  apiBaseUrl: "https://api.example.com",
};
