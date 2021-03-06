import { Router } from "express";

import * as validators from "../middleware/location.js";

import LocationService from "../../service/location.js";

const router = Router();

export default (app) => {
    app.use("/location", router);

    router.get("/search",
        validators.search,
        async (req, res, next) => {

            try {
                const locations = await new LocationService().search(req.query.searchTerm);

                return res.json(locations);
            } catch (err) {
                console.error(err);
                return next(err);
            }
        });

    router.post("/add", () => {});
};
