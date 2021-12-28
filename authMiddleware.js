let e = (module.exports = {});
// let users = require("./global.db").users;
e.requireAuth = (req, res, next) => {
  if (req.user && req.user.emails[0].verified) {
    next();
  } else {
    res.sendStatus(401);
    return;
    // res.redirect("/login");
  }
};
e.requireAuthRedirect = (req, res, next) => {
  if (req.user && req.user.emails[0].verified) {
    next();
  } else {
    // res.sendStatus(401);
    res.redirect("/login");
    return;
  }
};
e.requireAdmin = (req, res, next) => {
  // console.log(global.db.users);
  if (
    req.user &&
    req.user.emails[0].verified &&
    global.db.users[req.user.emails[0].value].permissions.includes("admin")
  ) {
    next();
  } else {
    res.sendStatus(401);
  }
};
