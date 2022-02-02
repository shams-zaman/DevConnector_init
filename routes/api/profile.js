const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const config = require("config");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const request = require("request");
// Get api/profile/me
// desc Get current users profile
// @access Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    // NOT Exist
    if (!profile) {
      return res.status(400).json({ msg: "There is no Profile Found!" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error!!");
  }
});

// Post api/profile
// desc Create Or Update Profile
// @access Private

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status Required!").not().isEmpty(),
      check("skills", "Skills Requird!").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkdin,
    } = req.body;

    //Build Profile Object for Sending Req..

    const profileFields = {};
    profileFields.user = req.user.id;
    //              TODO: Test THe Line Bellow..
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    //Build Social Obj
    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkdin) profileFields.social.linkdin = linkdin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //Create..

      profile = new Profile(profileFields);
      await profile.save();

      res.json(profile);

      //End
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
    res.send("hi Profile");
  }
);

// Get api/profile    (All Profile)
// desc Find All profile
// @access Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get api/profile/user/:user_id
// desc Find Profile by User_id
// @access Public

router.get("/user/:user_id", async (req, res) => {
  try {
    //.....Important
    const profile = await Profile.find({ user: req.params.user_id }).populate(
      "user",
      ["name", "avatar"]
    );

    //
    if (!profile) return res.status(400).json({ msg: "Profile Not Found!" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);

    // custom Error msg for Invalid ObjectId
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile Not Found!" });
    }
    res.status(500).send("Server Error");
  }
});

// Delete api/profile
// desc Delete Profile , User and Post
// @access Private/own token

router.delete("/", auth, async (req, res) => {
  try {
    //
    //Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User Deleted!" });
    //
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Put api/profile/experience
// desc Add Profile Experience,
// @access Private/own token

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required!!").not().isEmpty(),
      check("company", "Company is required!!").not().isEmpty(),
      check("form", "form-Date is required!!").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // If No Errors.....

    // D-structuring..
    const { title, company, location, form, to, current, description } =
      req.body;

    // This will create an Object the User submit..
    const newExp = { title, company, location, form, to, current, description };

    try {
      // DB process..
      const profile = await Profile.findOne({ user: req.user.id });
      TODO: profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

// Delete api/profile/experience/:exp_id
// desc Delete Profile Experience,
// @access Private/own token

router.delete("/experience/:exp_id", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  //Get remove Index..
  const removeIndex = profile.experience
    .map((item) => item.id) // == TODO: (csl: indexOf)
    .indexOf(req.params.exp_id);

  profile.experience.splice(removeIndex, 1);
  //

  await profile.save();
  res.json(profile);
});

// Put api/profile/education
// desc Add Profile education,
// @access Private/own token

router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is required!!").not().isEmpty(),
      check("degree", "degree is required!!").not().isEmpty(),
      check("fieldofstudy", "fieldofstudy is required!!").not().isEmpty(),
      check("form", "form-Date is required!!").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // If No Errors.....

    // D-structuring..
    const { school, degree, fieldofstudy, form, to, current, description } =
      req.body;

    // This will create an Object the User submit..
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      form,
      to,
      current,
      description,
    };

    try {
      // DB process..
      const profile = await Profile.findOne({ user: req.user.id });
      TODO: profile.education.unshift(newEdu);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

// Delete api/profile/education/:edu_id
// desc Delete Profile Education,
// @access Private/own token

router.delete("/education/:edu_id", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id });

  //Get  Index of Edu..
  const removeIndex = profile.education
    .map((item) => item.id) // == TODO: (csl: indexOf)
    .indexOf(req.params.edu_id);

  profile.education.splice(removeIndex, 1);

  await profile.save();
  res.json(profile);
});

// Get api/profile/github/:username
// desc Get github repo,
// @access Public

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=2&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret:${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    // If Error on the Request..
    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Repo Found!" });
      }
      // Final Response
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
