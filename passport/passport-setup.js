const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pgSession = require("connect-pg-simple")(session);
const dbPool = require("../db/pool");
require("dotenv").config();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await dbPool.query("SELECT * FROM users WHERE username = $1;", [username]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }

      const pwordsMatched = await bcrypt.compare(password, user.password);
      if (!pwordsMatched) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await dbPool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = {
  passSession: session({
    store: new pgSession({
      pool: dbPool,
      tableName: "user_session",
      createTableIfMissing: true,
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    },
  }),
  passport: passport
}
