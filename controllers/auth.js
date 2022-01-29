const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.find({ name });
  console.log("here", user);
  if (user && bcrypt.compareSync(password, user.password)) {
    //CREATING TOKEN AND APPEND IT TO RESPONSE HERE
    console.log("user exists and password is good");
    const token = jwt.sign({ name, email }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(StatusCodes.OK).json({ user, token });
  } else {
    console.log("huh?");
    throw new BadRequestError("Please provide name,email and password");
  }
};

module.exports = {
  login,
  register,
};
