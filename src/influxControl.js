import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { influxBucket, influxOrg, influxToken } from './env_variables.js'

const client = new InfluxDB({ url: 'http://46.101.230.97:8086', token: influxToken })
const writeApi = client.getWriteApi(influxOrg, influxBucket)
writeApi.useDefaultTags({ host: 'DigitalOcean-Droplet' })

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
