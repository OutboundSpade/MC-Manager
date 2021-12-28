require("dotenv").config();
const port = process.env.PORT;

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const auth = require("./authMiddleware");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(
  cookieSession({
    name: "mc-manager-login-session",
    keys: ["key1", "key2"],
  })
);
app.use(express.static("./public"));

require("./passportInit");

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login?err=prob" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/login");
});

app.use("/api", auth.requireAuth, require("./routes/api.js"));
// app.use("/api", require("./routes/api.js"));

app.set("view engine", "ejs");
app.get("/", auth.requireAuthRedirect, (req, res, next) => {
  res.render("index");
});
app.use("/server", auth.requireAuthRedirect, require("./routes/server.js"));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
