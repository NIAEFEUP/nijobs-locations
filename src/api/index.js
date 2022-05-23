import { Router } from "express";
import location from "./routes/location.js";

export default () => {
    const app = Router();

    location(app);

    return app;
};