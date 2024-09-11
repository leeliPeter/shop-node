import mongoose from 'mongoose';
import { GridFSBucket, Db } from 'mongodb'; // Import Db from the mongodb package

// Create the connection
const conn = mongoose.createConnection('mongodb+srv://manager:12345678a@cluster0.63awn.mongodb.net/myShop?retryWrites=true&w=majority&appName=Cluster0') as mongoose.Connection & { db: Db };

// Initialize GridFSBucket
let gfs: GridFSBucket;

conn.once('open', () => {
  if (conn.db) {
    gfs = new GridFSBucket(conn.db, {
      bucketName: 'uploads' // Collection name for file storage
    });
  } else {
    throw new Error('Database connection is not established.');
  }
});

export { gfs };
