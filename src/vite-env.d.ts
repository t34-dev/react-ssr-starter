/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_SOCKET: string;
  readonly VITE_BACKEND_ADDRESS: string;

  readonly VITE_I18NEXUS_API_KEY: string;
  readonly VITE_I18NEXUS_LOCAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
