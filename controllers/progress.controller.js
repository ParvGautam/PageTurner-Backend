import ReadingProgress from "../models/Progress.model.js";

// Update reading progress
export const updateProgress = async (req, res) => {
  const { novelId, chapterId } = req.body;

  try {
    if (!novelId || !chapterId) {
      return res.status(400).json({ 
        success: false, 
        message: "Novel ID and Chapter ID are required" 
      });
    }

    // Use findOneAndUpdate with upsert to create if not exists
    const progress = await ReadingProgress.findOneAndUpdate(
      { user: req.user._id, novel: novelId },
      { 
        chapter: chapterId, 
        lastReadAt: Date.now() 
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Reading progress updated",
      progress
    });
  } catch (error) {
    console.error("Error updating reading progress:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update reading progress", 
      error: error.message 
    });
  }
};

// Get user's reading progress for a novel
export const getNovelProgress = async (req, res) => {
  const { novelId } = req.params;

  try {
    const progress = await ReadingProgress.findOne({
      user: req.user._id,
      novel: novelId
    }).populate('chapter', 'title chapterNumber');

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No reading progress found"
      });
    }

    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    console.error("Error fetching reading progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reading progress",
      error: error.message
    });
  }
};

// Get all user's reading progress (for the home page "Continue Reading" section)
export const getAllProgress = async (req, res) => {
  try {
    const allProgress = await ReadingProgress.find({
      user: req.user._id
    })
      .sort({ lastReadAt: -1 })
      .populate('novel', 'title thumbnail')
      .populate('chapter', 'title chapterNumber')
      .limit(5); // Limit to the 5 most recent books

    res.status(200).json({
      success: true,
      progressList: allProgress
    });
  } catch (error) {
    console.error("Error fetching all reading progress:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reading progress list",
      error: error.message
    });
  }
};
