const util = require("minecraft-server-util");
const JSONdb = require("simple-json-db");
const config = new JSONdb("db/config.json");

async function getServerStatus(serverId) {
  const servers = new JSONdb("db/servers.json");
  let serverInfo = servers.get(serverId);
  if (serverInfo === undefined) {
    return null;
  }
  if (serverInfo.creationStatus !== undefined) {
    return serverInfo;
  }
  let parsedLocation = util.parseAddress(serverInfo.localAddress);
  let options = { timeout: config.get("statusTimeout") };
  let server;
  try {
    server = await util.status(
      parsedLocation.host,
      parsedLocation.port,
      options
    );
  } catch (e) {
    return { offline: true };
  }
  return server;
}
async function opPlayer(serverId, username) {
  return runRCON(serverId, `op ${username}`);
}
async function deopPlayer(serverId, username) {
  return runRCON(serverId, `deop ${username}`);
}

async function runRCON(serverId, cmd) {
  const servers = new JSONdb("db/servers.json");
  let serverInfo = servers.get(serverId);
  if (serverInfo === undefined) {
    return null;
  }
  let parsedLocation = util.parseAddress(serverInfo.localAddress);
  try {
    const client = new util.RCON();
    await client.connect(parsedLocation.host, parsedLocation.port);
    await client.login("minecraft");
    await client.run(cmd);
    await client.close();
  } catch (e) {
    console.log(`Problem running RCON cmd: ${cmd}`);
  }
}

module.exports = { getServerStatus, opPlayer, deopPlayer };
