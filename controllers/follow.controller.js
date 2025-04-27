import User from "../models/User.model.js";
import Novel from "../models/Novel.model.js";

export const followUser = async (req, res) => {
  const { id } = req.params; // author ID

  try {
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(id);

    if (!targetUser) return res.status(404).json({ error: "User not found" });

    if (currentUser.following.includes(id)) {
      return res.status(400).json({ error: "Already following this user" });
    }

    currentUser.following.push(id);
    targetUser.followers.push(req.user._id);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  const { id } = req.params;

  try {
    const currentUser = await User.findById(req.user._id);
    const targetUser = await User.findById(id);

    currentUser.following = currentUser.following.filter(
      (userId) => userId.toString() !== id
    );
    targetUser.followers = targetUser.followers.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get novels from users the current user is following
export const getFollowingNovels = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Get novels from followed users, newest first
    const novels = await Novel.find({
      author: { $in: currentUser.following }
    })
    .populate("author", "username profileImg")
    .sort({ createdAt: -1 });
    
    res.status(200).json(novels);
  } catch (error) {
    console.error("Error fetching following novels:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get user profile with followers and following count
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select("-password")
      .populate("followers", "username profileImg")
      .populate("following", "username profileImg");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: error.message });
  }
};
