import Item from "../models/Item.js";

//normalize expiryDate
const normalizeExpiryDate = (date) => {
  if (!date) return null;
  return new Date(date);
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch item" });
  }
};

export const createItem = async (req, res) => {
  try {
    const data = {
      ...req.body,
      expiryDate: normalizeExpiryDate(req.body.expiryDate), //ensure Date object
    };

    const newItem = await Item.create(data);

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create item",
      error: error.message,
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    //Only normalize if provided (important for partial updates)
    if (req.body.expiryDate) {
      data.expiryDate = normalizeExpiryDate(req.body.expiryDate);
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true, //ensures expiryDate validation runs
      }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update item",
      error: error.message,
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item" });
  }
};