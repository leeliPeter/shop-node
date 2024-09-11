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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userInfo_1 = require("../schema/userInfo"); // Ensure the correct model is used
const router = express_1.default.Router();
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const { userId, updatedInfo } = req.body;
    const currentUserId = req.session.user.userId;
    if (userId !== currentUserId) {
        return res.status(403).json({ message: 'Forbidden: Cannot update other users' });
    }
    if ('userId' in updatedInfo) {
        return res.status(400).json({ message: 'Cannot change userId.' });
    }
    // Exclude the password field from the update
    const { password } = updatedInfo, infoToUpdate = __rest(updatedInfo, ["password"]);
    try {
        const user = yield userInfo_1.UserInfo.findOneAndUpdate({ userId }, { $set: infoToUpdate }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User info updated successfully.', userInfo: user });
    }
    catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ message: 'Failed to update user info.' });
    }
}));
exports.default = router;
