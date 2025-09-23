import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

//////////// authenticate Token ///////////////////////////////
export const authenticateToken = (req, res, next) => {
  try {
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Access Token Required" });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    if (!decoded)
      return res.status(403).json({ message: "Invalid Access Token" });

    req.user = decoded;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/////////// generate Tokens ///////////////////////////////
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: "7d" }
  );
};

/////////// verify Refresh Token ///////////////////////////////
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
  } catch (err) {
    return null;
  }
};

/////////// check if user is admin ///////////////////////////////
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Admin access required" });
};

///////////compare passwords ///////////////////////////////
export const comparePasswords = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
