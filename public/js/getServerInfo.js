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
async function setServerStatus() {
  let card_ejs = await (await fetch(`/assets/views/server_card.ejs`)).text();
  let serverIDs = await (await fetch(`/api/servers/getIDs`)).json();
  serverIDs.forEach(async (id) => {
    // console.log(id);
    let cardHolder = document.createElement("div");
    cardHolder.id = `holder-${id}`;
    document.getElementById("cards").appendChild(cardHolder);
    let server = await (await fetch(`/api/servers/get/${id}`)).json();
    // console.log(server);
    let avitars;
    server.id = id;
    server.online = !server.offline && server.creationStatus === undefined;
    if (server.online) {
      let usernames =
        server.players.sample === null
          ? []
          : server.players.sample.map((i) => i.name);
      avitars = await getPlayers(usernames);
    } else {
      avitars = [];
      server.players = {};
      server.players.max = 0;
      server.players.online = 0;
    }
    // console.log(server.creationStatus !== undefined);
    let html = ejs.render(card_ejs, { server: server, avitars: avitars });
    document.getElementById(`holder-${id}`).innerHTML = html;
  });
  document.getElementById("spinner").classList.add("hidden");
}
setServerStatus();
setInterval(setServerStatus, 5000);
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
