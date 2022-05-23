import mongoose from "mongoose";
import config from "../config.js";

export default async () => {
    if (!(config.db_uri || (config.db_host && config.db_port && config.db_name))) {
        console.error(`Either 'DB_URI' or 'DB_HOST', 'DB_PORT' and 'DB_NAME' must be specified in the env file! 
        See README.md for details.`);
        process.exit(125);
    }

    const options = {
        user: config.db_user,
        pass: config.db_pass,
        dbName: config.db_name,
        useNewUrlParser: true,
    };

    try {
        await mongoose.connect(config.db_uri, options);
    } catch (err) {
        console.error("Mongoose: failure in initial connection to the DB (aborting, will not retry)", err);
        process.exit(44);
    }

    mongoose.connection.on("error", (err) => {
        console.error("Mongoose connection error:", err);
    });
};
