import Research from '../models/reseach.model.js';
import User from "../models/user.model.js";
import News from "../models/news.model.js";
import Event from "../models/event.model.js";
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';
import slugify from "slugify";
import fs from 'fs';

const DASHBOARD_COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
];

const parseFeaturedValue = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return false;
};

const formatCategoryLabel = (value = "") =>
    String(value)
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());

const createDailyBuckets = () => {
    const buckets = [];
    const today = new Date();

    for (let i = 6; i >= 0; i -= 1) {
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);
        start.setDate(today.getDate() - i);

        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        buckets.push({
            label: start.toLocaleDateString("en-US", { weekday: "short" }),
            start,
            end,
        });
    }

    return buckets;
};

const createWeeklyBuckets = () => {
    const buckets = [];
    const today = new Date();

    for (let i = 5; i >= 0; i -= 1) {
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        end.setDate(today.getDate() - i * 7);

        const start = new Date(end);
        start.setHours(0, 0, 0, 0);
        start.setDate(end.getDate() - 6);

        buckets.push({
            label: `${start.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            })}`,
            start,
            end: new Date(end.getTime() + 1),
        });
    }

    return buckets;
};

const createMonthlyBuckets = () => {
    const buckets = [];
    const today = new Date();

    for (let i = 5; i >= 0; i -= 1) {
        const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

        buckets.push({
            label: start.toLocaleDateString("en-US", { month: "short" }),
            start,
            end,
        });
    }

    return buckets;
};

const buildTimeline = (buckets, collections) =>
    buckets.map((bucket) => {
        const research = collections.research.filter((item) => {
            const date = new Date(item.createdAt);
            return date >= bucket.start && date < bucket.end;
        }).length;

        const news = collections.news.filter((item) => {
            const date = new Date(item.createdAt);
            return date >= bucket.start && date < bucket.end;
        }).length;

        const events = collections.events.filter((item) => {
            const date = new Date(item.createdAt);
            return date >= bucket.start && date < bucket.end;
        }).length;

        return {
            name: bucket.label,
            research,
            news,
            events,
            total: research + news + events,
        };
    });

export const postCreate = async (req, res, next) => {
    let uploadedPath;

    try {
        const { title, description, category, featured } = req.body;
        const author = req.user.fullName;
        console.log('Create Research', author);

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

        const isFeatured = parseFeaturedValue(featured);

        if (isFeatured) {
            await Research.updateMany({}, { $set: { featured: false } });
        }

        const newResearch = await Research.create({
            title,
            description,
            author,
            category,
            image: imageData,
            featured: isFeatured,
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
        const { title, description, category, featured } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog id"
            });
        }

        const hasFeaturedUpdate = featured !== undefined;

        if (!title && !description && !category && !req.file && !hasFeaturedUpdate) {
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
        if (category) research.category = category;

        if (hasFeaturedUpdate) {
            const isFeatured = parseFeaturedValue(featured);

            if (isFeatured) {
                await Research.updateMany(
                    { _id: { $ne: research._id } },
                    { $set: { featured: false } }
                );
            }

            research.featured = isFeatured;
        }

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
        const [researchDocs, newsDocs, eventDocs, userDocs] = await Promise.all([
            Research.find().select("title category views author createdAt featured"),
            News.find().select("title category views author createdAt"),
            Event.find().select("title category views author createdAt eventDate"),
            User.find().select("role createdAt"),
        ]);

        const totalResearch = researchDocs.length;
        const totalNews = newsDocs.length;
        const totalEvents = eventDocs.length;
        const totalPosts = totalResearch + totalNews + totalEvents;
        const totalUsers = userDocs.length;

        const researchViews = researchDocs.reduce((sum, item) => sum + (item.views || 0), 0);
        const newsViews = newsDocs.reduce((sum, item) => sum + (item.views || 0), 0);
        const eventViews = eventDocs.reduce((sum, item) => sum + (item.views || 0), 0);
        const totalViews = researchViews + newsViews + eventViews;

        const avgViewsPerPost =
            totalPosts > 0 ? Number((totalViews / totalPosts).toFixed(1)) : 0;

        const upcomingEvents = eventDocs.filter(
            (event) => new Date(event.eventDate) >= new Date()
        ).length;

        const featuredResearch = researchDocs.filter((item) => item.featured).length;

        const contentByType = [
            { name: "Research", count: totalResearch, views: researchViews, color: "#3b82f6" },
            { name: "News", count: totalNews, views: newsViews, color: "#10b981" },
            { name: "Events", count: totalEvents, views: eventViews, color: "#f59e0b" },
        ];

        const categoryMap = {};
        [...researchDocs, ...newsDocs, ...eventDocs].forEach((item) => {
            const name = formatCategoryLabel(item.category || "Uncategorized");
            categoryMap[name] = (categoryMap[name] || 0) + 1;
        });

        const categoryDistribution = Object.entries(categoryMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, value], index) => ({
                name,
                value,
                color: DASHBOARD_COLORS[index % DASHBOARD_COLORS.length],
            }));

        const userRoleMap = userDocs.reduce((acc, user) => {
            const role = formatCategoryLabel(user.role || "guest");
            acc[role] = (acc[role] || 0) + 1;
            return acc;
        }, {});

        const userRoleDistribution = Object.entries(userRoleMap).map(
            ([name, value], index) => ({
                name,
                value,
                color: DASHBOARD_COLORS[index % DASHBOARD_COLORS.length],
            })
        );

        const timeline = {
            daily: buildTimeline(createDailyBuckets(), {
                research: researchDocs,
                news: newsDocs,
                events: eventDocs,
            }),
            weekly: buildTimeline(createWeeklyBuckets(), {
                research: researchDocs,
                news: newsDocs,
                events: eventDocs,
            }),
            monthly: buildTimeline(createMonthlyBuckets(), {
                research: researchDocs,
                news: newsDocs,
                events: eventDocs,
            }),
        };

        const recentActivity = [...researchDocs, ...newsDocs, ...eventDocs]
            .map((item) => ({
                id: item._id,
                title: item.title,
                author: item.author,
                createdAt: item.createdAt,
                type:
                    item.constructor.modelName === "Research"
                        ? "Research"
                        : item.constructor.modelName === "News"
                            ? "News"
                            : "Event",
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6);

        res.status(200).json({
            success: true,
            stats: {
                totalPosts,
                totalResearch,
                totalNews,
                totalEvents,
                totalUsers,
                totalViews,
                avgViewsPerPost,
                upcomingEvents,
                featuredResearch,
                contentByType,
                categoryDistribution,
                userRoleDistribution,
                timeline,
                recentActivity,
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
