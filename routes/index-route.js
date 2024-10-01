const express = require("express");
const indexRouter = express.Router();
const ic = require("../controllers/index-controller");

indexRouter.get("/", ic.getIndex);
indexRouter.get("/sign-in", ic.getSignIn);
indexRouter.get("/sign-up", ic.getSignUp);
indexRouter.get("/sign-out", ic.getSignOut);
indexRouter.post("/sign-up", ic.postSignUp);

/*
 indexRouter.post("/sign-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {

    }
  });
});
 * */

indexRouter.post("/sign-in", ic.postSignIn);
indexRouter.get("/join-the-club", ic.getJoinTheClub);
indexRouter.post("/join-the-club/:id", ic.postJoinTheClub);

// TODO: 
// - DB functions for adding messages
// - Establish a secret password
indexRouter.post("/post/:id", ic.postUserPost);

module.exports = indexRouter;
