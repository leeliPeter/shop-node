declare module 'gridfs-stream' {
    import { Db } from 'mongodb';
    import { Mongoose } from 'mongoose';
  
    export default function GridFSStream(db: Db, mongoose: Mongoose): any;
  }
  