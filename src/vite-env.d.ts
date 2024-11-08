/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_TONCLIENT_ENDPOINT: string;
  readonly VITE_TONCLIENT_API_KEY: string;
  readonly VITE_STONEFI_ROUTER_ADDRESS: string;
  // add more variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
