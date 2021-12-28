const JSONdb = require("simple-json-db");
const config = new JSONdb("db/config.json");
const docker = require("./docker.js");
const { resolve: dnsResolve } = require("dns/promises");
const dns = require("./plugin/dns/dns.js");
const proxy = require("./plugin/dns/proxy.js");
async function createServer(id, name, version, subdomain, seed) {
  const servers = new JSONdb("db/servers.json");

  servers.set(id, {
    name: name,
    version: version,
    url: subdomain + "." + config.get("parentDomain"),
    localAddress: `${id}:25565`,
    seed: seed,
    creationStatus: "",
  });
  servers.sync();

  //for testing
  // servers.get(id).localAddress = servers.get(id).url;
  // servers.sync();

  setCreationStatus(id, "Creating container...");
  docker.createContainer(id, version, { seed: seed });

  setCreationStatus(id, "Creating A record...");
  await dns.newA(
    servers.get(id).url,
    (
      await dnsResolve(process.env.DNS_TARGET, "A")
    )[0]
  );

  setCreationStatus(id, "Creating SRV record...");
  await dns.newSRV(
    servers.get(id).url,
    30069,
    "_minecraft",
    servers.get(id).url
  );

  setCreationStatus(id, "Updating Proxy...");
  await proxy.addProxy(
    servers.get(id).url,
    `${id}:25565`,
    servers.get(id).name,
    servers.get(id).version
  );
  setCreationStatus(id, "Starting Server...");
  setTimeout(() => {
    delete servers.get(id).creationStatus;
    servers.sync();
  }, 30000);
}
function setCreationStatus(id, value) {
  const servers = new JSONdb("db/servers.json");
  console.log(`${value} for ${id}`);
  servers.get(id).creationStatus = value;
  servers.sync();
}
async function deleteServer(id) {
  const servers = new JSONdb("db/servers.json");
  console.log(`Deleting ${id}`);
  let url = servers.get(id).url;
  let recordSRV = (await dns.getSRV()).find(
    (i) => i.name == `_minecraft._tcp.${url}`
  );
  let recordA = (await dns.getA()).find((i) => i.name == url);
  console.log(`Deleting ${id} from db`);
  servers.delete(id);
  console.log(`Deleting ${id} container`);
  docker.removeContainer(id);
  console.log(`Deleting ${id} SRV from dns record`);
  await dns.delRecord(recordSRV.id);
  console.log(`Deleting ${id} A from dns record`);
  await dns.delRecord(recordA.id);

  console.log(`Deleting ${id} from proxy`);
  await proxy.removeProxy(url);
}
async function startServer(id) {
  console.log(`Starting server ${id}`);
  let container = (await docker.listContainers()).find(
    (i) => i.Names[0] == `/${id}`
  );
  docker.startContainer(container.Id);
}
async function stopServer(id) {
  console.log(`Stopping server ${id}`);
  let container = (await docker.listContainers()).find(
    (i) => i.Names[0] == `/${id}`
  );
  docker.stopContainer(container.Id);
}

module.exports = { createServer, deleteServer, startServer, stopServer };
