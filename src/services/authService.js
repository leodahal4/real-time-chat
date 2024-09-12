const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  registerUser,
  getUserByUsername,
} = require("../repositories/userRepository");

const registerNewUser = async (username, password) => {
  const user = await getUserByUsername(username);
  if (user) {
    throw new Error("Username already exists");
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  return registerUser(username, hashedPassword);
};

const loginUser = async (username, password) => {
  const user = await getUserByUsername(username);
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET
    );
    const response = { userId: user.id, username: user.username, token: token };
    return response;
  }
  throw new Error("Invalid credentials");
};

module.exports = { registerNewUser, loginUser };
