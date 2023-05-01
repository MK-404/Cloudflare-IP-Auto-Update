module.exports = {
    apps: [{
        name: "Cloudflare Autoproxy",
        script: "./index.js",
        env: {
            "zoneId": 'yourZoneId',
            "apiToken": 'yourApiToken',
            "checkInterval": 60000 //milliseconds
        },
    }]
}
