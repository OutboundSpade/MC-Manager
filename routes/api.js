const { Router } = require("express");
const router = Router();
const JSONdb = require("simple-json-db");
const mc = require("../minecraft.js");
const server = require("../serverAction.js");
const dns = require("dns/promises");
router.get("/ping", (req, res) => {
  res.send("pong");
});
router.get("/servers/recordExists/:sub", async (req, res) => {
  let record = await dns
    .resolveSrv("_minecraft._tcp." + req.params.sub)
    .catch((e) => {});
  res.send({ isValid: record != null });
});
router.get("/servers/getIDs", (req, res) => {
  const servers = new JSONdb("db/servers.json");
  res.send(Object.keys(servers.JSON()));
});
router.get("/servers/get/:id", async (req, res) => {
  let serverStatus = await mc.getServerStatus(req.params.id);
  // console.log(server);
  if (serverStatus === null) {
    res.sendStatus(404);
    return;
  }
  const servers = new JSONdb("db/servers.json");
  serverStatus.name = servers.get(req.params.id).name;
  serverStatus.url = servers.get(req.params.id).url;
  res.send(serverStatus);
});
router.get("/servers/start/:id", async (req, res) => {
  const servers = new JSONdb("db/servers.json");
  const id = req.params.id;
  if (
    id == null ||
    servers.get(id) === undefined ||
    servers.get(id).creationStatus !== undefined
  ) {
    res.sendStatus(404);
    return;
  }
  server.startServer(id);
  res.sendStatus(200);
});
router.get("/servers/stop/:id", async (req, res) => {
  const servers = new JSONdb("db/servers.json");
  const id = req.params.id;
  let serverStatus = await mc.getServerStatus(id);
  if (
    serverStatus === null ||
    servers.get(id) === undefined ||
    servers.get(id).creationStatus !== undefined
  ) {
    res.sendStatus(404);
    return;
  }
  server.stopServer(id);
  res.sendStatus(200);
});
router.get("/servers/delete/:id", async (req, res) => {
  const servers = new JSONdb("db/servers.json");
  const id = req.params.id;
  if (
    servers.get(id) === undefined ||
    servers.get(id).creationStatus !== undefined
  ) {
    res.sendStatus(404);
    return;
  }
  server.deleteServer(id);
  res.sendStatus(200);
});
router.get("/servers/delete/:id", async (req, res) => {});
module.exports = router;
