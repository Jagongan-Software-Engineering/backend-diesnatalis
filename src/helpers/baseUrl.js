module.exports = {
    baseUrl : process.env.MODE === 'PRODUCTION'
    ? 'https://diesnatalis-api.herokuapp.com/': 'http://localhost:3000/',
}