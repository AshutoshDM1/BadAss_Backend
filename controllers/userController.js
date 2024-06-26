const { User } = require("../database/index.js");
const { jwtSecret } = require("../config/index.js");
const jwt = require("jsonwebtoken");
const { hashingPass, checkHashingPass } = require("../utils/bcryptUtils.js");

const users = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    let hashedPassword = await hashingPass(password);

    await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      gender: gender,
    });

    return res.status(200).json({ message: "User SignUp Successful" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      const match = await checkHashingPass(password, existingUser.password);
      if (match === true) {
        const token = jwt.sign(
          {
            username,
          },
          jwtSecret
        );

        res.json({
          token,
        });
      }
    } else {
      res.status(411).json({
        message: "Incorrect email and pass",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const signout = async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    const match = await checkHashingPass(password, existingUser.password);
    if (match === true) {
      try {
        await User.findOneAndDelete({ username });
        res.status(200).json({ message: "User SignOut Successful" });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }
  }
};

const posts = async (req, res) => {
  res.json({ massage: "Hello World" });
};

module.exports = { users, signup, login, signout, posts };
