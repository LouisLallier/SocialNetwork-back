module.exports.authGate = (req, res, next) => {
  console.log("hello auth gate !");
  //TODO Check if session token is valid (by decoding it!!)
  // you can also check other infos :
  // example :  const user = await findUserById(decodedSessionToken.id))

  next();
  //TODO if token is valid => Return what you need in next() to be used by your protected route
  // ex: next({user})
  // else return error
};
