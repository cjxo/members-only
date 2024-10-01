const db = require("../db/db-fns.js");
const { passport } = require("../passport/passport-setup");
const ms = require("../membership-status-enums");

const getIndex = async (req, res) => {
  const posts = await db.getPosts();
  res.render("index", { theUser: req.user, posts: posts });
};

const getSignIn = (req, res) => {
  if (!req.user) {
    res.render("signin", { error: req.query.error === "true" });
  } else {
    res.redirect("/");
  }
};

const getSignUp = (req, res) => {
  if (!req.user) {
    res.render("signup", { error: req.query.already_exists === "true" });
  } else {
    res.redirect("/");
  }
};

const getSignOut = (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
};

const postSignUp = async (req, res, next) => {
  try {
    const existedUser = await db.getUserByUsername(req.body.username);
    if (existedUser.length) {
      res.redirect("/sign-up?already_exists=true");
    } else {
      await db.insertNewUser(req.body.first_name, req.body.last_name, req.body.username, req.body.password, ms.Member);
      res.redirect("sign-in");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error: Failed to sign user up.");
    next(err);
  }
};

const postSignIn = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/sign-in?error=true",
});

const getJoinTheClub = async (req, res) => {
  if (req.user) {
    if ((req.user.membership_status & ms.PartOfTheClub) === 0) {
      const riddle = await db.getRiddles();
      res.render("join-the-club", { wrong: req.query.wrong === "true", riddle: riddle[0] });
    } else {
      res.redirect("/");
    }
  } else {
    res.redirect("/sign-up");
  }
};

const postJoinTheClub = async (req, res) => {
  const answer = req.body.secret_password;
  const riddle = await db.getRiddleById(parseInt(req.params.id));
  if (riddle.answer !== answer.toLowerCase()) {
    res.redirect("/join-the-club?wrong=true");
  } else {
    await db.updateUserMembership(req.user.id, ms.Member | ms.PartOfTheClub);
    res.redirect("/");
  }
};

const postUserPost = async (req, res) => {
  try {
    await db.insertNewPost(req.body.post_title, req.body.user_post, parseInt(req.params.id));
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error: Failed to post.");
  }
};

module.exports = {
  getIndex,
  getSignIn,
  getSignUp,
  getSignOut,
  postSignUp,
  postSignIn,
  getJoinTheClub,
  postJoinTheClub,
  postUserPost,
};
