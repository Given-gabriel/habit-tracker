import pool from "../config/db.js";

class Habit {
  ///////// create Habit /////////////////
  static async create({
    userId,
    name,
    description,
    streak = 0,
    startDate,
    endDate,
  }) {
    const [habit] = await pool.execute(
      "INSERT INTO habits (userId, name, description, streak, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, name, description, streak, startDate, endDate]
    );
    return habit.insertId;
  }

  ///////////// get users habits ////////////////////////
  static async findByUserId({ userId }) {
    try {
      const [habits] = await pool.execute(
        "SELECT * FROM habits WHERE userId = ?",
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
    const [result] = await pool.execute("DELETE FROM habits WHERE userId = ?", [
      userId,
    ]);
    return result.affectedRows;
  }

  ////////////// update habit ///////////////////////////////
  static async updateById({ id, name, description, startDate, endDate }) {
    const [habit] = await pool.execute(
      "UPDATE habits SET (name = ?, description = ?, start_date = ?, end_date = ?) = ? WHERE id = ?",
      [name, description, startDate, endDate, id]
    );
    return habit;
  }

  /////////mark as checked logic /////////////////////
  static async markAsCompleted(habitId, completion_date = new Date()) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      //insert the completion record
      await connection.execute(
        "INSERT INTO habit_completions (habitId, completion_date) VALUES (?, ?)",
        [habitId, completion_date]
      );

      // Call the central stats update function
      await this.updateStats(habitId, connection);
      await connection.commit();

      return 1; // Indicate success
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  ///////////////// mark as uncompleted logic /////////////////////
  static async markAsIncomplete(habitId, completionDate = new Date()) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Delete the completion record for today
      await connection.execute(
        "DELETE FROM habit_completions WHERE habit_id = ? AND completion_date = ?",
        [habitId, completionDate]
      );

      // Call the central stats update function
      await this.updateStats(habitId, connection);
      await connection.commit();

      return 1; // Indicate success
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  ////////////// update user performance ///////////////////////////////
  static async updateUserPerformance({ userId }) {
    const [habit] = await pool.execute(
      `UPDATE users u
            JOIN (
            SELECT
                userId,
                AVG(performance) AS avg_performance
            FROM habits
            WHERE userId = ?
            GROUP BY userId
            ) AS h_avg ON u.id = h_avg.userId
            SET u.performance = h_avg.avg_performance
            WHERE u.id = ?`,
      [userId, userId]
    );
    return habit.affectedRows;
  }

  //////////calculate streak /////////////////////
  static calculateStreak(completionDates) {
    if (completionDates.length === 0) {
      return 0;
    }

    // Ensure dates are actual Date objects for comparison
    const dates = completionDates.map((d) => new Date(d));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // The most recent completion must be today or yesterday to have a streak
    if (
      dates[0].getTime() !== today.getTime() &&
      dates[0].getTime() !== yesterday.getTime()
    ) {
      return 0;
    }

    let streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const expectedPreviousDate = new Date(dates[i - 1]);
      expectedPreviousDate.setDate(expectedPreviousDate.getDate() - 1);

      if (dates[i].getTime() === expectedPreviousDate.getTime()) {
        streak++;
      } else {
        // A gap was found, so the streak is broken
        break;
      }
    }
    return streak;
  }

  /////////update stats///////////////////////
  static async updateStats(habitId, connection) {
    // 1. Get all completion dates for the habit, ordered from most recent
    const [completions] = await connection.execute(
      "SELECT completion_date FROM habit_completions WHERE habit_id = ? ORDER BY completion_date DESC",
      [habitId]
    );

    const completionDates = completions.map((c) => c.completion_date);

    // 2. Calculate the stats
    const daysCompleted = completionDates.length;
    const streak = this.calculateStreak(completionDates);

    // 3. Update the habits table with the new stats
    await connection.execute(
      "UPDATE habits SET days_completed = ?, streak = ? WHERE id = ?",
      [daysCompleted, streak, habitId]
    );
  }
}

export default Habit;
