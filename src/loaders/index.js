import mongooseLoader from "./mongoose.js";
import expressLoader from "./express.js";

import { loadCSVDataToDB } from "../lib/CSVtoDBLoader.js";

export default async ({ expressApp }) => {
    await mongooseLoader();
    console.info("Mongoose DB connection initialized");
    await loadCSVDataToDB();
    console.info("City data loaded to DB");
    await expressLoader(expressApp);
    console.info("Express initialized");
};
