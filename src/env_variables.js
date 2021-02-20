import dotenv from 'dotenv'
dotenv.config()

/**
 * TeamSpeak connection variables
 */
const TSInfo = {
  Hostname: process.env.TS_HOSTNAME || 'localhost',
  Port: parseInt(process.env.TS_PORT || ''),
  QueryPort: 10011,
  Username: process.env.TS_USERNAME,
  Password: process.env.TS_PASSWORD
}

export {
  TSInfo
}
