import { InfluxDB, Point } from '@influxdata/influxdb-client'
import * as env from './env_variables.js'

const client = new InfluxDB({ url: `http://${env.influxUrl}:${env.influxPort}`, token: env.influxToken })
const writeApi = client.getWriteApi(env.influxOrg, env.influxBucket)
writeApi.useDefaultTags({ host: env.influxHost })

/** Closes write API */
const closeWriteApi = () => {
  return writeApi.close()
}

/**
 * Writes data to the influxDb
 * @param {*} ClientData Object containing count of clients
 * and array of unique identifiers.
 */
const writeData = (ClientData) => {
  return new Promise((resolve, reject) => {
    console.info('Writing data to the defined InfluxDb')
    const point = new Point('ts_users')
      .floatField('count', ClientData.count)
      .stringField('clients', JSON.stringify(ClientData))
    writeApi.writePoint(point)
    writeApi
      .flush()
      .then(() => {
        console.info('FINISHED')
        resolve()
      })
      .catch(e => reject(e))
  })
}

export {
  closeWriteApi,
  writeData
}
