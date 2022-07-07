import Location from "../model/Location.js";

class LocationService {

    static get MAX_LOCATIONS() {
        return 10;
    }

    static get LOCATION_FIELDS() {
        return [
            "-_id",
            "-score",
            "-citySearch",
            "-countrySearch",
            "-__v"
        ];
    }

    async search(searchTerm) {

        const result = await Location.find(
            { $text: { $search: `"${searchTerm}"` } },
            { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } })
            .select(LocationService.LOCATION_FIELDS.join(" "))
            .limit(LocationService.MAX_LOCATIONS);

        return result;
    }

}

export default LocationService;
