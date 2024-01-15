require('dotenv').config();
const { DB_HOST, PORT, SECRET_KEY } = process.env;

module.exports = {
	port: PORT,
	dbHost: DB_HOST,
	jwtSecret: SECRET_KEY,
};
