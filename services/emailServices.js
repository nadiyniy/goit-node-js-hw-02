// const brevo = require("@getbrevo/brevo");
// const { envsConfig } = require("../configs");

// const apiInstance = new brevo.TransactionalEmailsApi();

// apiInstance.authentications.apiKey.apiKey = envsConfig.brevoKey;

// const email = {
//   subject: "Test",
//   sender: { email: envsConfig.email, name: "Vlad" },
//   to: [{ email: "vasilyuk95@gmail.com" }],
//   htmlContent: "<html><body><div>Hello, user !</div></body></html>",
// };

// apiInstance.sendTransacEmail(email).then(() => {
// });

const nodemailer = require('nodemailer')
const { envsConfig } = require('../configs')

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: envsConfig.email,
		pass: envsConfig.emailPas,
	},
})

// const email = {
//   subject: "Test",
//   from: envsConfig.email,
//   to: "vasilyuk95@gmail.com",
//   html: "<div>Hello, user !</div>",
// };

const sendEMail = async data => {
	const email = { ...data, from: envsConfig.email }
	await transporter.sendMail(email)
	return true
}

module.exports = sendEMail

// transporter.sendMail(email);
