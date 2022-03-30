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
    path: '/endpoints',
    description: 'Get all available endpoints.'
  },
  {
    method: 'GET',
    path: '/auction/onsale',
    description: 'Get latest axies on sale.'
  },
  {
    method: 'GET',
    path: '/auction/sold',
    description: 'Get latest axies sold.'
  },
  {
    method: 'GET',
    path: '/axie/{axieId}',
    description: 'Get axie data.'
  },
  {
    method: 'GET',
    path: '/axie/{axieId}/genes',
    description: 'Get axie genes.'
  },
  {
    method: 'GET',
    path: '/axie/{axieId}/name',
    description: 'Get axie name.'
  },
  {
    method: 'GET',
    path: '/axie/{axieId}/children',
    description: 'Get axie childrens if has any.'
  },
  {
    method: 'GET',
    path: '/cards/{patchId}',
    description:
      'Get ability cards data from certain patch. Fetch \'/cards/current\' to retrieve current patch\'s data.'
  },
  {
    method: 'GET',
    path: '/cards/patches',
    description: 'Get info of different cards balance patches.'
  },
  {
    method: 'GET',
    path: '/effects',
    description: 'Get all ability card effects.'
  },
  {
    method: 'GET',
    path: '/effects/buffs',
    description: 'Get all ability card buff effects.'
  },
  {
    method: 'GET',
    path: '/effects/debuffs',
    description: 'Get all ability card debuff effects.'
  },
  {
    method: 'GET',
    path: '/exchange/{symbol}',
    description: `Get exchange data. Available symbols: ${validCurrencies.join(
      ', '
    )}.`
  },
  {
    method: 'GET',
    path: '/leaderboard',
    description: 'Get MMR leaderboard of current season. You can use query params \'from\' and \'to\' to get data from certain ranking range.'
  },
  {
    method: 'GET',
    path: '/leaderboard/previous',
    description: 'Get MMR leaderboard of previous season. You can use query params \'from\' and \'to\' to get data from certain ranking range.'
  },
  {
    method: 'GET',
    path: '/leaderboard/history',
    description: 'Retrieve a list of available season top 1000 leaderboards.'
  },
  {
    method: 'GET',
    path: '/leaderboard/history/{seasonId}',
    description: 'Get top 1000 leaderboard of certain season. Fetch \'/leaderboard/history\' to retrieve available seasons.'
  },
  {
    method: 'GET',
    path: '/player/{roninAddress}/slp',
    description: 'Get player SLP stats.'
  },
  {
    method: 'GET',
    path: '/player/{roninAddress}/data',
    description: 'Get player data.'
  },
  {
    method: 'GET',
    path: '/player/{roninAddress}/mmr',
    description: 'Get player MMR data.'
  },
  {
    method: 'GET',
    path: '/player/{roninAddress}/mmr/previous',
    description: 'Get player MMR data of previous season.'
  },
  {
    method: 'GET',
    path: '/player/{roninAddress}/axies',
    description: 'Get player axies.'
  },
  {
    method: 'GET',
    path: '/player/{roninAddress}/name',
    description: 'Get player name.'
  },
  {
    method: 'GET',
    path: '/player/{roninAddress}/battles',
    description: 'Get player battles.'
  },
  {
    method: 'GET',
    path: '/player/{roninAddress}/battles/{battleType}',
    description:
      'Get player battles of specific type - available types are \'pvp\' and \'pve\'.'
  },
  {
    method: 'GET',
    path: '/player/{roninAddress}/wallet/transactions',
    description: 'Get latest player transactions.'
  },
  {
    method: 'GET',
    path: '/player/{roninAddress}/wallet/tokens.',
    description: 'Get player tokens'
  },
  {
    method: 'POST',
    path: '/player/auth',
    description:
      'Get player authorization token. You must provide your Ronin Wallet private key in the request body.'
  },
  {
    method: 'GET',
    path: '/stats/base',
    description: 'Get axie classes base stats.'
  },
  {
    method: 'GET',
    path: '/stats/base/{className}',
    description: 'Get axie base stats of specific class.'
  },
  {
    method: 'GET',
    path: '/stats/body-part',
    description: 'Get stats added by body parts of each class.'
  },
  {
    method: 'GET',
    path: '/stats/body-part/{className}',
    description: 'Get stats added by body parts of specific class.'
  }
]

module.exports = endpoints
