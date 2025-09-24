import Habit from "../models/Habit.js";
import User from "../models/User.js";

///////////////// create habit /////////////////////////////
export const createHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const habitData = { userId, ...req.body };
    const newHabit = await Habit.create(habitData);
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

///////////////// get habits /////////////////////////////
export const getHabits = async (req, res) => {
  try {
    const user_id = req.user.id;
    const habits = await Habit.findByUserId({ userId: user_id });
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

///////////////// delete habit /////////////////////////////
export const deleteHabit = async (req, res) => {
  try {
    const result = await Habit.delete({ id: req.params.id });
    res.status(200).json({ message: "Habit deleted successfully", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/////////////delete all habits of a specific user /////////////////////////
export const deleteAllHabitsForUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await Habit.deleteAllForUser({ userId: userId });
    res
      .status(200)
      .json({ message: "All habits deleted successfully", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

///////////////// update habit /////////////////////////////
export const updateHabit = async (req, res) => {
  try {
    const updatedHabit = await Habit.updateById(req.params.id, req.body);
    res.status(200).json(updatedHabit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/////////////toggle habit completion /////////////////////////
export const toggleHabitCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body; // Expects a boolean: true for complete, false for incomplete
    const userId = req.user.id;

    if (completed) {
      await Habit.markAsCompleted(id);
    } else {
      await Habit.markAsIncomplete(id);
    }

    // After changing a habit, update the user's overall performance
    await User.updateUserPerformance({ userId: userId });

    res
      .status(200)
      .json({ message: "Habit completion status updated successfully" });
  } catch (err) {
    console.error("Error toggling habit completion:", err);
    res
      .status(500)
      .json({ error: "Failed to update habit status", details: err.message });
  }
};
