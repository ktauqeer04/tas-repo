const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGODB_CONNECTION;
const JWT_SECRET = process.env.SECRET;

module.exports = {
    PORT,
    MONGO_URL,
    JWT_SECRET
}