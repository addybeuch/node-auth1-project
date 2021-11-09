const router = require("express").Router();
const { restricted } = require("../auth/auth-middleware");
const User = require("../users/users-model");

router.get("/", restricted, async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
