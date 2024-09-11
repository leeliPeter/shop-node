"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gfs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb"); // Import Db from the mongodb package
// Create the connection
const conn = mongoose_1.default.createConnection('mongodb+srv://manager:12345678a@cluster0.63awn.mongodb.net/myShop?retryWrites=true&w=majority&appName=Cluster0');
// Initialize GridFSBucket
let gfs;
conn.once('open', () => {
    if (conn.db) {
        exports.gfs = gfs = new mongodb_1.GridFSBucket(conn.db, {
            bucketName: 'uploads' // Collection name for file storage
        });
    }
    else {
        throw new Error('Database connection is not established.');
    }
});
