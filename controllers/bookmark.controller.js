import Bookmark from "../models/Bookmark.model.js";

// Add a bookmark
export const addBookmark = async (req, res) => {
  const { novelId, chapterId } = req.body;

  try {
    if (!novelId || !chapterId) {
      return res.status(400).json({ 
        success: false, 
        message: "Novel ID and Chapter ID are required" 
      });
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      novel: novelId,
      chapter: chapterId
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: "Bookmark already exists"
      });
    }

    // Create new bookmark
    const newBookmark = new Bookmark({
      user: req.user._id,
      novel: novelId,
      chapter: chapterId
    });

    await newBookmark.save();

    res.status(201).json({
      success: true,
      message: "Bookmark added successfully",
      bookmark: newBookmark
    });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add bookmark",
      error: error.message
    });
  }
};

// Remove a bookmark
export const removeBookmark = async (req, res) => {
  const { novelId, chapterId } = req.body;

  try {
    if (!novelId || !chapterId) {
      return res.status(400).json({ 
        success: false, 
        message: "Novel ID and Chapter ID are required" 
      });
    }

    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      novel: novelId,
      chapter: chapterId
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully"
    });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove bookmark",
      error: error.message
    });
  }
};

// Check if a chapter is bookmarked
export const checkBookmark = async (req, res) => {
  const { novelId, chapterId } = req.params;

  try {
    const bookmark = await Bookmark.findOne({
      user: req.user._id,
      novel: novelId,
      chapter: chapterId
    });

    res.status(200).json({
      success: true,
      isBookmarked: bookmark ? true : false
    });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check bookmark status",
      error: error.message
    });
  }
};

// Get all user bookmarks
export const getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user._id
    })
      .sort({ createdAt: -1 })
      .populate('novel', 'title thumbnail')
      .populate('chapter', 'title chapterNumber');

    res.status(200).json({
      success: true,
      bookmarks
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookmarks",
      error: error.message
    });
  }
}; 