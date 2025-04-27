import Novel from "../models/Novel.model.js";
import Comment from "../models/Comment.model.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";
import Chapter from "../models/Chapter.model.js";

// Helper to get average ratings for novels
const getAverageRatings = async (novelIds) => {
  try {
    const ratings = await Comment.aggregate([
      { $match: { novel: { $in: novelIds.map(id => new mongoose.Types.ObjectId(id)) } } },
      { $group: { _id: "$novel", rating: { $avg: "$stars" } } }
    ]);
    
    return ratings.reduce((acc, item) => {
      acc[item._id.toString()] = parseFloat(item.rating.toFixed(1));
      return acc;
    }, {});
  } catch (error) {
    console.error("Error getting average ratings:", error);
    return {};
  }
};

export const createNovel =  async (req,res)=>{
    const{title, description, genre, thumbnail}=req.body;
    try {
        if(!title || !description ||!genre){
            return res.status(400).json({message:"All fields are required"});
        }
        let uploadedUrl=""
        if(thumbnail){
            const uploaded= await cloudinary.uploader.upload(thumbnail)
            uploadedUrl=uploaded.secure_url
        }

        const newNovel= await Novel.create({
            title,
            description,
            genre,
            thumbnail:uploadedUrl,
            author:req.user._id
        })

        res.status(201).json({
            success:true,
            message:"Novel created successfully",
            newNovel
        })
    } catch (error) {
        console.log("Error in creating novel",error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

export const getAllNovels = async (req,res)=>{
    try {
        const novels = await Novel.find().populate("author","username profileImg")
        
        // Get IDs for all novels
        const novelIds = novels.map(novel => novel._id);
        
        // Get average ratings for all novels
        const ratings = await getAverageRatings(novelIds);
        
        // Attach ratings to novels
        const novelsWithRatings = novels.map(novel => {
          const novelObj = novel.toObject();
          novelObj.rating = ratings[novel._id.toString()] || 0;
          return novelObj;
        });
        
        res.status(200).json(novelsWithRatings)
    } catch (error) {
        console.log("Error in getting all novels",error.message)
        res.status(500).json({error:error.message})
    }
}

export const getNovelById = async (req,res)=>{
    try {
        const novel = await Novel.findById(req.params.id).populate("author", "username profileImg");
        
        if (!novel) {
          return res.status(404).json({ error: "Novel not found" });
        }
        
        // Get average rating for this novel
        const ratings = await getAverageRatings([novel._id]);
        const novelObj = novel.toObject();
        novelObj.rating = ratings[novel._id.toString()] || 0;
        
        res.status(200).json(novelObj);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

export const getNovelsByUser = async (req, res, useCurrentUser = false) => {
    try {
        // Use the current user's ID if useCurrentUser is true, otherwise use the ID from params
        const userId = useCurrentUser ? req.user._id : req.params.userId;
        
        const novels = await Novel.find({ author: userId })
            .populate("author", "username profileImg")
            .sort({ createdAt: -1 });
        
        // Get IDs for all novels
        const novelIds = novels.map(novel => novel._id);
        
        // Get average ratings for all novels
        const ratings = await getAverageRatings(novelIds);
        
        // Attach ratings to novels
        const novelsWithRatings = novels.map(novel => {
          const novelObj = novel.toObject();
          novelObj.rating = ratings[novel._id.toString()] || 0;
          return novelObj;
        });
        
        res.status(200).json(novelsWithRatings);
    } catch (error) {
        console.log("Error in getting user novels:", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const deleteNovel = async (req, res) => {
  try {
    const novelId = req.params.id;
    const novel = await Novel.findById(novelId);
    
    if (!novel) {
      return res.status(404).json({ success: false, message: "Novel not found" });
    }
    
    // Check if the user is the author
    if (novel.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this novel" });
    }
    
    // Delete all chapters associated with this novel
    await Chapter.deleteMany({ novel: novelId });
    
    // Delete the novel
    await Novel.findByIdAndDelete(novelId);
    
    res.status(200).json({ success: true, message: "Novel and all its chapters deleted successfully" });
  } catch (error) {
    console.log("Error in deleting novel", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateNovel = async (req, res) => {
  try {
    const novelId = req.params.id;
    const { title, description, genre, thumbnail } = req.body;
    
    const novel = await Novel.findById(novelId);
    
    if (!novel) {
      return res.status(404).json({ success: false, message: "Novel not found" });
    }
    
    // Check if the user is the author
    if (novel.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to update this novel" });
    }
    
    // Update fields
    const updateData = {
      title: title || novel.title,
      description: description || novel.description,
      genre: genre || novel.genre,
    };
    
    // Update thumbnail if provided
    if (thumbnail && thumbnail !== novel.thumbnail) {
      // Upload new thumbnail to cloudinary
      const uploaded = await cloudinary.uploader.upload(thumbnail);
      updateData.thumbnail = uploaded.secure_url;
    }
    
    const updatedNovel = await Novel.findByIdAndUpdate(
      novelId,
      updateData,
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Novel updated successfully",
      novel: updatedNovel
    });
  } catch (error) {
    console.log("Error in updating novel", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const searchNovels = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }
    
    // Search by title, author's username, or genre
    const novels = await Novel.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } }
      ]
    }).populate({
      path: 'author',
      select: 'username profileImg',
      options: { strictPopulate: false }
    });
    
    // Also find by author's username
    const novelsByAuthor = await Novel.find()
      .populate({
        path: 'author',
        select: 'username profileImg',
        match: { username: { $regex: q, $options: 'i' } }
      })
      .then(novels => novels.filter(novel => novel.author)); // Filter out null authors
    
    // Combine results and remove duplicates
    const combinedResults = [...novels, ...novelsByAuthor];
    const uniqueNovels = Array.from(new Map(combinedResults.map(novel => [novel._id.toString(), novel])).values());
    
    // Get IDs for all novels
    const novelIds = uniqueNovels.map(novel => novel._id);
    
    // Get average ratings for all novels
    const ratings = await getAverageRatings(novelIds);
    
    // Attach ratings to novels
    const novelsWithRatings = uniqueNovels.map(novel => {
      const novelObj = novel.toObject();
      novelObj.rating = ratings[novel._id.toString()] || 0;
      return novelObj;
    });
    
    res.status(200).json(novelsWithRatings);
  } catch (error) {
    console.log("Error in searching novels:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};