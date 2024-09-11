import express, { Request, Response } from 'express';
import multer from 'multer';
import { gfs } from '../config/gridfs-setup'

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
  

  router.get('/image/:filename', async (req, res) => {
    try {
        // Query the 'uploads.files' collection to find the file by filename
        const files = await gfs.find({ filename: req.params.filename }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'File not found.' });
        }

        // If file is found, open a download stream and pipe it to the response
        const readStream = gfs.openDownloadStreamByName(req.params.filename);
        res.set('Content-Type', files[0].contentType || 'application/octet-stream');
        readStream.pipe(res);

        readStream.on('error', (err) => {
            console.log('Error during file streaming:', err);
            res.status(500).json({ message: 'Error retrieving the file.', error: err });
        });
    } catch (error) {
        console.error('Error while fetching image:', error);
        res.status(500).json({ message: 'Error retrieving the file.', error });
    }
});
  

export default router;
