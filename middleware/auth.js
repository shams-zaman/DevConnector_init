const jwt = require("jsonwebtoken");
const config = require("config"); //TODO: check Path

module.exports = (req, res, next) => {
  //Get Token from Header..
  const token = req.header("x-auth-token");

  //Check if No Token..
  if (!token) {
    return res.status(401).json({ msg: "NO TOken" });
  }

  //Verify Token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token Not Verified" });
  }
};
