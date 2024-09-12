const { registerNewUser, loginUser } = require("../services/authService");

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await registerNewUser(username, password);
    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    if (error.message === "Username already exists") {
      res.status(400).json({ message: "Username already exists" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await loginUser(username, password);
    const userid = token.id;
    return res.status(200).json(token);
  } catch (error) {
    res.status(403).json({ message: "Invalid credentials" });
  }
};

module.exports = { register, login };
