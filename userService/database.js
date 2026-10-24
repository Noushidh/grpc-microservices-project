import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, ".env")
});

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectDB() {
    try {
        await client.connect();

        console.log("MongoDB connected successfully!");

        const db = client.db(process.env.DB_NAME);

        return db;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
}
