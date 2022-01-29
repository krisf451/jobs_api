const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { password, email } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  const isMatch = await bcrypt.compare(password, user.password);
  if (user && isMatch) {
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user, token });
  } else {
    throw new UnauthenticatedError("Invalid Credentials");
  }
};

module.exports = {
  login,
  register,
};
