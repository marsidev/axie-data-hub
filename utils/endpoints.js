const { validCurrencies } = require('./index')

const endpoints = [
  {
    method: 'GET',
    path: '/info',
    description: 'Returns information about the API'
  },
  {
    method: 'GET',
    path: '/version',
    description: 'Returns the current version of the API'
  },
  {
    method: 'GET',
    endpoint: '/endpoints',
    description: 'Get all available endpoints'
  },
  {
    method: 'GET',
    endpoint: '/auction/onsale',
    description: 'Get latest axies on sale'
  },
  {
    method: 'GET',
    endpoint: '/auction/sold',
    description: 'Get latest axies sold'
  },
  {
    method: 'GET',
    endpoint: '/axie/{axieId}',
    description: 'Get axie data'
  },
  {
    method: 'GET',
    endpoint: '/axie/{axieId}/genes',
    description: 'Get axie genes'
  },
  {
    method: 'GET',
    endpoint: '/axie/{axieId}/name',
    description: 'Get axie name'
  },
  {
    method: 'GET',
    endpoint: '/axie/{axieId}/children',
    description: 'Get axie childrens if has any'
  },
  {
    method: 'GET',
    endpoint: '/cards',
    description: 'Get all cards data of current patch'
  },
  {
    method: 'GET',
    endpoint: '/exchange/{symbol}',
    description: `Get exchange data. Available symbols: ${validCurrencies.join(', ')}`
  },
  {
    method: 'GET',
    endpoint: '/leaderboard',
    description: 'Get MMR leaderboard of current season'
  },
  {
    method: 'GET',
    endpoint: '/leaderboard/previous',
    description: 'Get MMR leaderboard of previous season'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/data',
    description: 'Get player data'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/mmr',
    description: 'Get player MMR data'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/mmr/previous',
    description: 'Get player MMR data of previous season'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/axies',
    description: 'Get player axies'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/name',
    description: 'Get player name'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/battles',
    description: 'Get player battles'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/battles/{battleType}',
    description:
      'Get player battles of specific type - available types are \'pvp\' and \'pve\''
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/transactions',
    description: 'Get latest player transactions'
  },
  {
    method: 'GET',
    endpoint: '/player/{roninAddress}/tokens',
    description: 'Get player tokens'
  }
]

module.exports = endpoints