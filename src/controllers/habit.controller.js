import Habit from "../models/Habit.js";

///////////////// create habit /////////////////////////////
export const createHabit = async (req, res) => {
  try {
    const userId = req.user.id;
    const newHabit = await Habit.create(userId, req.body);
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

///////////////// get habits /////////////////////////////
export const getHabits = async (req, res) => {
  try {
    const user_id = req.user.id;
    const habits = await Habit.getHabits(user_id);
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

///////////////// delete habit /////////////////////////////
export const deleteHabit = async (req, res) => {
  try {
    const result = await Habit.delete(req.params.id);
    res.status(200).json({ message: "Habit deleted successfully", result });
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
