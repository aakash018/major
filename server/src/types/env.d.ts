declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      CLIENT_ENDPOINT: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      S3ACCESS: string;
      S3SECRET: string;
    }
  }
}

export {};
