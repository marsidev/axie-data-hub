const express = require('express')
const router = express.Router()
const ethers = require('ethers')
const axios = require('axios')

// https://github.com/rz777/axieTools/blob/40c88f5403723ab2cf04cf9f47c66140391bc099/payouts.js

const { GRAPHQL_SERVER_URL } = process.env

const __URL_RPC_RONIN = 'https://proxy.roninchain.com/free-gas-rpc'
const __ID_CHAIN_RONIN = 2020

const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(__URL_RPC_RONIN, __ID_CHAIN_RONIN)
}

const getWalletfromPrivateKey = (provider, privateKey) => {
  const walletPrivateKey = new ethers.Wallet(privateKey)
  // const walletPrivateKey = new ethers.Wallet(privateKey, provider)
  const wallet = walletPrivateKey.connect(provider)
  return wallet
}

const createRandomMessage = async () => {
  const query1 = 'mutation CreateRandomMessage { createRandomMessage }'
  const query = {
    operationName: 'CreateRandomMessage',
    variables: {},
    query: query1
  }
  const response = await axios.post(GRAPHQL_SERVER_URL, query)
  const message = response.data.data.createRandomMessage
  return message
}

const createAccessTokenWithSignature = async props => {
  const { message, owner, signature } = props
  const query1 = 'mutation CreateAccessTokenWithSignature($input: SignatureInput!) { createAccessTokenWithSignature(input: $input) { newAccount result accessToken __typename } }'
  const query = {
    operationName: 'CreateAccessTokenWithSignature',
    variables: {
      input: {
        mainnet: 'ronin',
        message: message,
        owner: owner,
        signature: signature
      }
    },
    query: query1
  }
  const response = await axios.post(GRAPHQL_SERVER_URL, query)
  const token = response.data.data.createAccessTokenWithSignature.accessToken
  return token
}

const getAccessToken = async wallet => {
  const randomMessage = await createRandomMessage()
  const signature = await wallet.signMessage(randomMessage)
  const token = await createAccessTokenWithSignature({
    message: randomMessage,
    owner: wallet.address,
    signature: signature
  })
  return token
}

router.post('/', async (req, res, next) => {
  // const privateKey = RONIN_TEST_PRIVATE_KEY
  const { privateKey } = req.body
  if (!privateKey) {
    return res.status(400).json({
      error: 'privateKey is required'
    })
  }

  const provider = getProvider()
  const wallet = getWalletfromPrivateKey(provider, privateKey)
  const token = await getAccessToken(wallet)
  res.json({ token })
})

module.exports = router
