const axios = require('axios')
const ethers = require('ethers')

const {
  GetProfileNameByRoninAddressQuery,
  createRandomMessageQuery,
  createAccessTokenQuery
} = require('./queries')
const { postRequest, getNumberOfDays } = require('./index')
const Account = require('../models/Account')

const { GRAPHQL_SERVER_URL, RPC_RONIN_URL, RONIN_CHAIN_ID, GAME_API_URL, GRAPHQL_SERVER_URL2 } = process.env

const fetchAccountData = async address => {
  const url = `${GAME_API_URL}/clients/${address.replace('ronin:', '0x')}/items/1`
  const response = await axios.get(url)
  const playerData = response.data

  const payload = {
    query: GetProfileNameByRoninAddressQuery,
    operationName: 'GetProfileNameByRoninAddress',
    variables: { roninAddress: address.replace('ronin:', '0x') }
  }
  const response2 = await postRequest({ url: GRAPHQL_SERVER_URL, payload })
  const inGameName = response2.data.publicProfileWithRoninAddress.name

  const now = new Date()
  const timeBetweenClaim = 1000 * 60 * 60 * 24 * 14
  const totalSlp = playerData.total
  const claimableSlp = playerData.claimable_total
  const inGameSlp = totalSlp - claimableSlp
  const todaySlpSoFar = 0
  const yesterdaySlp = 0
  const lastClaimTime = playerData.blockchain_related?.signature?.timestamp * 1000 || null
  const lastClaimDate = lastClaimTime ? new Date(lastClaimTime) : null
  const nextClaimTime = lastClaimTime ? (lastClaimTime + timeBetweenClaim) : null
  const nextClaimDate = lastClaimTime ? new Date(nextClaimTime) : null
  const daysUntilNextClaim = lastClaimTime ? getNumberOfDays(now.getTime(), nextClaimTime) : null
  const daysSinceLastClaim = lastClaimTime ? getNumberOfDays(lastClaimTime, now.getTime()) : null
  const averageSlp = Math.floor(inGameSlp / daysSinceLastClaim)
  const slpHistory = [{
    updatedTime: now.getTime(),
    updatedAt: now,
    amount: inGameSlp
  }]

  return {
    address: address.replace('ronin:', '0x'),
    inGameName,
    totalSlp,
    claimableSlp,
    inGameSlp,
    todaySlpSoFar,
    yesterdaySlp,
    lastClaimTime,
    lastClaimDate,
    nextClaimTime,
    nextClaimDate,
    daysUntilNextClaim: daysUntilNextClaim < 0 ? 0 : daysUntilNextClaim,
    daysSinceLastClaim,
    averageSlp,
    canClaim: daysSinceLastClaim >= 14,
    slpHistory
  }
}

const addAccount = async address => {
  const accounData = await fetchAccountData(address)
  const account = new Account(accounData)
  const savedAccount = await account.save()
  return savedAccount
}

const getProvider = () => {
  const provider = new ethers.providers.JsonRpcProvider(RPC_RONIN_URL, Number(RONIN_CHAIN_ID))
  return provider
}

const getWallet = (provider, privateKey) => {
  const wallet = new ethers.Wallet(privateKey, provider)
  return wallet
}

const createRandomMessage = async () => {
  const payload = {
    query: createRandomMessageQuery,
    operationName: 'CreateRandomMessage',
    variables: {}
  }

  const response = await axios.post(GRAPHQL_SERVER_URL2, payload)
  const data = response.data

  const message = data?.data?.createRandomMessage
  return message
}

const createAccessTokenWithSignature = async props => {
  const { message, owner, signature, mainnet } = props
  const payload = {
    query: createAccessTokenQuery,
    operationName: 'CreateAccessTokenWithSignature',
    variables: { input: { mainnet, message, owner, signature } }
  }
  const response = await axios.post(GRAPHQL_SERVER_URL2, payload)
  const token = response.data.data.createAccessTokenWithSignature.accessToken
  return token
}

const getAccessToken = async wallet => {
  const randomMessage = await createRandomMessage()
  const signature = await wallet.signMessage(randomMessage)
  const token = await createAccessTokenWithSignature({
    mainnet: 'ronin',
    message: randomMessage,
    owner: wallet.address,
    signature: signature
  })
  return token
}

module.exports = {
  fetchAccountData,
  addAccount,
  getProvider,
  getWallet,
  getAccessToken
}
