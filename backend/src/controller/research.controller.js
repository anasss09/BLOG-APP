import Research from '../models/reseach.model.js';
import User from "../models/user.model.js";
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';
import slugify from "slugify";
import fs from 'fs';

export const postCreate = async (req, res) => {
    let uploadedPath;

    try {
        const { title, description, category, featured  } = req.body;
        const author = req.user.fullName;

        const requiredFields = ['title', 'description', 'category'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if(missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Fill the ${missingFields.join(',')}`
            })
        }

        let imageData;

        if (req?.file) {
            uploadedPath = req.file.path;

            const uploadResponse = await cloudinary.uploader.upload(uploadedPath);

            imageData = {
                url: uploadResponse.secure_url,
                public_id: uploadResponse.public_id
            };
        } else {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const newResearch = await Research.create({
            title,
            description,
            author,
            category,
            image: imageData,
            status: "published"
        });

        return res.status(201).json({
            success: true,
            message: "Research created successfully",
            research: newResearch
        });

    } catch (error) {
        console.error("Create research error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Research with same title already exists for this author"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: `Error in research creation: ${error.message}`
        });

    } finally {
        if (uploadedPath && fs.existsSync(uploadedPath)) {
            fs.unlinkSync(uploadedPath);
        }
    }
};

export const patchUpdate = async (req, res, next) => {
    let uploadedPath;
    try {
        const { researchId: id } = req.params;
        const { title, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog id"
            });
        }

        if (!title && !description && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Nothing to update"
            });
        }

        const research = await Research.findById(id);

        if (!research) {
            return res.status(404).
                json({
                    success: false,
                    message: `Blog not found`
                })
        }

        if (title) research.title = title;
        if (description) research.description = description;

        if (req.file) {
            uploadedPath = req.file.path;
            // delete image from cloudinary
            if (research.image?.public_id) {
                await cloudinary.uploader.destroy(research.image.public_id);
            }

            // upload new image to cloudinary
            const response = await cloudinary.uploader.upload(req.file.path);
            research.image = {
                url: response.secure_url,
                public_id: response.public_id
            };
        }

        await research.save();

        res.status(200).
            json({
                success: true,
                message: `Blog updated successfully`,
                blogs: research
            })

    } catch (error) {
        console.log(`Error in updating blog: ${error}`);
        return res.status(500).
            json({
                success: false,
                message: `Internal server error`
            });
    } finally {
        if (uploadedPath && fs.existsSync(uploadedPath)) {
            fs.unlinkSync(uploadedPath);
        }
    }
}

export const deleteBlog = async (req, res, next) => {
    try {
        const { researchId: id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog id"
            });
        }

        const research = await Research.findByIdAndDelete(id);

        if (!research) {
            return res.status(404).
                json({
                    success: false,
                    message: `Blog not found`
                });
        }

        // delete image from cloudinary
        if (research.image?.public_id) {
            await cloudinary.uploader.destroy(research.image.public_id);
        }

        res.status(200).
            json({
                success: true,
                message: `Blog deleted successfully`,
                deletedId: id
            });
    } catch (error) {
        console.log(`Error in deleting blog: ${error}`);
        return res.status(500).
            json({
                success: false,
                message: `Internal server error`
            });
    }

}

export const getBlogs = async (req, res) => {
    try {
        const blogs = await Research.find()
            .sort({ createdAt: -1 });

        if (blogs.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No blogs available",
                blogs: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            blogs
        });

    } catch (error) {
        console.error("Error in fetching blogs:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        // Total posts
        const totalPosts = await Research.countDocuments();

        // Total users
        const totalUsers = await User.countDocuments();

        // Total views (SUM of all research views)
        const viewsAgg = await Research.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" }
                }
            }
        ]);

        const totalViews = viewsAgg[0]?.totalViews || 0;

        res.status(200).json({
            success: true,
            stats: {
                totalPosts,
                totalUsers,
                totalViews
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const postViewsCount =  async (req, res) => {
  try {
    const blog = await Research.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // increment
      { new: true }
    );

    res.json({ views: blog.views });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}