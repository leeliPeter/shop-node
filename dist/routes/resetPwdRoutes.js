"use strict";
// EmailJS
// template ID: template_7rv94js, public key: FzkxtthzjDlZhYrap, private key: iLBS-A7oa_jdUeJ7ALSVK, email: lei23lei91@gmail.com
// in template, subject : {{subject}}, content: {{message}}, to email: {{to}}, from name : {{senderName}},  reply to : {{replyTo}}
// app password: syau qucz ylcf tsgn
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const type_1 = __importDefault(require("../types/type"));
const userInfo_1 = require("../schema/userInfo"); // Ensure this path matches your file structure
const router = express_1.default.Router();
// Password reset route
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        // Check if the email exists in the database
        const user = yield userInfo_1.UserInfo.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }
        // Generate a reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        // Save the reset token, its expiration, and email in the user's record
        yield userInfo_1.UserInfo.updateOne({ email }, {
            $set: {
                resetToken,
                resetTokenExpiry: Date.now() + 3600000, // 1 hour expiry
            }
        });
        // Configure nodemailer
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'lei23lei91@gmail.com', // Your email
                pass: 'syau qucz ylcf tsgn' // Your App Password
            }
        });
        // Generate reset URL
        const resetUrl = `${type_1.default}/reset-password?token=${resetToken}`;
        // Email options
        const mailOptions = {
            from: 'no-reply@yourapp.com',
            to: email,
            subject: 'Password Reset Request',
            html: `
              <p>Dear user,</p>
              <p>We received a request to reset the password associated with your account. Please click the link below to set a new password:</p>
              <p><a href="${resetUrl}" style="color: #3366cc;">Reset your password</a></p>
              <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
              <p>Thank you,<br>Peter's Shop Support Team</p>
            `,
        };
        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Failed to send email' });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Password reset email sent' });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
router.post('/verify-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    try {
        const user = yield userInfo_1.UserInfo.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Check if token is still valid
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Return the email associated with the token
        res.status(200).json({
            message: 'Token is valid',
            email: user.email
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
router.post('/change-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword, token } = req.body;
    if (!email || !newPassword || !token) {
        return res.status(400).json({ message: 'Email, password, and token are required' });
    }
    try {
        // Find the user by email and reset token, ensure the token is not expired
        const user = yield userInfo_1.UserInfo.findOne({
            email,
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() } // Ensure token is still valid
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Update the user's password and clear the reset token and expiry
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        // Save the updated user
        yield user.save();
        // Send a success response
        res.status(200).json({ message: 'Password successfully updated' });
    }
    catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
