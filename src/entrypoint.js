import clientData from './clientData.js'

const entrypoint = () => {
  clientData()
    .then(res => console.log(res))
}

entrypoint()
