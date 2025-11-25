// Type definitions for Vite environment variables
interface ImportMetaEnv {
    readonly VITE_AZURE_MAPS_KEY?: string;
    // Add other env variables here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
