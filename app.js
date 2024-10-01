const express = require("express");
const path = require("node:path");
const { passSession, passport } = require("./passport/passport-setup");
const indexRouter = require("./routes/index-route");
// Auth stuff

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(passSession);
app.use(passport.session());

app.use("/", indexRouter);

const PORT_NUMBER = 3000;
app.listen(PORT_NUMBER, () => {
  console.log(`Click me: http://localhost:${PORT_NUMBER}`);
});
