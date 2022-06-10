import Cafe from "../models/cafe.js";
import mongoose from "mongoose";

export const getCafes = async (req, res) => {
  const { location } = req.query;

  try {
    const loc = new RegExp(location, "i"); //RegExp => ignores cases
    const cafes = await Cafe.find(location && { location: loc });
    res.status(200).json(cafes);

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createCafe = async (req, res) => {
  const cafe = req.body;
  const newCafe = new Cafe(cafe);

  try {
    await newCafe.save();
    res.status(201).json(newCafe);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateCafe = async (req, res) => {
  const { id: _id } = req.params;
  const cafe = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");

  const updatedCafe = await Cafe.findByIdAndUpdate(
    _id,
    { ...cafe, _id },
    { new: true }
  );

  res.json(updatedCafe);
};

export const deleteCafe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  await Cafe.findByIdAndRemove(id);

  res.json({ message: "Cafe deleted successfully!" });
};

export const addEmployee = async (req, res) => {
  const { id } = req.params;
  const employee = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No post with that id");

  const cafes = await Cafe.find();

  const index = cafes.some((p) =>
    p.employees.some((e) => e.id === employee.employee_id)
  );
  if (index) {
    return res.status(409).send("User already exist in another cafe");
  } else {
    const cafe = await Cafe.findById(id);
    cafe.employees.push(req.body);
    const updatedCafe = await Cafe.findByIdAndUpdate(id, cafe, { new: true });
    res.json(updatedCafe);
  }
};