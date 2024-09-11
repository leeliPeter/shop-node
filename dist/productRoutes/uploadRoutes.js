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
const multer_1 = __importDefault(require("multer"));
const gridfs_setup_1 = require("../config/gridfs-setup");
const router = express_1.default.Router();
// Configure multer for file upload
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded.' });
//     }
//     const { originalname, buffer } = req.file;
//     const writeStream = gfs.openUploadStream(originalname, {
//       contentType: req.file.mimetype,
//     });
//     writeStream.end(buffer);
//     writeStream.on('finish', () => {
//       res.status(200).json({ message: 'File uploaded successfully.' });
//     });
//     writeStream.on('error', (error) => {
//       res.status(500).json({ message: 'Error uploading file.', error });
//     });
//   });
router.get('/image/:filename', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query the 'uploads.files' collection to find the file by filename
        const files = yield gridfs_setup_1.gfs.find({ filename: req.params.filename }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'File not found.' });
        }
        // If file is found, open a download stream and pipe it to the response
        const readStream = gridfs_setup_1.gfs.openDownloadStreamByName(req.params.filename);
        res.set('Content-Type', files[0].contentType || 'application/octet-stream');
        readStream.pipe(res);
        readStream.on('error', (err) => {
            console.log('Error during file streaming:', err);
            res.status(500).json({ message: 'Error retrieving the file.', error: err });
        });
    }
    catch (error) {
        console.error('Error while fetching image:', error);
        res.status(500).json({ message: 'Error retrieving the file.', error });
    }
}));
exports.default = router;
