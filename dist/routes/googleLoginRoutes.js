"use strict";
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
const google_auth_library_1 = require("google-auth-library");
const userInfo_1 = require("../schema/userInfo");
const router = express_1.default.Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '399574814517-8e8bv109negr0b0odgl3mbficed3qgnc.apps.googleusercontent.com';
const client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
// Route to handle Google login
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    try {
        // Verify and process the token, and send back user info
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        const { sub: googleId, email, name } = payload;
        // Use a fallback value for 'name' if it's undefined
        const userName = name || email;
        let user = yield userInfo_1.UserInfo.findOne({ email });
        if (!user) {
            const userId = `user-${Date.now()}`;
            user = new userInfo_1.UserInfo({
                userId,
                name: userName,
                email,
                password: '', // You may still need this if it's required by schema
                subscribe: false,
                cart: [],
                orderHistory: [],
                registerDate: new Date().toISOString(),
                profile: {
                    email: email,
                    firstName: '',
                    lastName: '',
                    phone: '',
                    country: '',
                    state: '',
                    city: '',
                    zip: '',
                    address: ''
                }
            });
            yield user.save();
        }
        req.session.user = {
            userId: user.userId,
            email: user.email,
            name: user.name,
        };
        res.json({
            message: 'Google login successful',
            userInfo: {
                userId: user.userId,
                name: user.name,
                email: user.email,
                cart: user.cart,
                orderHistory: user.orderHistory,
                registerDate: user.registerDate,
                profile: user.profile,
            }
        });
    }
    catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
