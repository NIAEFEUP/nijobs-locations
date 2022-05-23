import mongooseLoader from "./mongoose.js";
import expressLoader from "./express.js";

export default async ({ expressApp }) => {
    await mongooseLoader();
    console.info("Mongoose DB connection initialized");
    await expressLoader(expressApp);
    console.info("Express initialized");
};