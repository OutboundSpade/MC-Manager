var cf = require("cloudflare")({
  token: process.env.CLOUDFLARE_TOKEN,
});

async function getZoneID() {
  return (await cf.zones.browse()).result[0].id;
}
async function getSRV() {
  return getRecordByType("SRV");
}
async function delRecord(id) {
  const zone = await getZoneID();
  await cf.dnsRecords.del(zone, id);
}
async function newSRV(url, port, service, target) {
  const zone = await getZoneID();
  await cf.dnsRecords.add(zone, {
    type: "SRV",
    ttl: 60,
    data: {
      service: service,
      proto: "_tcp",
      name: url,
      priority: 0,
      weight: 0,
      port: port,
      target: target,
    },
  });
}
async function getA() {
  return getRecordByType("A");
}
async function newA(url, target) {
  const zone = await getZoneID();
  // console.log({
  //   type: "A",
  //   ttl: 60,
  //   name: url,
  //   content: target,
  //   proxied: false,
  // });
  await cf.dnsRecords.add(zone, {
    type: "A",
    ttl: 60,
    name: url,
    content: target,
    proxied: false,
  });
}

async function getRecordByType(type) {
  let zone = await getZoneID();
  let records = (await cf.dnsRecords.browse(zone)).result.filter(
    (i) => i.type == type
  );
  return records;
}

// (async function () {
//   console.log(await getA());
// })();
module.exports = { delRecord, getSRV, newSRV, getA, newA };
