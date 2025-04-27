import Library from "../models/Library.model.js";

// Add a book to user's library
export const addToLibrary = async (req, res) => {
  const { novelId } = req.body;

  try {
    if (!novelId) {
      return res.status(400).json({ 
        success: false, 
        message: "Novel ID is required" 
      });
    }

    // Check if book already exists in user's library
    const existingEntry = await Library.findOne({
      user: req.user._id,
      novel: novelId,
    });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "Book already in your library"
      });
    }

    // Create new library entry
    const newEntry = new Library({
      user: req.user._id,
      novel: novelId,
    });

    await newEntry.save();

    res.status(201).json({
      success: true,
      message: "Book added to your library",
      entry: newEntry
    });
  } catch (error) {
    console.error("Error adding to library:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add book to library",
      error: error.message
    });
  }
};

// Remove a book from user's library
export const removeFromLibrary = async (req, res) => {
  const { novelId } = req.body;

  try {
    if (!novelId) {
      return res.status(400).json({ 
        success: false, 
        message: "Novel ID is required" 
      });
    }

    const entry = await Library.findOneAndDelete({
      user: req.user._id,
      novel: novelId,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Book not found in your library"
      });
    }

    res.status(200).json({
      success: true,
      message: "Book removed from your library"
    });
  } catch (error) {
    console.error("Error removing from library:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove book from library",
      error: error.message
    });
  }
};

// Check if a book is in user's library
export const checkInLibrary = async (req, res) => {
  const { novelId } = req.params;

  try {
    const entry = await Library.findOne({
      user: req.user._id,
      novel: novelId,
    });

    res.status(200).json({
      success: true,
      inLibrary: entry ? true : false
    });
  } catch (error) {
    console.error("Error checking library status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check library status",
      error: error.message
    });
  }
};

// Get all books in user's library
export const getUserLibrary = async (req, res) => {
  try {
    const library = await Library.find({
      user: req.user._id
    })
      .sort({ addedAt: -1 })
      .populate('novel', 'title thumbnail author genres description');

    res.status(200).json({
      success: true,
      library
    });
  } catch (error) {
    console.error("Error fetching library:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch library",
      error: error.message
    });
  }
}; 