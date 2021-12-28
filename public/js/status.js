let userCache = new Cache("userCache");
async function getUserInfo(username) {
  if (userCache.get(username) === undefined) {
    console.log(`fetching player ${username}`);
    let userdata = await (
      await fetch(`https://playerdb.co/api/player/minecraft/${username}`)
    ).json();
    if (userdata.code == "player.found") {
      userCache.set(username, userdata);
    } else {
      console.log(userdata.code);

      console.error(`Player ${username} not found!`);
    }
  }

  return userCache.get(username);
}

async function startServer() {
  await fetch(`/api/servers/start/${server.id}`);
  location = "/";
}
async function stopServer() {
  if (
    confirm(
      "Are you sure you want to stop the server?\nAny players currently connected will be disconnected"
    )
  ) {
    await fetch(`/api/servers/stop/${server.id}`);
    location = "/";
  }
}
async function deleteServer() {
  if (
    prompt(
      `Are you sure you want to DELETE the server?\nThis is permanent an can't be undone.\nType the name of the server to confirm:\n"${server.name}"`
    ) === server.name
  ) {
    await fetch(`/api/servers/delete/${server.id}`);

    location = "/";
  }
}
