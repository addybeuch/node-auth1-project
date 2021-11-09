const dbConfig = require("../../data/db-config");
const User = require("../users/users-model");

function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next({ status: 401, message: "You shall not pass!" });
  }
}

async function checkUsernameFree(req, res, next) {
  const username = req.body.username;
  const check = await dbConfig("users").where({ username }).first();
  if (check) {
    res.status(422).json({ message: "Username taken" });
  } else {
    next();
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username });
    if (users.length) {
      req.user = users[0];
      next();
    } else {
      next({ message: "Invalid credentials", status: 401 });
    }
  } catch (err) {
    next(err);
  }
}

function checkPasswordLength(req, res, next) {
  if (!req.body.password || req.body.password.length < 4) {
    return next({
      status: 422,
      message: "Password must be longer than 3 chars",
    });
  } else {
    next();
  }
}

module.exports = {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
  restricted,
};
