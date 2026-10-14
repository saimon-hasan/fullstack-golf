import 'dotenv/config';
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// 1. SERVE STATIC FILES (This fixes the "Cannot GET /" error)
// This tells Express to look in the 'public' folder for index.html, styles.css, etc.
app.use(express.static(path.resolve('public')));

app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// --- API ROUTES ---

app.get('/api/items', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const items = await db.collection('items').find({}).toArray();
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch items" });
    }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const item = await db.collection('items').findOne({ _id: new ObjectId(req.params.id) });
        if (!item) return res.status(404).json({ error: "Item not found" });
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: "Invalid ID format" });
    }
});

app.post('/api/items', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const result = await db.collection('items').insertOne(req.body);
        res.status(201).json({ message: "Item created!", id: result.insertedId });
    } catch (e) {
        res.status(500).json({ error: "Failed to create item" });
    }
});

app.patch('/api/items/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const result = await db.collection('items').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.json({ message: "Item updated!", modifiedCount: result.modifiedCount });
    } catch (e) {
        res.status(500).json({ error: "Update failed" });
    }
});

app.delete('/api/items/:id', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const result = await db.collection('items').deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Item deleted!", deletedCount: result.deletedCount });
    } catch (e) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// --- SERVER STARTUP ---

async function startServer() {
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas");
        const db = client.db('hotel_db'); 
        app.locals.db = db; 
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error("❌ MongoDB connection error:", e);
        process.exit(1);
    }
}

startServer();