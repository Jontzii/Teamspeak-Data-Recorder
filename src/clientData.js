import * as ts3 from 'ts3-nodejs-library'
import { TSInfo } from './env_variables.js'

let QueryClient

/**
 * Closes connection to the Teamspeak server.
 */
const closeTeamspeakConnection = async () => {
  console.info('Closing Teamspeak connection')

  if (QueryClient) {
    await QueryClient.quit()
    QueryClient = null
  }
}

/**
 * Connects to the TeamSpeak 3 server specified with
 * environment variables.
 *
 * @param {TSInfo} ConnectionInfo Connection information read from environment
 * @return {Promise<ts3.TeamSpeak>} Promise object containing the data
 */
const connectToTeamspeak = (ConnectionInfo) => {
  return new Promise((resolve, reject) => {
    console.info('Opening connection with the TS3 server')

    if (QueryClient) {
      // Active connection is already established
      console.info('FINISHED')
      resolve(QueryClient)
    } else {
      // Create parameters for new connection
      createConnectionParams(ConnectionInfo)
        .then((params) => ts3.TeamSpeak.connect(params))
        .then((ts) => {
          console.info('FINISHED')
          QueryClient = ts
          resolve(ts)
        })
        .catch((e) => {
          QueryClient = null
          reject(e)
        })
    }
  })
}

/**
 * Creates ConnectionParams for connecting to a
 * TeamSpeak 3 server.
 *
 * @param {TSInfo} ConnectionInfo Info for connection
 * @return {Promise} Promise containing the params
 */
const createConnectionParams = (ConnectionInfo) => {
  return new Promise((resolve) => {
    const params = {
      host: ConnectionInfo.Hostname,
      protocol: ts3.QueryProtocol.RAW,
      queryport: ConnectionInfo.QueryPort,
      serverport: ConnectionInfo.Port,
      username: ConnectionInfo.Username,
      password: ConnectionInfo.Password,
      keepAlive: true,
      readyTimeout: 10000,
      keepAliveTimeout: 250,
      ignoreQueries: false
    }

    resolve(params)
  })
}

/**
 * Creates object containing count of clients on
 * server and info about the clients.
 *
 * @return {Promise} Promise resolving to object
 */
const createClientData = () => {
  return new Promise((resolve, reject) => {
    const ClientData = {
      count: 0,
      clients: []
    }

    connectToTeamspeak(TSInfo)
      .then(async (teamspeak) => {
        teamspeak.clientList({ clientType: 0 })
          .then((clients) => {
            ClientData.count = clients.length

            clients.forEach(client => {
              ClientData.clients.push(client.uniqueIdentifier)
            })
          })
          .finally(() => closeTeamspeakConnection())
          .then(() => {
            console.info('FINISHED')
            resolve(ClientData)
          })
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export default createClientData
