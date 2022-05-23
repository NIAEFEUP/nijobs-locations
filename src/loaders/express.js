import express from "express";
import morgan from "morgan";
// import helmet from "helmet";
import HTTPStatus from "http-status-codes";
// import RateLimit from "express-rate-limit";
// import MongoStore from "rate-limit-mongo";

import apiRoutes from "../api/index.js";
import config from "../config.js";
import { defaultErrorHandler } from "../api/middleware/errorHandler.js";

// const API_REQUEST_TIME_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
// const API_MAX_REQUESTS_PER_WINDOW = 100;

export default (app) => {

    // JSON bodyparser (parses JSON request body into req.body)
    app.use(express.json());

    // Set the API call rate limit only on production
    /* if (process.env.NODE_ENV === "production") {
        const api_rate_limiter = new RateLimit({
            store: new MongoStore({
                uri: config.db_uri,
                user: config.db_user,
                password: config.db_pass,
            }),
            windowMs: API_REQUEST_TIME_WINDOW_MS,
            max: API_MAX_REQUESTS_PER_WINDOW,
            message: {
                error: "Too many requests issued from this IP, please try again after a while",
            },
        });

        // Adds rate limit to all routes
        app.use(api_rate_limiter);
    } */

    // Adds protection to common attacks
    // Check https://helmetjs.github.io/#how-it-works to see a list of features
    // app.use(helmet());

    // Adds route logging
    if (process.env.NODE_ENV !== "test") {
        app.use(morgan("common"));
    }

    // Adding headers (CORS)
    app.use((_, res, next) => {
        // Allow connections for all origins
        res.setHeader("Access-Control-Allow-Origin", config.access_control_allow_origin);
        // Allowed request methods
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        // Allowed request headers
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, authorization");
        // Because we need the website to include cookies in the requests sent
        // to the API (we are using sessions)
        res.setHeader("Access-Control-Allow-Credentials", true);
        // Continue to next layer of middleware
        return next();
    });

    // Health check endpoint
    app.get("/", (_, res) => res.status(HTTPStatus.OK).json({ "online": true }));

    // Registering the application's routes
    // Using no prefix as the app will be mapped to /api anyway in the production server
    app.use(apiRoutes());

    // - Error handling
    // Adds default error catcher as last resort
    app.use(defaultErrorHandler);
};
