import dotenvflow from "dotenv-flow";

dotenvflow.config();

const generateDBUriFromEnv = () => {
    if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_NAME)
        throw new Error("Missing DB Params to generate URI. Either pass a DB_URI or (DB_HOST, DB_PORT and DB_NAME) in .env");

    return `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
};

export default Object.freeze({
    // Database
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_name: process.env.DB_NAME,
    db_uri: process.env.DB_URI || generateDBUriFromEnv(),
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,

    // App
    port: process.env.PORT,
    god_token: process.env.GOD_TOKEN,
    access_control_allow_origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN || "*",
});