const router = require("express").Router();
const User = require("../users/users-model");
const bcrypt = require("bcryptjs");
const {
  checkUsernameExists,
  checkUsernameFree,
  checkPasswordLength,
} = require("./auth-middleware");

router.post(
  "/register",
  checkPasswordLength,
  checkUsernameFree,
  (req, res, next) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 6);
    User.add({ username, password: hash })
      .then((regUser) => {
        res.status(201).json(regUser);
      })
      .catch(next);
  }
);

router.post("/login", checkUsernameExists, (req, res, next) => {
  const { password } = req.body;
  if (bcrypt.compareSync(password, req.user.password)) {
    req.session.user = req.user;
    res.json({ message: `Welcome ${req.user.username}` });
  } else {
    next({ status: 401, message: "Invalid credentials" });
  }
});

router.get("/logout", async (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.json({ message: "logged out" });
      }
    });
  } else {
    res.json({ message: "no session" });
  }
});

module.exports = router;
