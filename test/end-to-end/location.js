import * as HTTPStatus from "http-status-codes";

import Location, { LocationConstants } from "../../src/model/Location";
import LocationService from "../../src/service/location";
import ValidationReasons from "../../src/api/middleware/validationReasons";

import { createSearchIndexTokens } from "../../src/lib/CSVtoDBLoader";

describe("Location endpoint tests", () => {
    describe("GET /location/search", () => {

        let new_york, lisbon;

        beforeAll(async () => {

            await Location.deleteMany({});

            [new_york, lisbon] = await Location.create([
                {
                    city: "New York",
                    citySearch: createSearchIndexTokens("New York"),
                    country: "United States",
                    countrySearch: createSearchIndexTokens("United States"),
                    latitude: 40.6943,
                    longitude: -73.9249
                },
                {
                    city: "Lisbon",
                    citySearch: createSearchIndexTokens("Lisbon"),
                    country: "Portugal",
                    countrySearch: createSearchIndexTokens("Portugal"),
                    latitude: 38.7452,
                    longitude: -9.1604
                }
            ]);

            // ensure there are more than the limit
            await Location.create(Array(LocationService.MAX_LOCATIONS).fill({
                city: "Lisb",
                citySearch: "Lisb",
                country: "United",
                countrySearch: "United",
                latitude: 0,
                longitude: 0
            }));
        });

        afterAll(async () => {
            await Location.deleteMany({});
        });

        test("Should fail if no search term provided", async () => {

            const res = await request()
                .get("/location/search")
                .expect(HTTPStatus.UNPROCESSABLE_ENTITY);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors.length).toBe(1);
            expect(res.body.errors[0]).toEqual({
                msg: ValidationReasons.REQUIRED,
                param: "searchTerm",
                location: "query"
            });
        });

        test("Should fail if search term provided too short", async () => {

            const res = await request()
                .get("/location/search?searchTerm=")
                .expect(HTTPStatus.UNPROCESSABLE_ENTITY);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors.length).toBe(1);
            expect(res.body.errors[0]).toEqual({
                msg: ValidationReasons.TOO_SHORT(LocationConstants.searchTerm.minLength),
                param: "searchTerm",
                location: "query",
                value: ""
            });
        });

        test("Should return at most 'LocationService.MAX_LOCATIONS' results", async () => {

            const res = await request()
                .get("/location/search?searchTerm=\"Lisb\"")
                .expect(HTTPStatus.OK);

            expect(res.body).toHaveProperty("length", LocationService.MAX_LOCATIONS);
        });

        test("Should return city if exact match (city)", async () => {

            const res = await request()
                .get(`/location/search?searchTerm="${lisbon.city}"`)
                .expect(HTTPStatus.OK);

            const expected = {
                city: lisbon.city,
                country: lisbon.country,
                latitude: lisbon.latitude,
                longitude: lisbon.longitude
            };

            expect(res.body).toContainEqual(expected);
        });

        test("Should return city if substring match (city)", async () => {

            const res = await request()
                .get(`/location/search?searchTerm="${new_york.city.split(0, 6)}"`)
                .expect(HTTPStatus.OK);

            const expected = {
                city: new_york.city,
                country: new_york.country,
                latitude: new_york.latitude,
                longitude: new_york.longitude
            };

            expect(res.body).toContainEqual(expected);
        });
    });
});
