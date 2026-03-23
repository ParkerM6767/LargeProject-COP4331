export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
    }
    interface ProcessEnv {
      DB_URL: string;
    }
  }
}
