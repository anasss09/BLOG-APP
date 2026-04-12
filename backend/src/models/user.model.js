import mongoose, { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },

    fullName: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true
    },

    profilePic: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: ["admin", "editor", "member", "guest"],
        default: "guest"
    },

    refreshToken: {
        type: String
    },

}, {
    timestamps: true
});

userSchema.pre('save', async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        userId: this._id,
        fullName: this.fullName,
        email: this.email,
        role: this.role
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        userId: this._id
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}


const User = mongoose.model("User", userSchema);
export default User;