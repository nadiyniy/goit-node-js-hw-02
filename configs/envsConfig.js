require('dotenv').config()
const { DB_HOST, PORT, SECRET_KEY, BREVO_KEY, EMAIL, EMAIL_PAS, BASE_URL } = process.env

module.exports = {
	port: PORT,
	dbHost: DB_HOST,
	jwtSecret: SECRET_KEY,
	brevoKye: BREVO_KEY,
	email: EMAIL,
	emailPas: EMAIL_PAS,
	baseURL: BASE_URL,
}
