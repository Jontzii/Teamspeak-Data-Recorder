import * as ts3 from 'ts3-nodejs-library'
import { TSInfo } from './env_variables.js'

let QueryClient

/**
 * Closes connection to the Teamspeak server.
 */
const closeTeamspeakConnection = async () => {
  console.log('Closing Teamspeak connection')

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
    if (QueryClient) {
      // Active connection is already established
      console.log('Connection to the Teamspeak server already active')
      resolve(QueryClient)
    } else {
      // Create parameters for new connection
      createConnectionParams(ConnectionInfo)
        .then((params) => ts3.TeamSpeak.connect(params))
        .then((ts) => {
          console.log('Successfully connected to the Teamspeak server')

          QueryClient = ts
          resolve(ts)
        })
        .catch((err) => {
          QueryClient = null
          reject(err)
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
    console.log('Creating client data')

    const ClientData = {
      count: 0,
      clients: []
    }

    connectToTeamspeak(TSInfo)
      .then(async (teamspeak) => {
        teamspeak.clientList({ clientType: 0 })
          .then((clientList) => teamspeak.clientInfo(clientList))
          .then((clients) => {
            console.log('Successfully fetched clients')
            ClientData.count = clients.length
            ClientData.clients = clients
          })
          .catch((err) => {
            console.log('Error while retrieving clients: ' + err)
          })
          .finally(() => closeTeamspeakConnection())
          .then(() => resolve(ClientData))
      })
      .catch((err) => reject(err))
  })
}

export default createClientData
