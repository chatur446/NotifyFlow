const { publishUserRegistered } = require("../events/userEvents");
const bcrypt = require("bcrypt");

const {
  findUserByEmail,
  createUser,
} = require("../repositories/userRepository");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required",
      });
    }

    // Validate name
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        error: "Name must contain at least 2 characters",
      });
    }

    // Validate email
    if (typeof email !== "string") {
      return res.status(400).json({
        error: "Invalid email",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // Validate password
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }

    // Check if email already exists
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    await publishUserRegistered(user);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("User registration error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

module.exports = {
  registerUser,
};