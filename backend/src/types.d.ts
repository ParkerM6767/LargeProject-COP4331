export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      JWT_SECRET: string;
    }
    interface ProcessEnv {
      DB_URL: string;
    }
  }
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}
