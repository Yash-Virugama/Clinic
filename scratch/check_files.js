import mongoose from "mongoose";
import { ClinicCaseFile } from "../server/src/models/clinicCaseFile.js";

const MONGO_URI = "mongodb://localhost:27017/clinic" || "mongodb://127.0.0.1:27017/clinic";

async function checkFiles() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const files = await ClinicCaseFile.find({});
    console.log(`Found ${files.length} files:`);
    files.forEach((f, index) => {
      console.log(`[${index + 1}] name: "${f.fileName}", url: "${f.fileUrl}"`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

checkFiles();
