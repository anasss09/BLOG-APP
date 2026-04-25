import User from "../models/user.model.js";

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete user.password;
  delete user.refreshToken;
  return user;
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const patchUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const allowedRoles = ["admin", "editor", "member", "guest"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    if (String(req.user._id) === String(id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role from this panel",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
      error: error.message,
    });
  }
};

export const patchProfile = async (req, res) => {
  try {
    const { fullName, email, profilePic } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!fullName?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.trim(),
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    user.fullName = fullName.trim();
    user.email = email.trim();
    user.profilePic = profilePic?.trim() || "";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export const patchPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(currentPassword);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update password",
      error: error.message,
    });
  }
};
