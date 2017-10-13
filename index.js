const fetch = require('isomorphic-fetch')
const {send} = require('micro')
const {router, get} = require('microrouter')

const repos = []

const getRepos = async user => {
  const resp = await fetch(`https://api.github.com/users/${user}/repos`)

  return resp.json()
}

function storeRepos() {
  getRepos('atilafassina')
  .then(gh => {
    const noForks = gh.filter(({fork}) => !fork)
    noForks.forEach(({name, description, homepage, html_url, stargazers_count}) => {
      repos.push({
        name,
        description,
        homepage,
        repoLink: html_url,
        stars: stargazers_count
      })
    })
  })
}

const ghRepos = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  return send(res, 200, repos)
}

storeRepos('atilafassina')
setInterval(storeRepos, 2 * 60 * 60 * 10000)

module.exports = router(
  get('/repos', ghRepos),
)