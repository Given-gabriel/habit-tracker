import pool from "../config/db.js";

class Habit {
  ///////// create Habit /////////////////
  static async create({
    userId,
    name,
    description,
    streak = 0,
    performance = 0,
    startDate,
    endDate,
  }) {
    const [habit] = await pool.execute(
      "INSERT INTO habits VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, name, description, streak, performance, startDate, endDate]
    );
    return habit.insertId;
  }

  ///////////// get users habits ////////////////////////
  static async findByUserId({ userId }) {
    try {
      const [habits] = await pool.execute(
        "SELECT * FROM habits WHERE User_id = ?",
        [userId]
      );
      return habits;
    } catch (error) {
      console.error("Error fetching habits by user ID:", error);
      throw error;
    }
  }

  /////////////// delete habit /////////////////////////
  static async delete({ id }) {
    const [result] = await pool.execute("DELETE FROM habits WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  }

  /////////////// delete all habits of a specific user /////////////////
  static async deleteAllForUser({ userId }) {
    const [result] = await pool.execute(
      "DELETE FROM habits WHERE User_id = ?",
      [userId]
    );
    return result.affectedRows;
  }

  ////////////// update habit ///////////////////////////////
  static async updateById({ id, name }) {
    const [habit] = await pool.execute(
      "UPDATE habits SET name = ? WHERE id = ?",
      [name, id]
    );
    return habit;
  }
}

export default Habit;
