const GetAxieDetailQuery =
  'query GetAxieDetail($axieId: ID!) {\n  axie(axieId: $axieId) {\n    ...AxieDetail\n    __typename\n  }\n}\n\nfragment AxieDetail on Axie {\n  id\n  image\n  class\n  chain\n  name\n  genes\n  owner\n  birthDate\n  bodyShape\n  class\n  sireId\n  sireClass\n  matronId\n  matronClass\n  stage\n  title\n  breedCount\n  level\n  figure {\n    atlas\n    model\n    image\n    __typename\n  }\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  ownerProfile {\n    name\n    __typename\n  }\n  battleInfo {\n    ...AxieBattleInfo\n    __typename\n  }\n  children {\n    id\n    name\n    class\n    image\n    title\n    stage\n    __typename\n  }\n  __typename\n}\n\nfragment AxieBattleInfo on AxieBattleInfo {\n  banned\n  banUntil\n  level\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n'

const NewSlpExchangeRateQuery =
  'query NewSlpExchangeRate {\n  exchangeRate {\n    slp {\n      usd\n      __typename\n    }\n    __typename\n  }\n}\n'

const NewEthExchangeRateQuery =
  'query NewEthExchangeRate {\n  exchangeRate {\n    eth {\n      usd\n      __typename\n    }\n    __typename\n  }\n}\n'

const NewAxsExchangeRateQuery =
  'query NewAxsExchangeRate {\n  exchangeRate {\n    axs {\n      usd\n      __typename\n    }\n    __typename\n  }\n}\n'

const NewRonExchangeRateQuery =
  'query NewRonExchangeRate {\n  exchangeRate {\n    ron {\n      usd\n      __typename\n    }\n    __typename\n  }\n}\n'

const GetAxieBriefListQuery =
  'query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieBrief\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieBrief on Axie {\n  id\n  name\n  stage\n  class\n  breedCount\n  image\n  title\n  battleInfo {\n    banned\n    __typename\n  }\n  auction {\n    currentPrice\n    currentPriceUSD\n    __typename\n  }\n  parts {\n    id\n    name\n    class\n    type\n    specialGenes\n    __typename\n  }\n  __typename\n}\n'

const GetAxieLatestQuery =
  'query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieRowData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieRowData on Axie {\n  id\n  image\n  class\n  name\n  genes\n  owner\n  class\n  stage\n  title\n  breedCount\n  level\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n'

const GetAxieNameQuery =
  'query GetAxieName($axieId: ID!) {\n  axie(axieId: $axieId) {\n    ...AxieName\n    __typename\n  }\n}\n\nfragment AxieName on Axie {\n  name\n  __typename\n}\n'

const GetProfileNameByRoninAddressQuery =
  'query GetProfileNameByRoninAddress($roninAddress: String!) {\n  publicProfileWithRoninAddress(roninAddress: $roninAddress) {\n    accountId\n    name\n    __typename\n  }\n}\n'

const GetRecentlyAxiesSoldQuery =
  'query GetRecentlyAxiesSold($from: Int, $size: Int) {\n  settledAuctions {\n    axies(from: $from, size: $size) {\n      total\n      results {\n        ...AxieSettledBrief\n        transferHistory {\n          ...TransferHistoryInSettledAuction\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieSettledBrief on Axie {\n  id\n  name\n  image\n  class\n  breedCount\n  __typename\n}\n\nfragment TransferHistoryInSettledAuction on TransferRecords {\n  total\n  results {\n    ...TransferRecordInSettledAuction\n    __typename\n  }\n  __typename\n}\n\nfragment TransferRecordInSettledAuction on TransferRecord {\n  from\n  to\n  txHash\n  timestamp\n  withPrice\n  withPriceUsd\n  fromProfile {\n    name\n    __typename\n  }\n  toProfile {\n    name\n    __typename\n  }\n  __typename\n}\n'

const createAccessTokenQuery =
  'mutation CreateAccessTokenWithSignature($input: SignatureInput!) { createAccessTokenWithSignature(input: $input) { newAccount result accessToken __typename } }'

const createRandomMessageQuery = 'mutation CreateRandomMessage { createRandomMessage }'

const GetAxieChildrenQuery =
  'query GetAxieChildren($axieId: ID!) {\n  axie(axieId: $axieId) {\n ...AxieChildren\n  }\n}\n\nfragment AxieChildren on Axie {\n  children {\n    id\n    name\n    class\n    image\n    stage\n    breedCount\n    genes\n    owner\n  } \n}'

const GetAxieGenes =
  'query GetAxieGenes($axieId: ID!) {\n  axie(axieId: $axieId) {\n ...AxieDetail\n  }\n}\n\nfragment AxieDetail on Axie {\n  genes\n}'

const GetAxieStats =
  'query GetAxieStats($axieId: ID!) {\n  axie(axieId: $axieId) {\n ...AxieDetail\n\n  }\n}\n\nfragment AxieDetail on Axie {\n  stats {\n    ...AxieStats\n  }\n}\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n}'

const GetAxieParts =
  'query GetAxieParts($axieId: ID!) {\n  axie(axieId: $axieId) {\n ...AxieDetail\n\n  }\n}\n\nfragment AxieDetail on Axie {\n  parts {\n    ...AxiePart\n  }\n}\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n}\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n}'

const payloadByCurrency = {
  slp: {
    query: NewSlpExchangeRateQuery,
    operationName: 'NewSlpExchangeRate'
  },
  axs: {
    query: NewAxsExchangeRateQuery,
    operationName: 'NewAxsExchangeRate'
  },
  eth: {
    query: NewEthExchangeRateQuery,
    operationName: 'NewEthExchangeRate'
  },
  ron: {
    query: NewRonExchangeRateQuery,
    operationName: 'NewRonExchangeRate'
  }
}

module.exports = {
  GetAxieDetailQuery,
  NewSlpExchangeRateQuery,
  NewEthExchangeRateQuery,
  NewAxsExchangeRateQuery,
  NewRonExchangeRateQuery,
  GetAxieBriefListQuery,
  GetAxieLatestQuery,
  GetAxieNameQuery,
  GetProfileNameByRoninAddressQuery,
  GetRecentlyAxiesSoldQuery,
  payloadByCurrency,
  createRandomMessageQuery,
  createAccessTokenQuery,
  GetAxieChildrenQuery,
  GetAxieGenes,
  GetAxieStats,
  GetAxieParts
}
