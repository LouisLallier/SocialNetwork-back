const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { updateUser } = require("./user.controller");

module.exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await UserModel.create({ username, email, password });
    res.status(201).json({ userId: user._id });
  } catch (err) {
    res.status(400).send({ err });
  }
};

const createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: 180000000000000,
  });
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.login(email, password);
    const refreshToken = createRefreshToken(user._id);
    await updateUser(user._id, {
      refreshTokens: [...user.refreshTokens, refreshToken],
    });

    res.status(200).json({ user, refreshToken });
    console.log("user connected, congratulation !!!");
  } catch (err) {
    console.log(err);
    res.status(401).json({ err });
  }
};

module.exports.createSessionToken = (user) => {
  return jwt.sign({ user }, process.env.SECRET_TOKEN, {
    expiresIn: 3600000,
  });
};

module.exports.logOut = async (req, res) => {};
