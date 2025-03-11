const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

const env = process.env;

/* console.log(env); */

module.exports = { env };
