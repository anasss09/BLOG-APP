import News from '../models/news.model.js';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';
import fs from 'fs';

export const postCreate = async (req, res) => {
    let uploadedPath;

    try {
        const { title, description, category } = req.body;
        const author = req.user.fullName;

        const requiredFields = ['title', 'description', 'category'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Fill the ${missingFields.join(',')}`
            });
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

        const newNews = await News.create({
            title,
            description,
            author,
            category,
            image: imageData,
            status: "published"
        });

        return res.status(201).json({
            success: true,
            message: "News created successfully",
            news: newNews
        });

    } catch (error) {
        console.error("Create news error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "News with same title already exists for this author"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: `Error in news creation: ${error.message}`
        });

    } finally {
        if (uploadedPath && fs.existsSync(uploadedPath)) {
            fs.unlinkSync(uploadedPath);
        }
    }
};

export const patchUpdate = async (req, res) => {
    let uploadedPath;
    try {
        const { id } = req.params;
        const { title, description, category } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid news id"
            });
        }

        if (!title && !description && !category && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Nothing to update"
            });
        }

        const newsItem = await News.findById(id);

        if (!newsItem) {
            return res.status(404).json({
                success: false,
                message: `News not found`
            });
        }

        if (title) newsItem.title = title;
        if (description) newsItem.description = description;
        if (category) newsItem.category = category;

        if (req.file) {
            uploadedPath = req.file.path;
            // delete image from cloudinary
            if (newsItem.image?.public_id) {
                await cloudinary.uploader.destroy(newsItem.image.public_id);
            }

            // upload new image to cloudinary
            const response = await cloudinary.uploader.upload(req.file.path);
            newsItem.image = {
                url: response.secure_url,
                public_id: response.public_id
            };
        }

        await newsItem.save();

        res.status(200).json({
            success: true,
            message: `News updated successfully`,
            news: newsItem
        });

    } catch (error) {
        console.log(`Error in updating news: ${error}`);
        return res.status(500).json({
            success: false,
            message: `Internal server error`
        });
    } finally {
        if (uploadedPath && fs.existsSync(uploadedPath)) {
            fs.unlinkSync(uploadedPath);
        }
    }
};

export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid news id"
            });
        }

        const newsItem = await News.findByIdAndDelete(id);

        if (!newsItem) {
            return res.status(404).json({
                success: false,
                message: `News not found`
            });
        }

        // delete image from cloudinary
        if (newsItem.image?.public_id) {
            await cloudinary.uploader.destroy(newsItem.image.public_id);
        }

        res.status(200).json({
            success: true,
            message: `News deleted successfully`,
            deletedId: id
        });
    } catch (error) {
        console.log(`Error in deleting news: ${error}`);
        return res.status(500).json({
            success: false,
            message: `Internal server error`
        });
    }
};

export const getNews = async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });

        if (news.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No news available",
                news: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "News fetched successfully",
            news
        });

    } catch (error) {
        console.error("Error in fetching news:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const postViewsCount = async (req, res) => {
    try {
        const newsItem = await News.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        res.json({ views: newsItem?.views || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
