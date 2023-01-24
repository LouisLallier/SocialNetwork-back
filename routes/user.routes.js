const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const { authGate } = require("../middleware/auth.middleware");
const { createSessionToken } = require("../controllers/auth.controller");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { log } = require("nodemon/lib/utils");

//auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logOut);
router.post("/session_token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decodedToken = jwt.verify(refreshToken, process.env.SECRET_TOKEN);

    const user = await UserModel.findById(decodedToken.id).select(
      "+refreshTokens"
    );
    const isTokenValid = user.refreshTokens.includes(refreshToken);

    if (isTokenValid) {
      res.json({ sessionToken: createSessionToken(user) });
      return; // ici je dois mettre dans le LS
    }

    throw Error("refresh token is no longer valid");
  } catch (errToken) {
    res.send({ errToken });
  }
});

// user display : 'block'
router.get("/", authGate, userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
