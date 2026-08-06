import express from "express";
import { Client, Databases } from "node-appwrite";

const app = express();

app.get("/", async (req, res) => {
  try {
    const client = new Client()
      .setEndpoint("https://sfo.cloud.appwrite.io/v1")
      .setProject("6a66c94d0001f60a4293")
      .setKey("standard_cc67a33c3e0d731718385d13326a1b68485cf7e5b6b2d9c6e4200b2d5cd497fad2c39e0e1cba4bdf939a298c93b48ce20cb31f24b537650ec04ada0b908eabd2d438cc93cdf21265f2d191e2891c8a9214b378904f281390dae2cc8483eb749de6f996fd86511984ff16b93d83c86ca665ba3f5602a76ad847a6969120f9681d");

    const databases = new Databases(client);

    const result = await databases.listDocuments(
      "6a6a605d001a0c4ca679",
      "practive"
    );

    res.json({
      message: "Appwrite + Railway backend is running!",
      data: result
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Railway uses PORT env automatically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
