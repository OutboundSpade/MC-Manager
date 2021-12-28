const { Router } = require("express");
let router = Router();
const JSONdb = require("simple-json-db");
const config = new JSONdb("db/config.json");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const server = require("../serverAction.js");
const mc = require("../minecraft.js");

router.get("/ping", (req, res, next) => {
  res.send("pong");
});
router.get("/create", (req, res) => {
  res.render("./server/create", { parentURL: config.get("parentDomain") });
});
router.get("/status/:id", async (req, res) => {
  const servers = new JSONdb("db/servers.json");
  if (Object.keys(req.params).length === 0) {
    res.sendStatus(404);
    return;
  }
  let status = await mc.getServerStatus(req.params.id);
  let s = servers.get(req.params.id);
  if (s === undefined) {
    res.redirect("/");
    return;
  }
  s.id = req.params.id;
  res.render("./server/status", {
    server: s,
    status: status,
  });
});
router.post(
  "/create",
  bodyParser.urlencoded({ extended: false }),
  (req, res) => {
    // console.log(req.body);
    const id = uuidv4();

    server.createServer(
      id,
      req.body.name,
      req.body.version,
      req.body.subdomain,
      req.body.seed
    );
    res.redirect(`/`);
  }
);
module.exports = router;
