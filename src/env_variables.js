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

/**
 * Query interval in seconds
 */
const INTERVAL = parseInt(process.env.QUERY_INTERVAL || '10')

// Influx variables
// You can generate a Token from the "Tokens Tab" in the UI
const influxToken = process.env.INFLUX_TOKEN
const influxOrg = process.env.INFLUX_ORG
const influxBucket = process.env.INFLUX_BUCKET

export {
  INTERVAL,
  TSInfo,
  influxBucket,
  influxOrg,
  influxToken
}
