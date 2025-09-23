import {
  comparePasswords,
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/auth.js";
import User from "../models/User.js";

////////////////// create user ///////////////////////////////
export const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

///////////// get all users ///////////////////////////////
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

///////////// get user by id ///////////////////////////////
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

///////////// delete user by id ///////////////////////////////
export const deleteUser = async (req, res) => {
  try {
    const result = await User.delete(req.params.id);
    res.status(200).json({ error: err.message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

///////////////// user login /////////////////////////////
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findByEmail(email);
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    //compare passwords
    const isMatch = await comparePasswords(password, foundUser.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    //generate tokens
    const accessToken = generateAccessToken(foundUser);
    const refreshToken = generateRefreshToken(foundUser);

    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
