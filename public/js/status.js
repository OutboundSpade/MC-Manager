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

let userCache = new Cache("userCache");

async function getPlayers(users) {
  // console.log(users);
  // let users = ["outboundspade48", "obs12", "Notch", "DanTDM", "jeb_"];
  let limit = getWidth() > 700 ? 8 : 10;
  let icons = [];
  for (let user of users.slice(0, limit - 1)) {
    let data = await getUserInfo(user);
    let icon = document.createElement("img");
    icon.src = data.data.player.avatar;
    icon.title = user;

    icons.push(icon);
  }
  // console.log(users);

  if (users.length > limit) {
    let threedots = document.createElement("i");
    threedots.classList = "bi bi-three-dots";
    icons.push(threedots);
  } else if (users.length == limit) {
    let user = users[limit - 1];
    let data = await getUserInfo(user);
    let icon = document.createElement("img");
    icon.src = data.data.player.avatar;
    icon.title = user;

    icons.push(icon);
  }
  // console.log(icons);
  return icons;
}
async function setServerStatus(s) {
  let statusElement = document.getElementById("status");
  let currPlayers = document.getElementById("current-connected");
  let maxPlayers = document.getElementById("max-connected");

  if (s.creationStatus !== undefined) {
    statusElement.textContent = server.creationStatus;
    statusElement.classList = ["server-status-creating"];
    currPlayers.textContent = 0;
    maxPlayers.textContent = 0;
  } else if (s.offline) {
    statusElement.textContent = "OFFLINE";
    statusElement.classList = ["server-status-inactive"];
    currPlayers.textContent = 0;
    maxPlayers.textContent = 0;
  } else {
    statusElement.textContent = "ONLINE";
    statusElement.classList = ["server-status-active"];
    currPlayers.textContent = s.players.online;
    maxPlayers.textContent = s.players.max;
  }
  // console.log(s);
}

async function updatePlayers(s) {
  document.getElementById("players").innerHTML = "";

  //for debuging
  // s.players.sample.push({ name: "Notch" }, { name: "obs12" });
  if (s.players.sample === null) {
    return;
  }
  s.players.sample.forEach(async (user) => {
    let info = (await getUserInfo(user.name)).data.player;
    document.getElementById("players").innerHTML += ejs.render(player_ejs, {
      player: info,
    });
  });
}
let player_ejs = "";
async function updatePage() {
  const s = await (await fetch(`/api/servers/get/${server.id}`)).json();
  player_ejs = await (await fetch(`/assets/views/player.ejs`)).text();

  await setServerStatus(s);
  await updatePlayers(s);
}

updatePage();
setInterval(updatePage, 5000);

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
async function opPlayer(name) {
  await fetch(`/api/servers/opPlayer/${server.id}/${name}`);
  location.reload();
}
async function deopPlayer(name) {
  await fetch(`/api/servers/deopPlayer/${server.id}/${name}`);
  location.reload();
}
function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}
