import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
    sessionSecret: process.env.SESSION_SECRET || 'sessionsecret',
    nodeEnv: process.env.NODE_ENV || 'development',
    botDir: path.join(__dirname, '../bots'),
    maxBots: parseInt(process.env.MAX_BOTS || '10'),
    databasePath: path.join(__dirname, '../database/panel.json'),
    sessionLifetime: 7 * 24 * 60 * 60 * 1000,
}
