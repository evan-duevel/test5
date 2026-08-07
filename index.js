import express from "express";
import cors from "cors";
import multer from "multer";
import { Client, Storage, Databases, ID } from "node-appwrite";

const app = express();
app.use(cors()); // ⭐ FIX: allow requests from React
app.use(express.json());

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Appwrite client
    const client = new Client()
      .setEndpoint("https://sfo.cloud.appwrite.io/v1") // e.g. https://sfo.cloud.appwrite.io/v1
      .setProject("6a66c94d0001f60a4293")
      .setKey("standard_cc67a33c3e0d731718385d13326a1b68485cf7e5b6b2d9c6e4200b2d5cd497fad2c39e0e1cba4bdf939a298c93b48ce20cb31f24b537650ec04ada0b908eabd2d438cc93cdf21265f2d191e2891c8a9214b378904f281390dae2cc8483eb749de6f996fd86511984ff16b93d83c86ca665ba3f5602a76ad847a6969120f9681d");

    const storage = new Storage(client);
    const databases = new Databases(client);

    // 1️⃣ Upload file to Appwrite Storage
    const uploaded = await storage.createFile(
      "6a764238002e1a726719",
      ID.unique(),
      req.file.buffer
    );

    // 2️⃣ Build public URL
    const fileUrl =
      `${"https://sfo.cloud.appwrite.io/v1"}/storage/buckets/` +
      `${"6a764238002e1a726719"}/files/${uploaded.$id}/view?project=` +
      `${"6a66c94d0001f60a4293"}`;

    // 3️⃣ Save URL into "posts" collection
    const saved = await databases.createDocument(
      "6a6a605d001a0c4ca679",
      "posts",
      ID.unique(),
      {
        url: fileUrl,
        filename: req.file.originalname,
        fileId: uploaded.$id
      }
    );

    res.json({
      message: "File uploaded and saved!",
      fileUrl,
      post: saved
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Railway PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
