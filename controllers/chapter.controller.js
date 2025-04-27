import Chapter from "../models/Chapter.model.js";
import Novel from "../models/Novel.model.js";

// Create Chapter
export const createChapter = async (req, res) => {
  const { novelId } = req.params;
  const { title, content, chapterNumber } = req.body;

  try {
    const novel = await Novel.findById(novelId);
    if (!novel) return res.status(404).json({ error: "Novel not found" });

    const chapter = new Chapter({
      novel: novelId,
      title,
      content,
      chapterNumber,
    });

    

    await chapter.save();
    novel.chapters.push(chapter._id);
    await novel.save();
    res.status(201).json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all chapters for a novel
export const getChaptersByNovel = async (req, res) => {
  try {
    const chapters = await Chapter.find({ novel: req.params.novelId }).sort("chapterNumber");
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single chapter
export const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });
    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete chapter
export const deleteChapter = async (req, res) => {
  try {
    const chapterId = req.params.id;
    const chapter = await Chapter.findById(chapterId);
    
    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found" });
    }
    
    // Get the novel to check ownership and update its chapters array
    const novel = await Novel.findById(chapter.novel);
    
    if (!novel) {
      return res.status(404).json({ success: false, message: "Novel not found" });
    }
    
    // Check if the user is the author of the novel
    if (novel.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this chapter" });
    }
    
    // Remove the chapter reference from the novel
    novel.chapters = novel.chapters.filter(id => id.toString() !== chapterId);
    await novel.save();
    
    // Delete the chapter
    await Chapter.findByIdAndDelete(chapterId);
    
    res.status(200).json({ success: true, message: "Chapter deleted successfully" });
  } catch (error) {
    console.log("Error in deleting chapter", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update chapter (only title and chapter number)
export const updateChapter = async (req, res) => {
  try {
    const chapterId = req.params.id;
    const { title, chapterNumber, content } = req.body;
    
    const chapter = await Chapter.findById(chapterId);
    
    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found" });
    }
    
    // Get the novel to check ownership
    const novel = await Novel.findById(chapter.novel);
    
    if (!novel) {
      return res.status(404).json({ success: false, message: "Novel not found" });
    }
    
    // Check if the user is the author of the novel
    if (novel.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this chapter" });
    }
    
    // Update fields
    if (title) chapter.title = title;
    if (chapterNumber) chapter.chapterNumber = chapterNumber;
    if (content) chapter.content = content;
    
    await chapter.save();
    
    res.status(200).json({
      success: true,
      message: "Chapter updated successfully",
      chapter
    });
  } catch (error) {
    console.log("Error in updating chapter", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
