import * as HTTPStatus from "http-status-codes";

describe("Testing entry point", () => {
    test("Health check", async () => {
        const res = await request()
            .get("/")
            .expect(HTTPStatus.OK);

        expect(res.body).toHaveProperty("online", true);
    });
});
