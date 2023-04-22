declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_API_KEY: string;
            PORT: string;
            SECRET_KEY: string;
            TEMP_MONGO_URL: string;
            SMTP_SERVICE: string;
            SMTP_EMAIL: string;
            SMTP_PASSWORD: string;
            CLIENT_URL: string;
        }
    }
}

export {};
