
//Author: Jake Bolger, C18395341
//TUD

const express = require("express");
const app = express();
const router = express.Router();
const joi = require("@hapi/joi");
const models = require("../models/users");

router.post("/login", async (req, res) => {
  try {
    const schema = joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().min(6).max(20).required(),
    });
    const result = schema.validate(req.body);
    console.log(result.value);
    if (result.error) {
      throw result.error.details[0].message;
    }
    let checkUserLogin = await models.verifyUser(result.value);

    if (checkUserLogin.error) {
      throw checkUserLogin.message;
    }
    
    req.session.user = {
      name: checkUserLogin.data.name || "None",
      email: checkUserLogin.data.email || "None",
      dob: checkUserLogin.data.dob || "None",
      city: checkUserLogin.data.city || "None",
      address: checkUserLogin.data.address || "None",
      gender: checkUserLogin.data.gender || "None",
      hobbies: checkUserLogin.data.hobbies || "None",
      civilS: checkUserLogin.data.civilS || "None",
      job: checkUserLogin.data.job || "None",
      salary: checkUserLogin.data.salary || "None",
      picture: checkUserLogin.data.picture || "None",
      sport: checkUserLogin.data.sport || "None",
    };
    res.json(checkUserLogin);
  } catch (e) {
    res.json({ error: true, message: e });
  }
});

router.post("/register", async (req, res) => {
  try {
    const schema = joi.object().keys({
      
      name: joi.string().regex(/^[a-zA-Z0-9]*$/).required(),
      email: joi.string().email().required(),
      
      password: joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{10,}$/)
        .required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      throw result.error.details[0].message;
    }
    let checkUserRegister = await models.registerUser(result.value);
    if (checkUserRegister.error) {
      throw checkUserRegister.message;
    }
    res.json(checkUserRegister);
  } catch (e) {
    console.log(e);
    res.json({ error: true, message: e });
  }
});

router.post("/update", async (req, res) => {
  try {
    const schema = joi.object().keys({
      name: joi.string().required(),
      email: joi.string().email().required(),
      dob: joi.string().required(),
      city: joi.string().required(),
      address: joi.string().required(),
      gender: joi.string().required(),
      hobbies: joi.string().required(),
      civilS: joi.string().required(),
      job: joi.string().required(),
      salary: joi.string().required(),
      picture: joi.string().required(),
      sport: joi.string().required(),
    });
    req.session.user = {
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob,
      city: req.body.city,
      address: req.body.address,
      gender: req.body.gender,
      hobbies: req.body.hobbies,
      civilS: req.body.civilS,
      job: req.body.job,
      salary: req.body.salary,
      picture: req.body.picture,
      sport: req.body.sport,
    };
    const result = schema.validate(req.body);
    if (result.error) {
      throw result.error.details[0].message;
    }
    let checkUserUpdate = await models.updateUser(result.value);
    if (checkUserUpdate.error) {
      throw checkUserUpdate.message;
    }
    res.json(checkUserUpdate);
  } catch (e) {
    console.log(e);
    res.json({ error: true, message: e });
  }
});



router.get("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy();
  }
  res.redirect("/");
});

module.exports = router;