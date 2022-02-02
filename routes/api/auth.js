const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

// @rout Get api/auth......
// desc Test route
// @access Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user); //Return User
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});
//
//  @Route :     POST API/auth
//  @desc  :     Authenticate user & get token
//  @access:     PUblic
router.post(
  "/",
  [
    check("email", "email is required").isEmail(),
    check("password", "pass is required").exists(),
  ],
  async (req, res) => {
    // IF Errors empty...Or..
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //D-Sturcturing ..(req.body)
    const { email, password } = req.body;

    //Checking If email Match
    try {
      let user = await User.findOne({ email });

      //if Match..
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credential!" }] });
      }

      //          1.Jwt Payload (DATA)
      const payload = {
        user: {
          id: user.id,
        },
      };

      //        Login Email Maching..
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credential!" }] });
      }

      //          2. Jwt Sign
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      //
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
