const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const bcrypt = require("bcryptjs");

//TODO: TRY TO GENERATE A TOKEN AND SEND IT TO THE FRONTEND ON SUCCESSFUL LOGIN/REGISTER

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hashSync(password, 10);
  const tempUser = { name, email, password: hash };

  //custom validation
  if (!name || !email || !password) {
    throw new BadRequestError("Please provide name,email and password");
  }
  const user = await User.create({ ...tempUser });
  res.status(StatusCodes.CREATED).json({ user });
};
const login = async (req, res) => {
  res.send("login user");
};

module.exports = {
  login,
  register,
};
