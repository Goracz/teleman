/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AUTH_SERVICE_BASE_URL: string;
    readonly VITE_CONTROL_SERVICE_BASE_URL: string;
};

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
