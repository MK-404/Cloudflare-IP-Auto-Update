const axios = require('axios')

const zoneId = process.env.zoneId
const apiToken = process.env.apiToken

console.log("\n---- AutoUpdate ----\n")

async function updateARecord(newIp) {
  const recordsResponse = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?type=A`, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    }
  })
  const records = recordsResponse.data.result

  for (let i = 0; i < records.length; i++) {
    const currentIp = records[i].content
    if (currentIp !== newIp) {
      const options = {
        type: 'A',
        name: records[i].name,
        content: newIp,
        ttl: 1,
        proxied: records[i].proxied
      }
      await axios.put(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${records[i].id}`, options, {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        }
      })
      console.log(`Record A for ${records[i].name} has been updated to ${newIp}`)
    }
  }
}

let currentIp = null
setInterval(async () => {
  const newIp = await axios.get('https://api.ipify.org?format=json')
    .then(response => response.data.ip)
    .catch(error => console.error(`Failed to retrieve public IP address: ${error}`))
  if (newIp !== currentIp) {
    console.log(`IP address has changed to ${newIp}`)
    currentIp = newIp
    await updateARecord(newIp)
  }
}, process.env.checkInterval)