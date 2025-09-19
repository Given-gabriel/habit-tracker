import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", true);

export default async function connectDB() {
  const url = process.env.MONGO_URL;
  if (!url) throw new Error("MONGO_URL is not defined ");

  mongoose.connection.on("connected", () => {
    console.log("Connected to DB");
  });

  mongoose.connection.on("error", (err) =>
    console.log("MongoDB error connecting", err)
  );
  mongoose.connection.on("disconnected", () =>
    console.log("MongoDB disconnected")
  );

  try {
    await mongoose.connect(url);
  } catch (err) {
    console.log(err);
    throw err;
  }
}
