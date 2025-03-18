declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test"
      PORT: string
      MONGODB_URI: string
      JWT_SECRET: string
      BLOB_READ_WRITE_TOKEN: string
    }
  }
}

export {}

