import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Determine which URI to use: prefer Atlas (MONGODB_URI) then fallback to local (MONGODB_URI_LOCAL)
const getMongoUri = () => {
    const atlas = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();
    const local = process.env.MONGODB_URI_LOCAL && process.env.MONGODB_URI_LOCAL.trim();

    if (atlas) {
        return { uri: atlas, source: 'atlas' };
    }
    if (local) {
        return { uri: local, source: 'local' };
    }
    throw new Error('No MongoDB URI provided. Set MONGODB_URI (Atlas) or MONGODB_URI_LOCAL (local).');
};

const connectDB = async () => {
    const { uri, source } = getMongoUri();
    try {
        console.log(`Attempting MongoDB connection using ${source} URI...`);
        const conn = await mongoose.connect(uri, {
            // You can add options here if needed, e.g. serverSelectionTimeoutMS
        });
        console.log(`MongoDB Connected (${source}): ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error (${source}): ${error.message}`);
        // If atlas attempt fails and a local URI exists (and atlas was first), try fallback automatically
        if (source === 'atlas') {
            const local = process.env.MONGODB_URI_LOCAL && process.env.MONGODB_URI_LOCAL.trim();
            if (local) {
                try {
                    console.log('Falling back to local MongoDB (MONGODB_URI_LOCAL)...');
                    const conn = await mongoose.connect(local);
                    console.log(`MongoDB Connected (fallback local): ${conn.connection.host}`);
                    return;
                } catch (fallbackErr) {
                    console.error(`Fallback local connection failed: ${fallbackErr.message}`);
                }
            }
        }
        process.exit(1);
    }
};

export default connectDB;