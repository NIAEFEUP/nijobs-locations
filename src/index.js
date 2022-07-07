import config from "./config.js";

import loaders from "./loaders/index.js";
import express from "express";

const app = express();

const startServer = async () => {
    await loaders({ expressApp: app });

    if (process.env.NODE_ENV !== "test") {

        // TODO: possibly setup HTTPS

        app.listen(config.port, (err) => {
            if (err) {
                console.error(err);
                return;
            }

            console.info(`Server listening on port ${config.port}`);
        });
    }
};

startServer();

if (process.env.NODE_ENV === "test") {
    // Necessary for test HTTP requests (End-to-End testing)
    module.exports = app;
}
