const Docker = require("dockerode");
const docker = new Docker();
const JSONdb = require("simple-json-db");

async function createContainer(name, version, options) {
  const config = new JSONdb("db/config.json");
  await pullImage("itzg/minecraft-server:latest");
  // await docker.pull(config.get("container"));
  let o = [];

  if (options !== undefined) {
    if (options.seed !== undefined && options.seed != "") {
      o.push(`SEED=${options.seed}`);
    }
  }
  docker.run(config.get("container"), [], undefined, {
    // User: "1000",
    name: name,
    // Volumes: {
    //   "/home/user": {},
    // },
    ExposedPorts: {
      // "5901/tcp": {},
    },
    ENV: ["EULA=TRUE", `VERSION=${version}`, ...o],
    HostConfig: {
      // Memory: Number(process.env.DOCKER_MEM_LIMIT) * 1000000,
      // NanoCpus: Number(process.env.DOCKER_CPU_LIMIT) * 1000000000,
      Binds: [`${config.get("mcServerMountPath")}/${name}:/data:z`],
      // Mounts: [
      //   {
      //     Target: process.env.CONTAINER_PATH,
      //     Source: db.users[user].path,
      //     Type: "bind",
      //     BindOptions: { Propagation: "rshared" },
      //   },
      // ],
      AutoRemove: false,
      NetworkMode: process.env.NETWORK_NAME,
      // PortBindings: {
      //   "5901/tcp": [
      //     {
      //       HostPort: port + "/tcp",
      //     },
      //   ],
      // },
    },
  });
}
async function removeContainer(name) {
  const containers = await listContainers();
  const id = containers.find((i) => i.Names[0] == `/${name}`).Id;
  console.log(id);
  let cont = docker.getContainer(id);
  await cont.kill();
  await cont.remove();
}
async function pullImage(image) {
  return new Promise((resolve, reject) => {
    docker.pull(image, (err, stream) => {
      docker.modem.followProgress(stream, onFinished, onProgress);

      function onFinished(err, output) {
        if (!err) {
          console.log("\nDone pulling.");
          resolve();
        } else {
          reject(err);
        }
      }
      function onProgress(event) {}
    });
  });
}
async function listContainers() {
  return docker.listContainers({ all: true });
}
async function startContainer(id) {
  if (!(await docker.getContainer(id).inspect()).State.Running) {
    await docker.getContainer(id).start();
    return;
  }
  console.log(`Container ${id} already running!`);
}
async function stopContainer(id) {
  if ((await docker.getContainer(id).inspect()).State.Running) {
    await docker.getContainer(id).stop();
    return;
  }
  console.log(`Container ${id} already stopped!`);
}
module.exports = {
  createContainer,
  removeContainer,
  listContainers,
  startContainer,
  stopContainer,
};
