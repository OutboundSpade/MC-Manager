const axios = require("axios");
const protocolVersions = require("./protocolVersions.json");
async function addProxy(url, proxyTo, name, version) {
  console.log(`${process.env.INFRARED_ADDR}/proxies/${url}`);
  let res = await axios.post(
    `http://${process.env.INFRARED_ADDR}/proxies/${url}`,
    {
      domainName: url,
      proxyTo: proxyTo,
      onlineStatus: {
        versionName: `${version}`,
        protocolNumber:
          protocolVersions[version] === undefined
            ? protocolVersions["1.18.1"]
            : protocolVersions[version],
        maxPlayers: 0,
        playersOnline: 0,
        motd: `${name}`,
      },
    }
  );
  // console.log(res.status);
  // console.log(res.data);
}
async function removeProxy(url) {
  await axios.delete(`http://${process.env.INFRARED_ADDR}/proxies/${url}`);
}
module.exports = { addProxy, removeProxy };
