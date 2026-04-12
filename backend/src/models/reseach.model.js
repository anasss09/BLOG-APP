import mongoose, { Schema } from "mongoose";

const researchSchema = new Schema({
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
        type: {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        },
        required: true
    },

    category: {
        type: String,
        required: true,
        enum: [
            "Security & Geopolitics",
            "Trade & Economy",
            "AI & Emerging Technologies",
            "Climate Change & Sustainability",
            "Energy & Infrastructure",
            "Civilizational Studies",
            "Global Electoral Landscapes",
            "Multilateral Institutions"
        ],
        index: true
    },

    author: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
        index: true,
    },

    views: {
        type: Number,
        default: 0,
    },

    featured: {
        type: Boolean,
        default: false,
        index: true,
    },

    readTime: {
        type: String,
    },

}, {
    timestamps: true
});

// 🔥 AUTO SLUG + READ TIME
researchSchema.pre("save", function (next) {

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

    next();
});

//Prevent duplicate blog titles per author
researchSchema.index({ author: 1, title: 1 }, { unique: true });
// Top match "AI" not exect, It will match "AI geopolitics" ise bhi match krega 
researchSchema.index({ title: "text", description: "text" });
researchSchema.index({ createdAt: -1 });
researchSchema.index({ views: -1 });

const Research = mongoose.model("Research", researchSchema);
export default Research;