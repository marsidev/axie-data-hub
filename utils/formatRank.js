const formatRank = (rank, from = 1) => {
  if (Array.isArray(rank)) {
    return rank.map((r, i) => {
      return {
        rank: i + from,
        name: r.name,
        client_id: r.client_id,
        elo: r.elo
      }
    })
  } else {
    return {
      rank: rank.rank,
      name: rank.name,
      client_id: rank.client_id,
      elo: rank.elo
    }
  }
}

module.exports = formatRank
