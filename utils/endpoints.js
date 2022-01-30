const { validCurrencies } = require('./index')

const endpoints = [
  {
    method: 'GET',
    path: '/info',
    description: 'Returns information about the API.'
  },
  {
    method: 'GET',
    path: '/version',
    description: 'Returns the current version of the API.'
  },
  {
    method: 'GET',
    endpoint: '/endpoints',
    description: 'Get all available endpoints.'
  },
  {
    method: 'GET',
    endpoint: '/auction/onsale',
    description: 'Get latest axies on sale.'
  },
  {
    method: 'GET',
    endpoint: '/auction/sold',
    description: 'Get latest axies sold.'
  },
  {
    method: 'GET',
    endpoint: '/axie/{axieId}',
    description: 'Get axie data.'
  },
  {
    method: 'GET',
    endpoint: '/axie/{axieId}/genes',
    description: 'Get axie genes.'
  },
  {
    method: 'GET',
    endpoint: '/axie/{axieId}/name',
    description: 'Get axie name.'
  },
  {
    method: 'GET',
    endpoint: '/axie/{axieId}/children',
    description: 'Get axie childrens if has any.'
  },
  {
    method: 'GET',
    endpoint: '/cards/{patchId}',
    description:
      'Get ability cards data from certain patch. Fetch \'/cards/current\' to retrieve current patch\'s data.'
  },
  {
    method: 'GET',
    endpoint: '/cards/patches',
    description: 'Get info of different cards balance patches.'
  },
  {
    method: 'GET',
    endpoint: '/effects',
    description: 'Get all ability card effects.'
  },
  {
    method: 'GET',
    endpoint: '/effects/buffs',
    description: 'Get all ability card buff effects.'
  },
  {
    method: 'GET',
    endpoint: '/effects/debuffs',
    description: 'Get all ability card debuff effects.'
  },
  {
    method: 'GET',
    endpoint: '/exchange/{symbol}',
    description: `Get exchange data. Available symbols: ${validCurrencies.join(
      ', '
    )}.`
  },
  {
    method: 'GET',
    endpoint: '/leaderboard',
    description: 'Get MMR leaderboard of current season.'
  },
  {
    method: 'GET',
    endpoint: '/leaderboard/previous',
    description: 'Get MMR leaderboard of previous season.'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/slp',
    description: 'Get player SLP stats.'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/data',
    description: 'Get player data.'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/mmr',
    description: 'Get player MMR data.'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/mmr/previous',
    description: 'Get player MMR data of previous season.'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/axies',
    description: 'Get player axies.'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/name',
    description: 'Get player name.'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/battles',
    description: 'Get player battles.'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/battles/{battleType}',
    description:
      'Get player battles of specific type - available types are \'pvp\' and \'pve\'.'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/wallet/transactions',
    description: 'Get latest player transactions.'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/wallet/tokens.',
    description: 'Get player tokens'
  },
  {
    method: 'POST',
    endpoint: '/player/auth',
    description:
      'Get player authorization token. You must provide your Ronin Wallet private key in the request body.'
  },
  {
    method: 'GET',
    endpoint: '/stats/base',
    description: 'Get axie classes base stats.'
  },
  {
    method: 'GET',
    endpoint: '/stats/base/{className}',
    description: 'Get axie base stats of specific class.'
  },
  {
    method: 'GET',
    endpoint: '/stats/body-part',
    description: 'Get stats added by body parts of each class.'
  },
  {
    method: 'GET',
    endpoint: '/stats/body-part/{className}',
    description: 'Get stats added by body parts of specific class.'
  }
]

module.exports = endpoints
