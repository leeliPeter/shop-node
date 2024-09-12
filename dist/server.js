"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const userUpdateRoutes_1 = __importDefault(require("./routes/userUpdateRoutes"));
const resetPwdRoutes_1 = __importDefault(require("./routes/resetPwdRoutes"));
const googleLoginRoutes_1 = __importDefault(require("./routes/googleLoginRoutes"));
const uploadRoutes_1 = __importDefault(require("./productRoutes/uploadRoutes"));
const getProductInfoRoutes_1 = __importDefault(require("./routes/getProductInfoRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const app = (0, express_1.default)();
const port = 3001;
// CORS configuration
app.use((0, cors_1.default)({
    origin: 'https://petershops.com',
    credentials: true,
}));
// MongoDB connection
const uri = "mongodb+srv://manager:12345678a@cluster0.63awn.mongodb.net/myShop?retryWrites=true&w=majority&appName=Cluster0";
mongoose_1.default.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));
// Middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({ mongoUrl: uri, collectionName: 'sessions' }),
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600 * 1000,
    }
}));
// API routes
app.use('/user', userRoutes_1.default);
app.use('/user-update', userUpdateRoutes_1.default);
app.use('/reset-password', resetPwdRoutes_1.default);
app.use('/google-login', googleLoginRoutes_1.default);
app.use('/upload', uploadRoutes_1.default);
app.use('/get-product', getProductInfoRoutes_1.default);
app.use('/order', orderRoutes_1.default);
// Serve static files from react-dist
app.use(express_1.default.static(path_1.default.join(__dirname, '../react-dist')));
// Serve the frontend app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../react-dist/index.html'));
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
