import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: 10
    },
    category: {
        type: String,
        required: true,
        default: "general",
        lowercase: true,
        trim: true,
        index: true
    },
    eventDate: {
        type: Date,
        required: [true, "Event date is required"]
    },
    location: {
        type: String,
        required: [true, "Location is required"]
    },
    image: {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "published", // Default to published for MVP
        index: true,
    },
    views: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
});

// 🔥 AUTO SLUG
eventSchema.pre("save", async function () {
    if (!this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/&/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
    }
});

eventSchema.index({ author: 1, title: 1 }, { unique: true });
eventSchema.index({ title: "text", description: "text" });
eventSchema.index({ eventDate: 1 });
eventSchema.index({ createdAt: -1 });

const Event = mongoose.model("Event", eventSchema);
export default Event;
