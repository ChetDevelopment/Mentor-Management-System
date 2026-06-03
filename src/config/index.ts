function requireEnv(name: string, devFallback?: string): string {
    const value = process.env[name];
    if (value) return value;
    if (process.env.NODE_ENV === 'production') {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    if (devFallback !== undefined) return devFallback;
    throw new Error(`Missing required environment variable: ${name}`);
}

export const appConfig = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: 'api/v1',
};

export const databaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: requireEnv('DB_PASSWORD', ''),
    database: process.env.DB_DATABASE || 'mentor_management_system',
};

export const jwtConfig = {
    secret: requireEnv('JWT_SECRET', 'insecure-dev-secret-do-not-use-in-production'),
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};
