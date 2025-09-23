import pool from "../config/db.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

class User {
  ///////////// create new user /////////////////////
  static async create({ name, email, password, performance = 0 }) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, performance) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, performance]
    );
    return result.insertId;
  }

  //////////////////////get all users /////////////////////////////////
  static async findAll() {
    const [rows] = await pool.execute("SELECT * FROM users");
    return rows;
  }

  /////////// get user by Id ///////////////////////////////
  static async findById(id) {
    const [row] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
  }

  static async delete(id) {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows; //returns number of rows deleted
  }

  /////////// get user by email ///////////////////////////////
  static async findByEmail(email) {
    const [row] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return row[0] || null; // Return the first user or null if not found
  }
}

export default User;
