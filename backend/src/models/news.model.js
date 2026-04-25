import mongoose, { Schema } from "mongoose";

const newsSchema = new Schema({
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
    image: {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    category: {
        type: String,
        required: true,
        default: "General"
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "published",
        index: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    readTime: {
        type: String,
    },
}, {
    timestamps: true
});

// 🔥 AUTO SLUG + READ TIME
newsSchema.pre("save", async function () {

    // slug generate
    if (!this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/&/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");
    }

    // read time calculate
    if (this.description) {
        const text = this.description.replace(/<[^>]+>/g, "");
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.max(1, Math.ceil(words / 200));

        this.readTime = `${minutes} min read`;
    }
});

newsSchema.index({ author: 1, title: 1 }, { unique: true });
newsSchema.index({ title: "text", description: "text" });
newsSchema.index({ createdAt: -1 });

const News = mongoose.model("News", newsSchema);
export default News;
