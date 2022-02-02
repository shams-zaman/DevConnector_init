const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const User = require("../../models/User");

//............................................

router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "email is required").isEmail(),
    check("password", "pass is required").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    //Checking If email Match
    try {
      let user = await User.findOne({ email });

      //if Match..
      if (user) {
        return res.status(400).json({ errors: [{ msg: "user exist!" }] });
      }
      //GRAVATAR
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //            encrypt Pass
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save(); //This Return Promise

      // res.send("user_Registered Success");
      //............END.............//

      //TODO:       Up to jwt Done.......

      //          1.Jwt Payload (DATA)
      const payload = {
        user: {
          id: user.id,
        },
      };

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

    //     // THEN...IF user Exist
    //     //taking all Body_req->then try_cach
    //     const { name, email, password } = req.body;
    //     try {
    //       //if user exist
    //       // let user = await User.findOne({ email });

    //       // if (user) {
    //       //   return res.status(400).json({ errors: [{ msg: "user exist!" }] });
    //       }
    //       //get avater
    //       const avatar = gravatar.url(email, {
    //         s: "200",
    //         r: "pg",
    //         d: "mm",
    //       });
    //       user = new User({
    //         name,
    //         email,
    //         avatar,
    //         password,
    //       });
    //       //            encrypt Pass
    //       const salt = await bcrypt.genSalt(10);
    //       user.password = await bcrypt.hash(password, salt);
    //       await user.save();

    //       //            return jwt
    //       const payload = {
    //         user: {
    //           id: user.id,
    //         },
    //       };
    //       jwt.sign(payload);

    //       // res.send("User regyed");
    //     } catch (err) {
    //       console.error(err.message);
    //       res.status(500).send("server_error!");
    //     }
  }
);

module.exports = router;
