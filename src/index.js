import config from "./config.js";

// import loaders from "./loaders/index.js";
import express from "express";

const app = express();

const startServer = async () => {
    // await loaders({ expressApp: app });

    app.listen(config.port, (err) => {
        if (err) {
            console.error(err);
            return;
        }

        console.info(`Server listening on port ${config.port}`);
    });
};

startServer();
