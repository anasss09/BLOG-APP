import Event from '../models/event.model.js';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';
import fs from 'fs';

export const postCreate = async (req, res) => {
    let uploadedPath;

    try {
        const { title, description, eventDate, location, category } = req.body;
        const author = req.user.fullName;

        const requiredFields = ['title', 'description', 'eventDate', 'location', 'category'];
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

        const newEvent = await Event.create({
            title,
            description,
            category: category?.toLowerCase().trim() || "general",
            eventDate,
            location,
            author,
            image: imageData,
            status: "published"
        });

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            event: newEvent
        });

    } catch (error) {
        console.error("Create event error:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Event with same title already exists for this author"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: `Error in event creation: ${error.message}`
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
        const { title, description, eventDate, location, category } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event id"
            });
        }

        if (!title && !description && !eventDate && !location && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Nothing to update"
            });
        }

        const ev = await Event.findById(id);

        if (!ev) {
            return res.status(404).json({
                success: false,
                message: `Event not found`
            });
        }

        if (title) ev.title = title;
        if (description) ev.description = description;
        if (category) ev.category = category;
        if (eventDate) ev.eventDate = eventDate;
        if (location) ev.location = location;

        if (req.file) {
            uploadedPath = req.file.path;
            // delete image from cloudinary
            if (ev.image?.public_id) {
                await cloudinary.uploader.destroy(ev.image.public_id);
            }

            // upload new image to cloudinary
            const response = await cloudinary.uploader.upload(req.file.path);
            ev.image = {
                url: response.secure_url,
                public_id: response.public_id
            };
        }

        await ev.save();

        res.status(200).json({
            success: true,
            message: `Event updated successfully`,
            event: ev
        });

    } catch (error) {
        console.log(`Error in updating event: ${error}`);
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

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event id"
            });
        }

        const ev = await Event.findByIdAndDelete(id);

        if (!ev) {
            return res.status(404).json({
                success: false,
                message: `Event not found`
            });
        }

        // delete image from cloudinary
        if (ev.image?.public_id) {
            await cloudinary.uploader.destroy(ev.image.public_id);
        }

        res.status(200).json({
            success: true,
            message: `Event deleted successfully`,
            deletedId: id
        });
    } catch (error) {
        console.log(`Error in deleting event: ${error}`);
        return res.status(500).json({
            success: false,
            message: `Internal server error`
        });
    }
};

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ eventDate: -1 });

        if (events.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No events available",
                events: []
            });
        }

        return res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            events
        });

    } catch (error) {
        console.error("Error in fetching events:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const postViewsCount = async (req, res) => {
    try {
        const ev = await Event.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        res.json({ views: ev?.views || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
