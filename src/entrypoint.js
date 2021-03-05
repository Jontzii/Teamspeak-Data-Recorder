import clientData from './clientData.js'
import { closeWriteApi, writeData } from './influxControl.js'
import { INTERVAL } from './env_variables.js'

const entrypoint = () => {
  console.info('\nSTARTING @ ' + new Date().toISOString())
  clientData()
    .then(res => writeData(res))
    .then(() => console.info('FINISHED @ ' + new Date().toISOString()))
    .catch(e => {
      console.info('Finished with ERROR')
      console.error(e.message)
    })
}

// Call entrypoint once before timer
entrypoint()

/**
 * Interval for query
 */
const intervalObj = setInterval(() => {
  entrypoint()
}, INTERVAL * 1000)

/**
 * Graceful exit
 */
process.on('SIGTERM', () => {
  console.info('Exiting...')
  closeWriteApi()
  clearInterval(intervalObj)
  console.info('Ready to exit')
})
